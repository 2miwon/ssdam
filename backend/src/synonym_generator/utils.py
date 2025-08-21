from typing import List
from tenacity import retry, stop_after_attempt, wait_fixed

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager

import ast


# =============================================================================
# Prompt Template
# =============================================================================
def create_prompt_template_for_synonym_generator(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "synonym_generator",
        "synonym",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


# =============================================================================
# Chain & invoke
# =============================================================================
@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_synonym_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    context_text = input_variable["context_text"]
    target_text = input_variable["target_text"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "context_text": context_text,
        "target_text": target_text,
    })

    return response
