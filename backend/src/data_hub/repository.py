from beanie import PydanticObjectId
from typing import List

from src.data_hub.models import ChapterData, RevisionData, DraftData, SentenceData


class ChapterDataRepository:
    def __init__(self):
        pass

    async def create(self, chapter_data: ChapterData) -> ChapterData:
        return await chapter_data.insert()

    async def get_by_book_id(self, book_id: PydanticObjectId) -> List[ChapterData]:
        return await ChapterData.find(ChapterData.book_id == str(book_id)).to_list()


class RevisionDataRepository:
    def __init__(self):
        pass

    async def create(self, revision_data: RevisionData) -> RevisionData:
        return await revision_data.insert()


class DraftDataRepository:
    def __init__(self):
        pass

    async def create(self, draft_data: DraftData) -> DraftData:
        return await draft_data.insert()


class SentenceDataRepository:
    def __init__(self):
        pass

    async def create(self, sentence_data: SentenceData) -> SentenceData:
        return await sentence_data.insert()
