from typing import List, Optional
from beanie import PydanticObjectId
from pydantic import BaseModel
from datetime import datetime


# Request DTO
class CreateBookInput(BaseModel):
    book_schema: object
    cover_image_url: str


class CreateBookStructureInput(BaseModel):
    main_chapter: object


class CreateBookStructureOutput(BaseModel):
    main_chapter: object

    @classmethod
    def of(cls, main_chapter: object) -> 'CreateBookStructureOutput':
        return cls(
            main_chapter=main_chapter
        )


class CreateBookOutput(BaseModel):
    book_id: PydanticObjectId
    book_schema: object
    cover_image_url: str
    created_at: datetime

    @classmethod
    def of(cls, book: "Book") -> "CreateBookOutput":
        return cls(
            book_id=book.id,
            book_schema=book.book_schema,
            cover_image_url=book.cover_image_url,
            created_at=book.created_at,
            is_finished=book.is_finished,
            is_deleted=book.is_deleted,
        )


class BookDTO(BaseModel):
    book_id: PydanticObjectId
    book_schema: object
    cover_image_url: str
    created_at: datetime
    is_finished: bool
    is_deleted: bool
    deleted_at: Optional[datetime]

    @classmethod
    def convert_book_to_dto(cls, book: "Book") -> "BookDTO":
        return cls(
            book_id=book.id,
            book_schema=book.book_schema,
            cover_image_url=book.cover_image_url,
            created_at=book.created_at,
            is_finished=book.is_finished,
            is_deleted=book.is_deleted,
            deleted_at=book.deleted_at,
        )


class GetBookListOutput(BaseModel):
    book_list: List[BookDTO]


class UpdateBookInput(BaseModel):
    book_schema: object
    cover_image_url: str
    is_finished: bool
    is_deleted: bool
    deleted_at: Optional[datetime]


class UpdateBookOutput(BaseModel):
    book_id: PydanticObjectId
    book_schema: object
    cover_image_url: str
    created_at: datetime
    is_finished: bool
    is_deleted: bool
    deleted_at: Optional[datetime]

    @classmethod
    def of(cls, book: "Book") -> "UpdateBookOutput":
        return cls(
            book_id=book.id,
            book_schema=book.book_schema,
            cover_image_url=book.cover_image_url,
            created_at=book.created_at,
            is_finished=book.is_finished,
            is_deleted=book.is_deleted,
            deleted_at=book.deleted_at,
        )


class GetBookOutput(BaseModel):
    book_id: PydanticObjectId
    book_title: str
    book_schema: object
    cover_image_url: str
    created_at: datetime
    is_finished: bool
    is_deleted: bool

    @classmethod
    def of(cls, book: "Book") -> "GetBookOutput":
        return cls(
            book_id=book.id,
            book_title=book.title,
            book_schema=book.book_schema,
            cover_image_url=book.cover_image_url,
            created_at=book.created_at,
            is_finished=book.is_finished,
            is_deleted=book.is_deleted,
        )