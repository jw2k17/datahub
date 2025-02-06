import re
from enum import Enum
from typing import Iterator, List, Tuple

CONTROL_FLOW_KEYWORDS = [
    "GO",
    r"BEGIN\w+TRY",
    r"BEGIN\w+CATCH",
    "BEGIN",
    r"END\w+TRY",
    r"END\w+CATCH",
    "IF",  # This isn't strictly correct, but we assume that IF | (condition) | (block) should all be split up
    # This mainly ensures that IF statements don't get tacked onto the previous statement incorrectly
    # "ELSE",  # else is also valid in CASE, so we we can't use it here.
    # "END",  # for things like CASE, END does not mean the end of a statement
]

# There's an exception to this rule, which is when the statement
# is preceded by a CTE.
SELECT_KEYWORD = "SELECT"
NEW_STATEMENT_KEYWORDS = [
    # SELECT is used inside queries as well, so we can't include it here.
    "CREATE",
    "INSERT",
    "UPDATE",
    "DELETE",
    "MERGE",
]
STRICT_NEW_STATEMENT_KEYWORDS = [
    # For these keywords, a SELECT following it does indicate a new statement.
    "DROP",
    "TRUNCATE",
]


class _AlreadyIncremented(Exception):
    # Using exceptions for control flow isn't great - but the code is clearer so it's fine.
    pass


class ParserState(Enum):
    NORMAL = 1
    STRING = 2
    COMMENT = 3
    MULTILINE_COMMENT = 4


class _StatementSplitter:
    def __init__(self, sql: str):
        self.sql = sql

        # Parser state.
        self.i = 0
        self.state = ParserState.NORMAL
        self.current_statement: List[str] = []
        self.does_select_mean_new_statement = False

    def _is_keyword_at_position(self, pos: int, keyword: str) -> bool:
        """
        Check if a keyword exists at the given position using regex word boundaries.
        """
        sql = self.sql

        if pos + len(keyword) > len(sql):
            return False

        # If we're not at a word boundary, we can't generate a keyword.
        if pos > 0 and not (
            bool(re.match(r"\w\W", sql[pos - 1 : pos + 1]))
            or bool(re.match(r"\W\w", sql[pos - 1 : pos + 1]))
        ):
            return False

        pattern = rf"^{re.escape(keyword)}\b"
        match = re.match(pattern, sql[pos:], re.IGNORECASE)
        return bool(match)

    def _look_ahead_for_keywords(self, keywords: List[str]) -> Tuple[bool, str, int]:
        """
        Look ahead for SQL keywords at the current position.
        """

        for keyword in keywords:
            if self._is_keyword_at_position(self.i, keyword):
                return True, keyword, len(keyword)
        return False, "", 0

    def _yield_if_complete(self) -> Iterator[str]:
        statement = "".join(self.current_statement).strip()
        if statement:
            yield statement
            self.current_statement.clear()

    def process(self) -> Iterator[str]:
        if not self.sql or not self.sql.strip():
            return

        prev_real_char = "\0"  # the most recent non-whitespace, non-comment character
        while self.i < len(self.sql):
            c = self.sql[self.i]
            next_char = self.sql[self.i + 1] if self.i < len(self.sql) - 1 else "\0"

            if self.state == ParserState.NORMAL:
                if c == "'":
                    self.state = ParserState.STRING
                    self.current_statement.append(c)
                    prev_real_char = c
                elif c == "-" and next_char == "-":
                    self.state = ParserState.COMMENT
                    self.current_statement.append(c)
                    self.current_statement.append(next_char)
                    self.i += 1
                elif c == "/" and next_char == "*":
                    self.state = ParserState.MULTILINE_COMMENT
                    self.current_statement.append(c)
                    self.current_statement.append(next_char)
                    self.i += 1
                else:
                    most_recent_real_char = prev_real_char
                    if not c.isspace():
                        prev_real_char = c

                    try:
                        yield from self._process_normal(
                            most_recent_real_char=most_recent_real_char
                        )
                    except _AlreadyIncremented:
                        # Skip the normal i += 1 step.
                        continue

            elif self.state == ParserState.STRING:
                self.current_statement.append(c)
                if c == "'" and next_char == "'":
                    self.current_statement.append(next_char)
                    self.i += 1
                elif c == "'":
                    self.state = ParserState.NORMAL

            elif self.state == ParserState.COMMENT:
                self.current_statement.append(c)
                if c == "\n":
                    self.state = ParserState.NORMAL

            elif self.state == ParserState.MULTILINE_COMMENT:
                self.current_statement.append(c)
                if c == "*" and next_char == "/":
                    self.current_statement.append(next_char)
                    self.i += 1
                    self.state = ParserState.NORMAL

            self.i += 1

        # Handle the last statement
        yield from self._yield_if_complete()

    def _process_normal(self, most_recent_real_char: str) -> Iterator[str]:
        c = self.sql[self.i]

        is_control_keyword, keyword, keyword_len = self._look_ahead_for_keywords(
            keywords=CONTROL_FLOW_KEYWORDS
        )
        if is_control_keyword:
            # Yield current statement if any
            yield from self._yield_if_complete()
            # Yield keyword as its own statement
            yield keyword
            self.i += keyword_len
            self.does_select_mean_new_statement = True
            raise _AlreadyIncremented()

        (
            is_strict_new_statement_keyword,
            keyword,
            keyword_len,
        ) = self._look_ahead_for_keywords(keywords=STRICT_NEW_STATEMENT_KEYWORDS)
        if is_strict_new_statement_keyword:
            yield from self._yield_if_complete()
            self.current_statement.append(keyword)
            self.i += keyword_len
            self.does_select_mean_new_statement = True
            raise _AlreadyIncremented()

        (
            is_force_new_statement_keyword,
            keyword,
            keyword_len,
        ) = self._look_ahead_for_keywords(
            keywords=(
                NEW_STATEMENT_KEYWORDS
                + ([SELECT_KEYWORD] if self.does_select_mean_new_statement else [])
            ),
        )
        if (
            is_force_new_statement_keyword and most_recent_real_char != ")"
        ):  # usually we'd have a close paren that closes a CTE
            # Force termination of current statement
            yield from self._yield_if_complete()

            self.current_statement.append(keyword)
            self.i += keyword_len
            raise _AlreadyIncremented()

        elif c == ";":
            yield from self._yield_if_complete()
        else:
            self.current_statement.append(c)


def split_statements(sql: str) -> Iterator[str]:
    """
    Split T-SQL code into individual statements, handling various SQL constructs.
    """

    splitter = _StatementSplitter(sql)
    yield from splitter.process()
