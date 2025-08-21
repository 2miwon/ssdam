from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from tenacity import retry, stop_after_attempt, wait_fixed

from src.prompts.prompt_manager import PromptManager

import ast


# =============================================================================
# Prompt Template
# =============================================================================
# def create_prompt_template_for_main_question(
#     prompt_manager: PromptManager,
#     prompt_version: str,
# ) -> ChatPromptTemplate:
#
#     prompt_contents = prompt_manager.get_prompt_contents(
#         "chapter_recommendation",
#         "main_question",
#         prompt_version
#     )
#
#     prompt_template = ChatPromptTemplate.from_messages([
#         ("system", prompt_contents["system"]),
#         ("user", prompt_contents["user"]),  # topic
#     ])
#
#     return prompt_template


# def create_prompt_template_for_sub_question_legacy(
#     prompt_manager: PromptManager,
#     prompt_version: str,
# ) -> ChatPromptTemplate:
#
#     prompt_contents = prompt_manager.get_prompt_contents(
#         "chapter_recommendation",
#         "sub_question",
#         prompt_version
#     )
#
#     prompt_template = ChatPromptTemplate.from_messages([
#         ("system", prompt_contents["system"]),
#         ("user", prompt_contents["user_topic"]),  # topic
#         ("ai", prompt_contents["ai"]),  # question
#         ("user", prompt_contents["user"]),  # answer
#     ])
#
#     return prompt_template


def create_prompt_template_for_sub_question(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "chapter_recommendation",
        "sub_question",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


# def create_prompt_template_for_section_legacy(
#     prompt_manager: PromptManager,
#     prompt_version: str,
# ) -> ChatPromptTemplate:
#
#     prompt_contents = prompt_manager.get_prompt_contents(
#         "chapter_recommendation",
#         "section",
#         prompt_version
#     )
#
#     prompt_template = ChatPromptTemplate.from_messages([
#         ("system", prompt_contents["system"]),
#         ("user", prompt_contents["user_topic"]),  # topic
#         ("ai", prompt_contents["ai"]),  # question
#         ("user", prompt_contents["user"]),  # answer
#     ])
#
#     return prompt_template


def create_prompt_template_for_section(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "chapter_recommendation",
        "section",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


def create_prompt_template_for_section_clustering(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "chapter_recommendation",
        "section_clustering",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),  # section_list
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


# =============================================================================
# LLM Output Schema for parser
# =============================================================================
# class Questions(BaseModel):
#     questions: List[str] = Field(description="List of questions for the user")


# =============================================================================
# Chain & invoke
# =============================================================================
# @retry(stop=stop_after_attempt(2), wait=wait_fixed(2))
# async def generate_single_list_response(
#     prompt: ChatPromptTemplate,
#     model,
#     input_variable: dict,
#     key_name: str,
# ) -> dict:
#
#     parser = StrOutputParser()
#     chain = prompt | model | parser
#
#     llm_result = chain.invoke(input_variable)
#     result = ast.literal_eval(llm_result)
#     response = {key_name: result}
#
#     return response


# @retry(stop=stop_after_attempt(2), wait=wait_fixed(2))
# async def generate_chapter_response(
#     prompt: ChatPromptTemplate,
#     model,
#     input_variable: dict,
# ) -> dict:
#
#     parser = StrOutputParser()
#     chain = prompt | model | parser
#
#     llm_result = chain.invoke(input_variable)
#     response = ast.literal_eval(llm_result)
#
#     return response


@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_sub_question_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    topic = input_variable["topic"]
    main_question = input_variable["main_question"]
    main_answer = input_variable["main_answer"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "topic": topic,
        "main_question": main_question,
        "main_answer": main_answer
    })

    return response


@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_section_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    topic = input_variable["topic"]
    main_answer = input_variable["main_answer"]
    sub_question = input_variable["sub_question"]
    sub_answer = input_variable["sub_answer"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "topic": topic,
        "main_answer": main_answer,
        "sub_question": sub_question,
        "sub_answer": sub_answer
    })

    return response


@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_section_clustering_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    main_answer = input_variable["main_answer"]
    section_list = input_variable["section_list"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "main_answer": main_answer,
        "section_list": section_list
    })

    return response
