from src.models import TimestampMixin
from pydantic import Field
from typing import List
from beanie import Document
from src.pages.schemas import CreatePageInput, UpdatePageInput


class Page(Document, TimestampMixin):
    title: str = Field(default='')
    content: str = Field(default='')
    book_id: str = Field(default='')
    image_keys: List[str] = Field(default_factory=list)

    @classmethod
    def of(cls, create_page_input: CreatePageInput, book_id: str) -> "Page":
        return cls(
            title=create_page_input.title,
            book_id=book_id,
            content='',
            image_keys=[]
        )

    def update_by_request(self, update_page_input: UpdatePageInput) -> "Page":
        self.title = update_page_input.title
        self.content = update_page_input.content
        return self

    def update_image_keys_by_request(
        self,
        image_key: str
    ):
        # 기존 page schema에 image keys가 없는 경우 처리
        if not hasattr(self, 'image_keys'):
            self.image_keys = []

        self.image_keys.append(image_key)
        return self
