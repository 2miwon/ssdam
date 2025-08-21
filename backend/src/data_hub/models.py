from src.models import TimestampMixin
from src.accounts.models import User
from src.data_hub.schemas import ChapterDataInput, RevisionDataInput, DraftDataInput, SentenceDataInput

from pydantic import Field
from beanie import Document


class ChapterData(Document, TimestampMixin):
    user_id: str = Field(default='')
    book_id: str = Field(default='')
    question: str = Field(default='')
    answer: str = Field(default='')

    @classmethod
    def of(
        cls,
        create_chapter_data_input: ChapterDataInput,
        book_id: str,
        user: User
    ) -> "ChapterData":
        return cls(
            user_id=str(user.id),
            book_id=book_id,
            question=create_chapter_data_input.question,
            answer=create_chapter_data_input.answer
        )


class RevisionData(Document, TimestampMixin):
    user_id: str = Field(default='')
    page_id: str = Field(default='')
    original: str = Field(default='')
    suggested: str = Field(default='')
    accepted: bool = Field(default=False)

    @classmethod
    def of(
        cls,
        create_revision_data_input: RevisionDataInput,
        page_id: str,
        user: User
    ) -> "RevisionData":
        return cls(
            user_id=str(user.id),
            page_id=page_id,
            original=create_revision_data_input.original,
            suggested=create_revision_data_input.suggested,
            accepted=create_revision_data_input.accepted
        )


class DraftData(Document, TimestampMixin):
    user_id: str = Field(default='')
    page_id: str = Field(default='')
    title: str = Field(default='')
    draft: str = Field(default='')

    @classmethod
    def of(
        cls,
        title: str,
        draft: str,
        page_id: str,
        user: User,
    ) -> "DraftData":
        return cls(
            title=title,
            draft=draft,
            page_id=page_id,
            user_id=str(user.id)
        )


class SentenceData(Document, TimestampMixin):
    user_id: str = Field(default='')
    page_id: str = Field(default='')
    prev_sentence: str = Field(default='')
    next_sentence: str = Field(default='')

    @classmethod
    def of(
        cls,
        create_sentence_data_input: SentenceDataInput,
        page_id: str,
        user: User
    ) -> "SentenceData":
        return cls(
            user_id=str(user.id),
            page_id=page_id,
            prev_sentence=create_sentence_data_input.prev_sentence,
            next_sentence=create_sentence_data_input.next_sentence
        )
