from datetime import datetime
from beanie import Document, Link
from pydantic import Field
from typing import Optional

from src.models import TimestampMixin
from src.accounts.models import User
from src.books.schemas import UpdateBookInput, CreateBookInput


class Book(Document, TimestampMixin):
    book_schema: object = Field(default_factory=dict)
    cover_image_url: str = Field(default='')
    user: Link[User] = Field(default_factory=User)
    is_finished: bool = Field(default=False)
    is_deleted: bool = Field(default=False)
    deleted_at: Optional[datetime] = Field(default=None)

    def update_by_request(self, update_book_input: UpdateBookInput) -> "Book":
        self.book_schema = update_book_input.book_schema
        self.cover_image_url = update_book_input.cover_image_url
        self.is_finished = update_book_input.is_finished
        self.is_deleted = update_book_input.is_deleted
        self.deleted_at = update_book_input.deleted_at if update_book_input.deleted_at is not None else None
        return self

    def create_structure(self, main_chapter: object) -> "Book":
        self.book_schema = {"main_chapter": main_chapter}
        return self

    @classmethod
    def of(cls, create_book_input: CreateBookInput, user: User) -> "Page":
        return cls(
            book_schema=create_book_input.book_schema,
            cover_image_url=create_book_input.cover_image_url,
            user=user
        )

