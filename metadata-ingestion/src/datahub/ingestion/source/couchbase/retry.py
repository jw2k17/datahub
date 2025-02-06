import asyncio
import logging
import time
import traceback
from functools import wraps
from typing import Callable, Tuple, Type, Union

logger = logging.getLogger(__name__)


def retry_inline(func, *args, retry_count=5, factor=0.02, **kwargs):
    for retry_number in range(retry_count + 1):
        try:
            return func(*args, **kwargs)
        except Exception as err:
            if retry_number == retry_count:
                logger.debug(f"{func.__name__} retry limit exceeded: {err}")
                raise
            logger.debug(f"{func.__name__} will retry, number {retry_number + 1}")
            wait = factor
            wait *= 2 ** (retry_number + 1)
            time.sleep(wait)


def retry(
    retry_count: int = 5,
    factor: float = 0.02,
    allow_list: Union[Tuple[Type[Exception], ...], None] = None,
    always_raise_list: Union[Tuple[Type[Exception], ...], None] = None,
) -> Callable:
    def retry_handler(func):
        if not asyncio.iscoroutinefunction(func):

            @wraps(func)
            def f_wrapper(*args, **kwargs):
                for retry_number in range(retry_count + 1):
                    try:
                        return func(*args, **kwargs)
                    except Exception as err:
                        if always_raise_list and isinstance(err, always_raise_list):
                            raise

                        if allow_list and not isinstance(err, allow_list):
                            raise

                        if retry_number == retry_count:
                            logger.debug(f"{func.__name__} retry limit exceeded")
                            logger.debug(f"Error: {err}")
                            logger.debug(traceback.format_exc())
                            raise

                        logger.debug(
                            f"{func.__name__} will retry, number {retry_number + 1}"
                        )
                        wait = factor
                        wait *= 2 ** (retry_number + 1)
                        time.sleep(wait)

            return f_wrapper
        else:

            @wraps(func)
            async def f_wrapper(*args, **kwargs):
                for retry_number in range(retry_count + 1):
                    try:
                        return await func(*args, **kwargs)
                    except Exception as err:
                        if always_raise_list and isinstance(err, always_raise_list):
                            raise

                        if allow_list and not isinstance(err, allow_list):
                            raise

                        if retry_number == retry_count:
                            logger.debug(f"{func.__name__} retry limit exceeded")
                            logger.debug(f"Error: {err}")
                            logger.debug(traceback.format_exc())
                            raise

                        logger.debug(
                            f"{func.__name__} will retry, number {retry_number + 1}"
                        )
                        wait = factor
                        wait *= 2 ** (retry_number + 1)
                        time.sleep(wait)

            return f_wrapper

    return retry_handler
