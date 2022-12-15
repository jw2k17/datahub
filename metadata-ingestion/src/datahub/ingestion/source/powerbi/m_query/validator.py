import logging

from datahub.ingestion.source.powerbi.m_query import tree_function

from typing import List, Tuple, Optional
from lark import Tree

LOGGER = logging.getLogger(__name__)


def any_one_should_present(supported_funcs: List[str], functions: List[str]) -> Tuple[bool, Optional[str]]:
    """
    Anyone functions from supported_funcs should present in functions list
    :param supported_funcs: List of function m_query module supports
    :param functions: List of functions retrieved from expression
    :return: True or False
    """
    for f in supported_funcs:
        if f in functions:
            return True, None

    return False, f"Function from supported function list {supported_funcs} not found"


def all_function_should_be_known(supported_funcs: List[str], functions: List[str]) -> Tuple[bool, Optional[str]]:
    for f in functions:
        if f not in supported_funcs:
            return False, f"Function {f} is unknown"

    return True, None


def validate_parse_tree(supported_funcs: List[str], tree: Tree) -> Tuple[bool, str]:
    """
    :param supported_funcs: List of supported functions
    :param tree: tree to validate as per functions supported by m_parser module
    :return: first argument is False if validation is failed and second argument would contain the error message.
             in-case of valid tree the first argument is True and second argument would be None.
    """
    functions: List[str] = tree_function.get_all_function_name(tree)
    if len(functions) == 0:
        return False, "Function call not found"

