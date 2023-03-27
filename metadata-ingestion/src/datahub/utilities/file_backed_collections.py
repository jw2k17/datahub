import collections
import logging
import pathlib
import pickle
import sqlite3
import tempfile
from dataclasses import dataclass, field
from datetime import datetime
from types import TracebackType
from typing import (
    Any,
    Callable,
    Dict,
    Generic,
    Iterator,
    List,
    MutableMapping,
    Optional,
    OrderedDict,
    Sequence,
    Tuple,
    Type,
    TypeVar,
    Union,
)

from datahub.ingestion.api.closeable import Closeable

logger: logging.Logger = logging.getLogger(__name__)

_DEFAULT_FILE_NAME = "sqlite.db"
_DEFAULT_TABLE_NAME = "data"
_DEFAULT_MEMORY_CACHE_MAX_SIZE = 2000
_DEFAULT_MEMORY_CACHE_EVICTION_BATCH_SIZE = 200

# https://docs.python.org/3/library/sqlite3.html#sqlite-and-python-types
# Datetimes get converted to strings
SqliteValue = Union[int, float, str, bytes, datetime, None]

_VT = TypeVar("_VT")


class ConnectionWrapper:
    """
    Wraps a SQlite connection, allowing connection reuse across multiple FileBacked* objects.

    This is necessary because we're using exclusive locking mode.
    It's useful to keep data from multiple FileBacked* objects in the same
    SQLite database because it allows us to perform queries across multiple tables.

    Also provides file cleanup using TemporaryDirectory, query debug logging, and
    a context manager interface.
    """

    conn: sqlite3.Connection
    filename: pathlib.Path
    _directory: Optional[tempfile.TemporaryDirectory]

    def __init__(self, filename: Optional[pathlib.Path] = None):
        self._directory = None
        # Warning: If filename is provided, the file will not be automatically cleaned up
        if not filename:
            self._directory = tempfile.TemporaryDirectory()
            filename = pathlib.Path(self._directory.name) / _DEFAULT_FILE_NAME

        self.conn = sqlite3.connect(filename, isolation_level=None)
        self.filename = filename

        # These settings are optimized for performance.
        # See https://www.sqlite.org/pragma.html for more information.
        # Because we're only using these dbs to offload data from memory, we don't need
        # to worry about data integrity too much.
        self.conn.execute('PRAGMA locking_mode = "EXCLUSIVE"')
        self.conn.execute('PRAGMA synchronous = "OFF"')
        self.conn.execute('PRAGMA journal_mode = "MEMORY"')
        self.conn.execute(f"PRAGMA journal_size_limit = {100 * 1024 * 1024}")  # 100MB

    def execute(
        self, sql: str, parameters: Union[Dict[str, Any], Sequence[Any]] = ()
    ) -> sqlite3.Cursor:
        logger.debug(f"Executing <{sql}> ({parameters})")
        return self.conn.execute(sql, parameters)

    def executemany(
        self, sql: str, parameters: Union[Dict[str, Any], Sequence[Any]] = ()
    ) -> sqlite3.Cursor:
        logger.debug(f"Executing many <{sql}> ({parameters})")
        return self.conn.executemany(sql, parameters)

    def close(self) -> None:
        self.conn.close()
        if self._directory:
            self._directory.cleanup()

    def __enter__(self) -> "ConnectionWrapper":
        return self

    def __exit__(
        self,
        exc_type: Optional[Type[BaseException]],
        exc_val: Optional[BaseException],
        exc_tb: Optional[TracebackType],
    ) -> None:
        self.close()

    def __del__(self) -> None:
        self.close()


# DESIGN: Why is pickle the default serializer/deserializer?
#
# Benefits:
# (1) In my comparisons of pickle vs manually generating a Python object
#     and then calling json.dumps on it, pickle was consistently slightly faster
#     for both reads and writes.
# (2) The interface is simpler - you don't have to write a custom serializer.
#     This is especially useful when dealing with non-standard types like
#     collections.Counter or datetime.
# (3) Pickle is built-in to Python and requires no additional dependencies.
#     It's true that we might be able to eek out a bit more performance by
#     using a faster serializer like msgpack or cbor.
#
# Downsides:
# (1) The serialized data is not human-readable.
# (2) For simple types like ints, it has slightly worse performance.
#
# Overall, pickle seems like the right default choice.
def _default_serializer(value: Any) -> SqliteValue:
    return pickle.dumps(value)


def _default_deserializer(value: Any) -> Any:
    return pickle.loads(value)


