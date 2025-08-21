from tenacity import retry, stop_after_attempt, wait_fixed
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager
from src.config import settings

import os
import json
import requests


# =============================================================================
# Prompt Template
# =============================================================================
def create_prompt_template_for_illustration_prompt(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "illustration_generator",
        "illustration",
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
async def generate_prompt_for_illustration_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    json_format = input_variable["json_format"]
    desired_image = input_variable["desired_image"]
    relevant_excerpt = input_variable["relevant_excerpt"]
    section_title = input_variable["section_title"]
    book_genre = input_variable["book_genre"]

    response = await chain.ainvoke({
        "json_format": json_format,
        "desired_image": desired_image,
        "relevant_excerpt": relevant_excerpt,
        "section_title": section_title,
        "book_genre": book_genre
    })

    return response


# =============================================================================
# Text to Image
# =============================================================================
# @retry(stop=stop_after_attempt(2), wait=wait_fixed(2), reraise=True)
async def generate_illustration_response(
    image_prompt: str
) -> bytes:
    url = "https://api.getimg.ai/v1/stable-diffusion-xl/text-to-image"

    payload = {
        "model": "stable-diffusion-xl-v1-0",
        "prompt": f"{image_prompt}",
        "output_format": "png",
        "response_format": "url"
    }

    headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer key-{settings.GETIMG_API_KEY}"
    }

    response = requests.post(url, json=payload, headers=headers)
    response_data = json.loads(response.text)
    image_url = response_data["url"]

    image_data = requests.get(image_url, timeout=10)
    image_data.raise_for_status()

    return image_data.content
