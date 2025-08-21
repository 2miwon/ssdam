from src.books.models import Book
from src.accounts.models import User

from beanie import PydanticObjectId
from beanie.odm.fields import DeleteRules
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClientSession


class BookRepository:
    def __init__(self):
        pass

    async def create_book(self, book: Book):
        return await book.insert()

    async def get_book_by_id(self, book_id: PydanticObjectId, session: Optional[AsyncIOMotorClientSession] = None) -> Optional[Book]:
        return await Book.get(book_id, session=session, fetch_links=True)

    async def get_book_list_by_user(self, user: User) -> List[Book]:
        return await Book.find(Book.user.id == user.id).to_list()

    async def update_book(self, book: Book, session: Optional[AsyncIOMotorClientSession] = None) -> Book:
        return await book.save(session=session)

    async def delete_book(self, book: Book):
        return await book.delete(link_rule=DeleteRules.DO_NOTHING)
