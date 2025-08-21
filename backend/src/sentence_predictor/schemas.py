from pydantic import BaseModel


class SentenceInput(BaseModel):
    prev_sentence: str
    title: str


class SentenceOutput(BaseModel):
    next_sentence: str
