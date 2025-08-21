from src.book_setting.models import BookSetting
from beanie import PydanticObjectId


class BookSettingRepository:
    def __init__(self):
        pass

    async def create(self, book_setting: BookSetting) -> BookSetting:
        return await book_setting.insert()

    async def get_by_book_id(self, book_id: PydanticObjectId) -> BookSetting:
        return await BookSetting.find_one(BookSetting.book_id == str(book_id))

    async def update(self, book_setting: BookSetting) -> BookSetting:
        return await book_setting.save()

    async def delete(self, book_setting: BookSetting) -> None:
        return await book_setting.delete()
