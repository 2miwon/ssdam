from typing import List
from pydantic import BaseModel


class SynonymInput(BaseModel):
    context_text: str
    target_text: str


class SynonymOutput(BaseModel):
    synonyms: List[str]
