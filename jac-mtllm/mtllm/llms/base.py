"""Base Large Language Model (LLM) class."""

import logging
import re
from typing import Any, Mapping, Optional

from loguru import logger

from mtllm.types import InputInformation, ReActOutput


httpx_logger = logging.getLogger("httpx")
httpx_logger.setLevel(logging.WARNING)

SYSTEM_PROMPT = """
[System Prompt]
This is an operation you must perform and return the output values. Neither, the methodology, extra sentences nor the code are not needed.
Input/Type formatting: Explanation of the Input (variable_name) (type) = value
"""  # noqa E501

PROMPT_TEMPLATE = """
[Information]
{information}

[Context]
{context}

[Inputs Information]
{inputs_information}

[Output Information]
{output_information}

[Type Explanations]
{type_explanations}

[Action]
{action}
"""  # noqa E501

NORMAL_SUFFIX = """Generate and return the output result(s) only, adhering to the provided Type in the following format

[Output] <result>
"""  # noqa E501

REASON_SUFFIX = """
Reason and return the output result(s) only, adhering to the provided Type in the following format

[Reasoning] <Reason>
[Output] <Result>
"""

CHAIN_OF_THOUGHT_SUFFIX = """
Generate and return the output result(s) only, adhering to the provided Type in the following format. Perform the operation in a chain of thoughts.(Think Step by Step)

[Chain of Thoughts] <Chain of Thoughts>
[Output] <Result>
"""  # noqa E501

REACT_SUFFIX = """
You are given with a list of tools you can use to do different things. To achieve the given [Action], incrementally think and provide tool_usage necessary to achieve what is thought.
Provide your answer adhering in the following format. tool_usage is a function call with the necessary arguments. Only provide one [THOUGHT] and [TOOL USAGE] at a time.

[Thought] <Thought>
[Tool Usage] <tool_usage>
"""  # noqa E501

MTLLM_OUTPUT_EXTRACT_PROMPT = """
[Output]
{model_output}

[Previous Result You Provided]
{previous_output}

[Desired Output Type]
{output_info}

[Type Explanations]
{output_type_info}

Above output is not in the desired Output Format/Type. Please provide the output in the desired type. Do not repeat the previously provided output.
Important: Do not provide the code or the methodology. Only provide the output in the desired format.
"""  # noqa E501

OUTPUT_CHECK_PROMPT = """
[Output]
{model_output}

[Desired Output Type]
{output_type}

[Type Explanations]
{output_type_info}

Check if the output is exactly in the desired Output Type. Important: Just say 'Yes' or 'No'.
"""  # noqa E501

OUTPUT_FIX_PROMPT = """
[Previous Output]
{model_output}

[Desired Output Type]
{output_type}

[Type Explanations]
{output_type_info}

[Error]
{error}

Above output is not in the desired Output Format/Type. Please provide the output in the desired type. Do not repeat the previously provided output.
Important: Do not provide the code or the methodology. Only provide the output in the desired format.
"""  # noqa E501

REACT_OUTPUT_FIX_PROMPT = """
[Previous Output]
{model_output}

[Error]
{error}

[Tool Explanations]
{tool_explanations}

[Type Explanations]
{type_explanations}

Above output is not in the desired Output Format/Type. Please provide the output in the desired type. Do not repeat the previously provided output.
Provide the output in the below format. Where tool_usage is a function call with the necessary arguments. Only provide one [THOUGHT] and [TOOL USAGE] at a time.

[Thought] <Thought>
[Tool Usage] <tool_usage>
"""  # noqa E501


class BaseLLM:
    """Base Large Language Model (LLM) class."""

    MTLLM_SYSTEM_PROMPT: str = SYSTEM_PROMPT
    MTLLM_PROMPT: str = PROMPT_TEMPLATE
    MTLLM_METHOD_PROMPTS: dict[str, str] = {
        "Normal": NORMAL_SUFFIX,
        "Reason": REASON_SUFFIX,
        "Chain-of-Thoughts": CHAIN_OF_THOUGHT_SUFFIX,
        "ReAct": REACT_SUFFIX,
    }
    OUTPUT_EXTRACT_PROMPT: str = MTLLM_OUTPUT_EXTRACT_PROMPT
    OUTPUT_CHECK_PROMPT: str = OUTPUT_CHECK_PROMPT
    OUTPUT_FIX_PROMPT: str = OUTPUT_FIX_PROMPT
    REACT_OUTPUT_FIX_PROMPT: str = REACT_OUTPUT_FIX_PROMPT

    def __init__(self, verbose: bool = False) -> None:
        """Initialize the Large Language Model (LLM) client."""
        self.verbose = verbose

    def __infer__(self, meaning_in: str | list[dict], **kwargs: dict) -> str:
        """Infer a response from the input meaning."""
        raise NotImplementedError

    def __call__(
        self,
        input_text: str | list[dict],
        media: list[Optional[InputInformation]],
        **kwargs: dict,
    ) -> str:
        """Infer a response from the input text."""
        if self.verbose:
            logger.info(f"Meaning In\n{input_text}")
        return self.__infer__(input_text, **kwargs)

    def resolve_output(
        self,
        meaning_out: str,
        _eval_output: bool,  # FIXME: This will be removed after structured output.
        _globals: dict,
        _locals: Mapping,
    ) -> Any:  # noqa: ANN401
        """Resolve the output string to return the reasoning and output."""
        if output_match := re.search(r"\[Output\](.*)", meaning_out, re.DOTALL):
            output = output_match.group(1).strip()
            if _eval_output:
                return eval(output, _globals, _locals)
            return output
        raise ValueError("Failed to parse LLM output.")

    def resolve_react_output(
        self,
        meaning_out: str,
        _globals: dict,
        _locals: Mapping,
    ) -> ReActOutput:
        """Resolve the output string to return the reasoning and output."""
        if output_match := re.search(
            r"\[Thought\](.*)\[Tool Usage\](.*)", meaning_out, re.DOTALL
        ):
            thought = output_match.group(1).strip()
            tool_usage = output_match.group(2).strip()
            try:
                output = eval(tool_usage, _globals, _locals)
            except Exception as err:
                output = str(err)
            return ReActOutput(thought=thought, action=tool_usage, observation=output)
        raise ValueError("Failed to parse ReAct LLM output.")