@dataclass(eq=False)
class FileBackedDict(MutableMapping[str, _VT], Generic[_VT], Closeable):
    """
    A dict-like object that stores its data in a temporary SQLite database.
    This is useful for storing large amounts of data that don't fit in memory.

    This class is not thread-safe.
    """

    # Use a predefined connection, able to be shared across multiple FileBacked* objects
    shared_connection: Optional[ConnectionWrapper] = None
    tablename: str = _DEFAULT_TABLE_NAME

    serializer: Callable[[_VT], SqliteValue] = _default_serializer
    deserializer: Callable[[Any], _VT] = _default_deserializer
    extra_columns: Dict[str, Callable[[_VT], SqliteValue]] = field(default_factory=dict)

    cache_max_size: int = _DEFAULT_MEMORY_CACHE_MAX_SIZE
    cache_eviction_batch_size: int = _DEFAULT_MEMORY_CACHE_EVICTION_BATCH_SIZE

    _conn: ConnectionWrapper = field(init=False, repr=False)

    # To improve performance, we maintain an in-memory LRU cache using an OrderedDict.
    # Maintains a dirty bit marking whether the value has been modified since it was persisted.
    _active_object_cache: OrderedDict[str, Tuple[_VT, bool]] = field(
        init=False, repr=False
    )

    def __post_init__(self) -> None:
        assert (
            self.cache_eviction_batch_size > 0
        ), "cache_eviction_batch_size must be positive"

        assert "key" not in self.extra_columns, '"key" is a reserved column name'
        assert "value" not in self.extra_columns, '"value" is a reserved column name'

        if self.shared_connection:
            self._conn = self.shared_connection
        else:
            self._conn = ConnectionWrapper()

        # We keep a small cache in memory to avoid having to serialize/deserialize
        # data from the database too often. We use an OrderedDict to build
        # a poor-man's LRU cache.
        self._active_object_cache = collections.OrderedDict()

        # Create the table. We're not using "IF NOT EXISTS" because creating
        # the same table twice indicates a client usage error.
        self._conn.execute(
            f"""CREATE TABLE {self.tablename} (
                key TEXT PRIMARY KEY,
                value BLOB
                {''.join(f', {column_name} BLOB' for column_name in self.extra_columns.keys())}
            )"""
        )

        # The key column will automatically be indexed, but we need indexes
        # for the extra columns.
        for column_name in self.extra_columns.keys():
            self._conn.execute(
                f"CREATE INDEX {self.tablename}_{column_name} ON {self.tablename} ({column_name})"
            )

    def _add_to_cache(self, key: str, value: _VT, dirty: bool) -> None:
        self._active_object_cache[key] = value, dirty

        if len(self._active_object_cache) > self.cache_max_size:
            # Try to prune in batches rather than one at a time.
            num_items_to_prune = min(
                len(self._active_object_cache), self.cache_eviction_batch_size
            )
            self._prune_cache(num_items_to_prune)

    def _prune_cache(self, num_items_to_prune: int) -> None:
        items_to_write: List[Tuple[SqliteValue, ...]] = []
        for _ in range(num_items_to_prune):
            key, (value, dirty) = self._active_object_cache.popitem(last=False)
            if dirty:
                values = [key, self.serializer(value)]
                for column_serializer in self.extra_columns.values():
                    values.append(column_serializer(value))
                items_to_write.append(tuple(values))

        if items_to_write:
            self._conn.executemany(
                f"""INSERT OR REPLACE INTO {self.tablename} (
                    key,
                    value
                    {''.join(f', {column_name}' for column_name in self.extra_columns.keys())}
                )
                VALUES ({', '.join(['?'] *(2 + len(self.extra_columns)))})""",
                items_to_write,
            )

    def flush(self) -> None:
        self._prune_cache(len(self._active_object_cache))

    def __getitem__(self, key: str) -> _VT:
        if key in self._active_object_cache:
            self._active_object_cache.move_to_end(key)
            return self._active_object_cache[key][0]

        cursor = self._conn.execute(
            f"SELECT value FROM {self.tablename} WHERE key = ?", (key,)
        )
        result: Sequence[SqliteValue] = cursor.fetchone()
        if result is None:
            raise KeyError(key)

        deserialized_result = self.deserializer(result[0])
        self._add_to_cache(key, deserialized_result, False)
        return deserialized_result

    def __setitem__(self, key: str, value: _VT) -> None:
        self._add_to_cache(key, value, True)

    def __delitem__(self, key: str) -> None:
        in_cache = False
        if key in self._active_object_cache:
            del self._active_object_cache[key]
            in_cache = True

        n_deleted = self._conn.execute(
            f"DELETE FROM {self.tablename} WHERE key = ?", (key,)
        ).rowcount
        if not in_cache and not n_deleted:
            raise KeyError(key)

    def mark_dirty(self, key: str) -> None:
        if key in self._active_object_cache and not self._active_object_cache[key][1]:
            self._active_object_cache[key] = self._active_object_cache[key][0], True

    def __iter__(self) -> Iterator[str]:
        # Cache should be small, so safe list cast to avoid mutation during iteration
        cache_keys = set(self._active_object_cache.keys())
        yield from cache_keys

        cursor = self._conn.execute(f"SELECT key FROM {self.tablename}")
        for row in cursor:
            if row[0] not in cache_keys:
                yield row[0]

    def items_snapshot(self) -> Iterator[Tuple[str, _VT]]:
        """Return a fixed snapshot, rather than a view, of the dictionary's items.

        Provides better performance over standard `items()` method
        """
        cache_keys = set(self._active_object_cache.keys())
        yield from ((k, v[0]) for k, v in self._active_object_cache.items())

        cursor = self._conn.execute(f"SELECT key, value FROM {self.tablename}")
        for row in cursor:
            if row[0] not in cache_keys:
                yield row[0], self.deserializer(row[1])

    def filtered_items(self, cond_sql: str) -> Iterator[Tuple[str, _VT]]:
        """
        Flush the cache and iterate through a filtered list of the dictionary's items.

        Args:
            cond_sql: Conditional expression for WHERE statement, e.g. `x = 0 AND y = "value"`

        Returns:
            Iterator of filtered (key, value) pairs.
        """
        self.flush()
        for row in self._conn.execute(
            f"SELECT key, value FROM {self.tablename} WHERE {cond_sql}"
        ):
            yield row[0], self.deserializer(row[1])

    def __len__(self) -> int:
        cursor = self._conn.execute(
            # Binding a list of values in SQLite: https://stackoverflow.com/a/1310001/5004662.
            f"SELECT COUNT(*) FROM {self.tablename} WHERE key NOT IN ({','.join('?' * len(self._active_object_cache))})",
            (*self._active_object_cache.keys(),),
        )
        row = cursor.fetchone()

        return row[0] + len(self._active_object_cache)

    def sql_query(
        self,
        query: str,
        params: Tuple[Any, ...] = (),
        refs: Optional[List[Union["FileBackedList", "FileBackedDict"]]] = None,
    ) -> List[Tuple[Any, ...]]:
        return self._sql_query(query, params, refs).fetchall()

    def sql_query_iterator(
        self,
        query: str,
        params: Tuple[Any, ...] = (),
        refs: Optional[List[Union["FileBackedList", "FileBackedDict"]]] = None,
    ) -> Iterator[Tuple[Any, ...]]:
        return self._sql_query(query, params, refs)

    def _sql_query(
        self,
        query: str,
        params: Tuple[Any, ...] = (),
        refs: Optional[List[Union["FileBackedList", "FileBackedDict"]]] = None,
    ) -> sqlite3.Cursor:
        # We need to flush object and any objects the query references to ensure
        # that we don't miss objects that have been modified but not yet flushed.
        self.flush()
        if refs is not None:
            for referenced_table in refs:
                referenced_table.flush()

        return self._conn.execute(query, params)

    def close(self) -> None:
        if self._conn:
            if self.shared_connection:  # Connection not owned by this object
                self.flush()  # Ensure everything is written out
            else:
                self._conn.close()

            # This forces all writes to go directly to the DB so they fail immediately.
            self.cache_max_size = 0
            self._conn = None  # type: ignore

    def __del__(self) -> None:
        self.close()


