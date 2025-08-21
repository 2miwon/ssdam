from pydantic import BaseModel


class ChapterDataInput(BaseModel):
    question: str
    answer: str


class RevisionDataInput(BaseModel):
    original: str
    suggested: str
    accepted: bool


class DraftDataInput(BaseModel):
    title: str
    draft: str


class SentenceDataInput(BaseModel):
    prev_sentence: str
    next_sentence: str
