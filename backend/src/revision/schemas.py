from typing import List

from pydantic import BaseModel


# Request DTO
class BlocksInput(BaseModel):
    blocks: List[dict]


# Response DTO
class BlockResult(BaseModel):
    tagged_text: str
    revision_list: List[dict]


class BlocksOutput(BaseModel):
    blocks_result: List[BlockResult]