class FileBackedList(Generic[_VT]):
    """
    An append-only, list-like object that stores its contents in a SQLite database.

    This class is not thread-safe.
    """

    _len: int = field(default=0)
    _dict: FileBackedDict[_VT] = field(init=False)

    def __init__(
        self,
        connection: Optional[ConnectionWrapper] = None,
        tablename: str = _DEFAULT_TABLE_NAME,
        serializer: Callable[[_VT], SqliteValue] = _default_serializer,
        deserializer: Callable[[Any], _VT] = _default_deserializer,
        extra_columns: Optional[Dict[str, Callable[[_VT], SqliteValue]]] = None,
        cache_max_size: Optional[int] = None,
        cache_eviction_batch_size: Optional[int] = None,
    ) -> None:
        self._len = 0
        self._dict = FileBackedDict(
            shared_connection=connection,
            serializer=serializer,
            deserializer=deserializer,
            tablename=tablename,
            extra_columns=extra_columns or {},
            cache_max_size=cache_max_size or _DEFAULT_MEMORY_CACHE_MAX_SIZE,
            cache_eviction_batch_size=cache_eviction_batch_size
            or _DEFAULT_MEMORY_CACHE_EVICTION_BATCH_SIZE,
        )

    @property
    def tablename(self) -> str:
        return self._dict.tablename

    def __getitem__(self, index: int) -> _VT:
        if index < 0 or index >= self._len:
            raise IndexError(f"list index {index} out of range")

        return self._dict[str(index)]

    def __setitem__(self, index: int, value: _VT) -> None:
        if index < 0 or index >= self._len:
            raise IndexError(f"list index {index} out of range")

        self._dict[str(index)] = value

    def append(self, value: _VT) -> None:
        self._dict[str(self._len)] = value
        self._len += 1

    def __len__(self) -> int:
        return self._len

    def __iter__(self) -> Iterator[_VT]:
        for index in range(self._len):
            yield self[index]

    def flush(self) -> None:
        self._dict.flush()

    def sql_query(
        self,
        query: str,
        params: Tuple[Any, ...] = (),
        refs: Optional[List[Union["FileBackedList", "FileBackedDict"]]] = None,
    ) -> List[Tuple[Any, ...]]:
        return self._dict.sql_query(query, params, refs=refs)

    def close(self) -> None:
        self._dict.close()

    def __del__(self) -> None:
        self.close()
