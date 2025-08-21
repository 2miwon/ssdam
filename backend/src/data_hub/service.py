from src.data_hub.repository import ChapterDataRepository, RevisionDataRepository, DraftDataRepository, SentenceDataRepository
from src.data_hub.schemas import ChapterDataInput, RevisionDataInput, DraftDataInput, SentenceDataInput
from src.data_hub.models import ChapterData, RevisionData, DraftData, SentenceData
from src.accounts.models import User

from fastapi import Depends
from beanie import PydanticObjectId


class ChapterDataService:
    def __init__(
        self,
        chapter_data_repository: ChapterDataRepository = Depends(ChapterDataRepository),
    ):
        self.chapter_data_repository = chapter_data_repository

    async def create(
        self,
        chapter_data_input: ChapterDataInput,
        book_id: PydanticObjectId,
        user: User
    ):
        await self.chapter_data_repository.create(
            ChapterData.of(
                chapter_data_input,
                str(book_id),
                user
            )
        )


class RevisionDataService:
    def __init__(
        self,
        revision_data_repository: RevisionDataRepository = Depends(RevisionDataRepository),
    ):
        self.revision_data_repository = revision_data_repository

    async def create(
        self,
        revision_data_input: RevisionDataInput,
        page_id: PydanticObjectId,
        user: User
    ):
        await self.revision_data_repository.create(
            RevisionData.of(
                revision_data_input,
                str(page_id),
                user
            )
        )


class DraftDataService:
    def __init__(
        self,
        draft_data_repository: DraftDataRepository = Depends(DraftDataRepository),
    ):
        self.draft_data_repository = draft_data_repository

    async def create(
        self,
        title: str,
        draft: str,
        page_id: PydanticObjectId,
        user: User
    ):
        await self.draft_data_repository.create(
            DraftData.of(
                title,
                draft,
                str(page_id),
                user
            )
        )


class SentenceDataService:
    def __init__(
        self,
        sentence_data_repository: SentenceDataRepository = Depends(SentenceDataRepository),
    ):
        self.sentence_data_repository = sentence_data_repository

    async def create(
        self,
        sentence_data_input: SentenceDataInput,
        page_id: PydanticObjectId,
        user: User
    ):
        await self.sentence_data_repository.create(
            SentenceData.of(
                sentence_data_input,
                str(page_id),
                user
            )
        )
