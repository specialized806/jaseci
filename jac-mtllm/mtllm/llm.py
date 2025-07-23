"""LLM abstraction module.

This module provides a LLM class that abstracts LiteLLM and offers
enhanced functionality and interface for language model operations.
"""

import inspect
from types import MethodType
from typing import Callable, Generator, get_type_hints

from .llm_connector import LLMConnector
from .types import (
    CompletionRequest,
    CompletionResult,
    Media,
    Message,
    MessageRole,
    MessageType,
    Text,
    Tool,
)

SYSTEM_PERSONA = """\
This is a task you must complete by returning only the output.
Do not include explanations, code, or extra text—only the result.
"""  # noqa E501

INSTRUCTION_TOOL = """
Use the tools provided to reach the goal. Call one tool at a time with \
proper args—no explanations, no narration. Think step by step, invoking tools \
as needed. When done, always call finish_tool(output) to return the final \
output. Only use tools.
"""  # noqa E501


class Model:
    """A wrapper class that abstracts LiteLLM functionality.

    This class provides a simplified and enhanced interface for interacting
    with various language models through LiteLLM.
    """

    def __init__(self, model_name: str, **kwargs: object) -> None:
        """Initialize the JacLLM instance.

        Args:
            model: The model name to use (e.g., "gpt-3.5-turbo", "claude-3-sonnet-20240229")
            api_key: API key for the model provider
            **kwargs: Additional configuration options
        """
        self.llm_connector = LLMConnector.for_model(model_name, **kwargs)

    def __call__(self, **kwargs: object) -> "Model":
        """Construct the call parameters and return self (factory pattern).

        Example:
            ```jaclang
            llm = JacLLM(model="gpt-3.5-turbo", api_key="your_api_key")

            # The bellow call will construct the parameter and return self.
            def answer_user_query(query: str) -> str by
                llm(
                    temperature=0.7,
                    max_tokens=100,
                );
            ```
        """
        self.llm_connector.call_params = kwargs
        return self

    def invoke(self, caller: Callable, args: dict[str | int, object]) -> object:
        """Invoke the LLM with the given caller and arguments."""
        # Prepare the tools for the LLM call.
        tools = [
            Tool(func) for func in self.llm_connector.call_params.get("tools", [])  # type: ignore
        ]

        # Construct the input information from the arguments.
        param_names = list(inspect.signature(caller).parameters.keys())
        inputs_detail: list[str] = []
        media_inputs: list[Media] = []

        for key, value in args.items():
            if isinstance(value, Media):
                media_inputs.append(value)
                continue

            if isinstance(key, str):
                inputs_detail.append(f"{key} = {value}")
            else:
                # TODO: Handle *args, **kwargs properly.
                if key < len(param_names):
                    inputs_detail.append(f"{param_names[key]} = {value}")
                else:
                    inputs_detail.append(f"arg = {value}")
        incl_info = self.llm_connector.call_params.get("incl_info")
        if incl_info and isinstance(incl_info, dict):
            for key, value in incl_info.items():
                if isinstance(value, Media):
                    media_inputs.append(value)
                else:
                    inputs_detail.append(f"{key} = {value}")

        if isinstance(caller, MethodType):
            inputs_detail.insert(0, f"self = {caller.__self__}")

        # Prepare the messages for the LLM call.
        messages: list[MessageType] = [
            Message(
                role=MessageRole.SYSTEM,
                content=SYSTEM_PERSONA + (INSTRUCTION_TOOL if tools else ""),
            ),
            Message(
                role=MessageRole.USER,
                content=[
                    Text(
                        Tool.get_func_description(caller)
                        + "\n\n"
                        + "\n".join(inputs_detail)
                    ),
                    *media_inputs,
                ],
            ),
        ]

        # Prepare return type.
        return_type = get_type_hints(caller).get("return")
        is_streaming = bool(self.llm_connector.call_params.pop("stream", False))

        if is_streaming:
            if return_type is not str:
                raise RuntimeError(
                    "Streaming responses are only supported for str return types."
                )
            if tools:
                raise RuntimeError(
                    "Streaming responses are not supported with tool calls yet."
                )

        # Prepare the llm call request.
        req = CompletionRequest(
            messages=messages,
            tools=tools,
            resp_type=return_type,
            stream=is_streaming,
            params={},
        )

        # TODO: Support mockllm for mocktesting.
        # Invoke streaming request, this will result in a generator that the caller
        # should either do .next() or .__iter__() by calling `for tok in resp: ...`
        if req.stream:
            if req.tools:
                raise RuntimeError(
                    "Streaming responses are not supported with tool calls yet."
                )
            return self._completion_streaming(req)

        # Invoke the LLM and handle tool calls.
        while True:
            resp = self._completion_no_streaming(req)
            if resp.tool_calls:
                for tool_call in resp.tool_calls:
                    if tool_call.is_finish_call():
                        return tool_call.get_output()
                    else:
                        req.add_message(tool_call())
            else:
                break

        return resp.output

    def _completion_no_streaming(self, req: CompletionRequest) -> CompletionResult:
        """Perform a completion request with the LLM."""
        return self.llm_connector.dispatch_no_streaming(req)

    def _completion_streaming(
        self, req: CompletionRequest
    ) -> Generator[str, None, None]:
        """Perform a streaming completion request with the LLM."""
        return self.llm_connector.dispatch_streaming(req)
