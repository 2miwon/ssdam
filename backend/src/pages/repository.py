from src.pages.models import Page
from src.config import settings
from beanie import PydanticObjectId

import boto3
from motor.motor_asyncio import AsyncIOMotorClientSession
from typing import Optional


class PageRepository:
    def __init__(self):
        pass

    async def create_page(self, page: Page, session: Optional[AsyncIOMotorClientSession] = None) -> Page:
        return await page.insert(session=session)

    async def get_page_by_id(self, page_id: PydanticObjectId) -> Page:
        return await Page.get(page_id, fetch_links=True)

    async def update_page(self, page: Page) -> Page:
        return await page.save()

    async def delete_page(self, page: Page) -> None:
        if hasattr(page, 'image_keys') and page.image_keys:
            for image_key in page.image_keys:
                await self.delete_s3_image(image_key)
        return await page.delete()

    async def delete_pages_by_book_id(self, book_id: str) -> None:
        # return await Page.find({"book_id": book_id}).delete()
        pages = await Page.find({"book_id": book_id}).to_list()
        for page in pages:
            if hasattr(page, 'image_keys') and page.image_keys:
                for image_key in page.image_keys:
                    await self.delete_s3_image(image_key)
            await page.delete()

    # 추후 분리..
    async def delete_s3_image(self, image_key: str) -> None:
        s3 = boto3.client('s3')

        try:
            s3.delete_object(
                Bucket=settings.AWS_PAGE_IMAGE_BUCKET_NAME,
                Key=image_key
            )
        except Exception as e:
            print(f"Error deleting object {image_key} from page bucket: {str(e)}")