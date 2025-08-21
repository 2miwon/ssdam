from typing import List

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser

from src.prompts.prompt_manager import PromptManager

import ast
import re


# =============================================================================
# Prompt Template
# =============================================================================
# def create_prompt_template_for_revision(
#     prompt_manager: PromptManager,
#     prompt_version: str,
#     input_variable: dict,
# ) -> (ChatPromptTemplate, dict):
#     # legacy
#
#     prompt_contents = prompt_manager.get_prompt_contents(
#         "revision",
#         "revision",
#         prompt_version
#     )
#
#     prompt_template = ChatPromptTemplate.from_messages([
#         ("system", prompt_contents["system"]),
#         ("user", prompt_contents["user"]),  # text
#     ])
#
#     input_variable["json_format"] = prompt_contents["json_format"]
#
#     return prompt_template, input_variable


def create_prompt_template_for_revision(
    prompt_manager: PromptManager,
    prompt_version: str,
    input_variable: dict,
) -> (ChatPromptTemplate, dict):

    prompt_contents = prompt_manager.get_prompt_contents(
        "revision",
        "revision",
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
async def generate_revision_response(
    prompt: ChatPromptTemplate,
    model,
    input_variable: dict,
) -> dict[str, List[dict]]:

    parser = JsonOutputParser()
    chain = prompt | model | parser

    blocks = input_variable["blocks"]
    json_format = input_variable["json_format"]

    blocks_result = []
    target_block_indices = []  # 비어 있는 블록 제외

    for idx in range(len(blocks)):
        # 미리 데이터 형식 생성
        blocks_result.append({
            "tagged_text": "",
            "revision_list": []
        })

        # 공백 혹은 개행 문자만 존재하는 경우 체크
        if check_only_whitespace_or_newline(blocks[idx]["text"]):
            blocks_result[-1]["tagged_text"] = blocks[idx]["text"]
            continue

        # 빈 블록이 아닐 경우 인덱스 저장
        if blocks[idx]["text"]:
            target_block_indices.append(idx)

    # 각 블록 배치 처리 (빈 블록 제외)
    llm_results = await chain.abatch([
        {
            "json_format": json_format,
            "user_text": blocks[idx]["text"],
        } for idx in target_block_indices if idx < len(blocks)
    ])

    # LLM Output 파싱
    for idx in range(len(llm_results)):
        parsed_result = llm_results[idx]

        tagged_text, revision_list = compare_original_and_revised_text(
            parsed_result["tagged_original_text"],
            parsed_result["revision_list"]
        )

        tagged_text = tag_to_fix_tag(tagged_text)

        # tag 개수와 revision 결과 개수 매칭 되는지 확인
        if not check_revision_tag_match(tagged_text, len(revision_list)):
            continue

        # 기존 빈 데이터를 LLM 결과로 변경 (빈 블록 or Tag 오류 제외)
        blocks_result[target_block_indices[idx]]["tagged_text"] = tagged_text
        blocks_result[target_block_indices[idx]]["revision_list"] = revision_list

    response = {
        "blocks_result": blocks_result
    }

    return response


# =============================================================================
# ETC (+exception check)
# =============================================================================
def text_length_in_blocks(
    blocks
) -> int:
    count = 0
    for block in blocks:
        if block["text"]:
            count += len(block["text"])

    return count


def check_revision_tag_match(
    tagged_text: str,
    revision_count: int
) -> bool:

    tag_count = len(re.findall(r'<fix>(.*?)</fix>', tagged_text))

    if tag_count == revision_count:
        return True

    return False


def compare_original_and_revised_text(
    tagged_text: str,
    revision_list: list
) -> (str, list):

    to_remove = []

    # tag 안의 원본 텍스트와 수정된 텍스트가 같은 경우 tag 제거
    for idx, revision in enumerate(revision_list):
        pattern = f'<{re.escape(revision["revised_text"])}>'
        if re.search(pattern, tagged_text):
            to_remove.append(idx)
            tagged_text = re.sub(pattern, revision["revised_text"], tagged_text)

    # 퇴고 리스트에서도 제거
    for idx in reversed(to_remove):
        del revision_list[idx]

    return tagged_text, revision_list


def check_only_whitespace_or_newline(
    text: str
) -> bool:
    return bool(re.match(r'^[\n\r]*$', text))


def tag_to_fix_tag(
    text: str
) -> str:
    return re.sub(r"<(.*?)>", r"<fix>\1</fix>", text)
