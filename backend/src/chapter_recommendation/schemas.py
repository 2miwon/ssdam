from typing import List
from pydantic import BaseModel


# Request DTO
class MainQuestionInput(BaseModel):
    topic: str


class SubQuestionInput(BaseModel):
    topic: str
    main_question: str
    main_answer: str


class SectionInput(BaseModel):
    topic: str
    main_answer: str
    sub_question: str
    sub_answer: str


class SectionClusteringInput(BaseModel):
    main_answer: str
    section_list: List[str]


# Response DTO
class MainQuestionOutput(BaseModel):
    main_question_list: List[str]


class SubQuestionOutput(BaseModel):
    sub_question_list: List[str]


class SectionOutput(BaseModel):
    section_list: List[str]


# Section Clustering Output
class SubChapter(BaseModel):
    title: str
    section_list: List[dict]


class MainChapter(BaseModel):
    title: str
    sub_chapter_list: List[SubChapter]


class SectionClusteringOutput(BaseModel):
    main_chapter: MainChapter
