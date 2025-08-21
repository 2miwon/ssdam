from tenacity import retry, stop_after_attempt, wait_fixed

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager

import ast


# =============================================================================
# Prompt Template
# =============================================================================
def create_prompt_template_for_book_setting_subject_and_purpose(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "book_setting",
        "book_setting",
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
async def generate_subject_and_purpose_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    qa_data = input_variable["qa_data"]
    json_format = input_variable["json_format"]

    response = await chain.ainvoke({
        "qa_data": qa_data,
        "json_format": json_format
    })

    return response
