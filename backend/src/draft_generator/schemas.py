from typing import List
from pydantic import BaseModel


class LightDraftInput(BaseModel):
    title: str


class LightDraftOutput(BaseModel):
    draft: List[str]


class DraftInput(BaseModel):
    title: str


class DraftOutput(BaseModel):
    draft: List[str]
