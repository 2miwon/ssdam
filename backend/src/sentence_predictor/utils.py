from typing import List
from tenacity import retry, stop_after_attempt, wait_fixed

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager

import ast


# =============================================================================
# Prompt Template
# =============================================================================
def create_prompt_template_for_sentence_predictor(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "sentence_predictor",
        "predictor",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),  # text
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


# =============================================================================
# Chain & invoke
# =============================================================================
@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_sentence_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    prev_sentence = input_variable["prev_sentence"]
    book_info = input_variable["book_info"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "prev_sentence": prev_sentence,
        "book_info": book_info,
    })

    return response
