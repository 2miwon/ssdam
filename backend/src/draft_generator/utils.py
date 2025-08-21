from tenacity import retry, stop_after_attempt, wait_fixed
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager

import ast


# =============================================================================
# Prompt Template
# =============================================================================
def create_prompt_template_for_light_draft_generator(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "draft_generator",
        "light_draft",
        prompt_version
    )

    prompt_template = ChatPromptTemplate.from_messages([
        ("system", prompt_contents["system"]),
        ("user", prompt_contents["user"]),  # title
    ])

    input_variable["json_format"] = prompt_contents["json_format"]

    return prompt_template, input_variable


def create_prompt_template_for_draft_generator(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "draft_generator",
        "draft",
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
# @retry(stop=stop_after_attempt(2), wait=wait_fixed(2))
async def generate_light_draft_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    title = input_variable["title"]
    json_format = input_variable["json_format"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "title": title,
    })

    # response = ast.literal_eval(llm_result)

    return response


@retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_draft_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    genre_prompt = input_variable["genre_prompt"]
    book_info = input_variable["book_info"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "genre_prompt": genre_prompt,
        "book_info": book_info,
    })

    return response


# =============================================================================
# ETC
# =============================================================================
# 추후 리팩토링
async def select_genre_prompt(genre: str) -> str:
    genre_dict = {
        "에세이":
            """
            Essay (에세이):
            - Writing Style:
                * Personal and introspective tone
                * Balanced mix of storytelling and reflection
                * Engaging narrative flow
            - Content Structure:
                * Open with relatable experience
                * Develop through personal insights
                * Connect to universal themes
                * Include emotional resonance
            """,
        "자기계발":
            """
            Self-Help (자기계발):
            - Writing Style:
                * Encouraging and actionable tone
                * Clear and direct instructions
                * Empowering language
            - Content Structure:
                * Problem identification
                * Solution framework
                * Practical steps
                * Implementation strategies
                * Success metrics
            """,
        "소설":
            """
            Fiction (소설):
            - Writing Style:
                * Immersive narrative voice
                * Character-driven development
                * Emotional engagement
           - Content Structure:
                * Scene setting
                * Character introduction
                * Conflict development
                * Plot progression
                * Resolution elements

            """,
        "인문":
            """
            Humanities (인문):
            - Writing Style:
                * Scholarly yet accessible
                * Thought-provoking
                * Balanced perspective
            - Content Structure:
                * Historical context
                * Theoretical framework
                * Analysis and interpretation
                * Modern implications
                * Cultural significance
            """,
        "여행":
            """
            Travel (여행):
            - Writing Style:
                * Descriptive and engaging
                * Practical information blend
                * Cultural sensitivity
            - Content Structure:
                * Location overview
                * Cultural insights
                * Practical tips
                * Personal experiences
                * Local perspectives
            """,
        "시":
            """
            Poetry (시):
            - Writing Style:
                * Lyrical and metaphorical
                * Emotional depth
                * Rhythmic consideration
            - Content Structure:
                * Thematic development
                * Imagery building
                * Emotional progression
                * Symbolic layers
                * Resolution or reflection
            """
    }

    genre_prompt = ""

    try:
        genre_prompt = genre_dict[genre]
    except KeyError:
        genre_prompt = "No information provided"

    return genre_prompt


async def compose_book_info(
    title: str,
    genre: str = "No information provided",
    subject: str = "No information provided",
    purpose: str = "No information provided",
    target_readers: str = "No information provided",
    target_readers_description: str = "No information provided",
    writing_style: str = "No information provided"
) -> str:

    book_info = f"""
    section_title: {title}
    book_genre: {genre}
    book_subject: {subject}
    book_purpose: {purpose}
    writing_style: {writing_style}
    target_readers: {target_readers}
    target_readers_description: {target_readers_description}
    """

    return book_info
