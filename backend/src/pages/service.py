from src.pages.models import Page
from src.pages.repository import PageRepository
from src.pages.schemas import CreatePageInput, CreatePageOutput, GetPageOutput, UpdatePageInput, UpdatePageOutput
from src.config import settings
from src.pages.utils import hash_user_id, validate_image

from fastapi import Depends, HTTPException, File, UploadFile
from fastapi.responses import StreamingResponse
from botocore.exceptions import NoCredentialsError
from beanie import PydanticObjectId
from io import BytesIO

import os
import uuid
import boto3
import mimetypes


class PageService:
    def __init__(self, page_repository: PageRepository = Depends(PageRepository)):
        self.page_repository = page_repository

    async def create_page(self, create_page_input: CreatePageInput, book_id: PydanticObjectId) -> CreatePageOutput:
        page = await self.page_repository.create_page(Page.of(create_page_input, str(book_id)))
        return CreatePageOutput(page_id=page.id)

    async def get_page_by_id(self, page_id: PydanticObjectId) -> GetPageOutput:
        page = await self.page_repository.get_page_by_id(page_id)
        if page is None:
            raise HTTPException(status_code=404, detail="Page id에 해당하는 페이지가 없음")
        return GetPageOutput.of(page)

    async def update_page(self, page_id: PydanticObjectId, update_page_input: UpdatePageInput) -> CreatePageOutput:
        page = await self.page_repository.get_page_by_id(page_id)
        if page is None:
            raise HTTPException(status_code=404, detail="Page id에 해당하는 페이지가 없음")
        page.update_by_request(update_page_input)
        updated_page = await self.page_repository.update_page(page)
        return UpdatePageOutput(page_id=updated_page.id)

    async def delete_page(self, page_id: PydanticObjectId) -> None:
        page = await self.page_repository.get_page_by_id(page_id)
        if page is None:
            raise HTTPException(status_code=404, detail="Page id에 해당하는 페이지가 없음")
        await self.page_repository.delete_page(page)


# =============================================================================
# 페이지 내 s3 이미지 관련 Service
# =============================================================================
class PageImageService:
    def __init__(
        self,
        page_repository: PageRepository = Depends(PageRepository)
    ):
        self.page_repository = page_repository
        self.aws_page_image_bucket_name = settings.AWS_PAGE_IMAGE_BUCKET_NAME
        self.aws_region = "ap-northeast-2"

        # Lambda에서 이미 IAM을 통해 자격 증명을 하기 때문에 SECRET KEY 입력 시 인증 중복 오류 발생
        self.s3 = boto3.client('s3')

        self.MAX_FILE_SIZE = 10 * 1024 * 1024
        self.ALLOWED_IMAGE_TYPES = {"jpeg", "png", "jpg"}

    async def upload_image_file(
        self,
        user_id: str,
        book_id: PydanticObjectId,
        page_id: PydanticObjectId,
        img_file: UploadFile = File(...),
    ):
        try:
            if not await validate_image(
                img_file,
                max_file_size=self.MAX_FILE_SIZE,
                allowed_image_types=self.ALLOWED_IMAGE_TYPES
            ):
                raise HTTPException(status_code=400, detail="Not a valid image")

            _, extension = os.path.splitext(img_file.filename)

            hashed_user_id = hash_user_id(user_id)
            uuid_val = str(uuid.uuid4())
            s3_image_key = f"{hashed_user_id}/{book_id}/{page_id}/{uuid_val}{extension}"

            file_content = await img_file.read()
            file_object = BytesIO(file_content)

            self.s3.upload_fileobj(
                Fileobj=file_object,
                Bucket=self.aws_page_image_bucket_name,
                Key=s3_image_key,
            )

            # s3_file_url = f"https://{self.aws_page_image_bucket_name}.s3.{self.aws_region}.amazonaws.com/{s3_image_key}"

            # 추후 s3 image object 삭제를 위해 DB에 image key 저장
            page = await self.page_repository.get_page_by_id(page_id)
            if page is None:
                raise HTTPException(status_code=404, detail="Page id에 해당하는 페이지가 없음")

            page.update_image_keys_by_request(s3_image_key)
            await self.page_repository.update_page(page)

            return {
                "s3_image_key": s3_image_key
            }
        except NoCredentialsError:
            raise HTTPException(status_code=500, detail="No AWS credentials found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    async def get_image_file(
        self,
        s3_image_key: str
    ):
        try:
            file_obj = self.s3.get_object(
                Bucket=self.aws_page_image_bucket_name,
                Key=s3_image_key
            )

            # MIME 타입 추론
            content_type = file_obj.get('ContentType')

            # ContentType이 없을 경우 확장자를 통해 추론 (binary/octet-stream인 경우)
            if not content_type or content_type == 'binary/octet-stream':
                content_type, _ = mimetypes.guess_type(s3_image_key)
                content_type = content_type or 'application/octet-stream'

            return StreamingResponse(
                file_obj['Body'],
                media_type=content_type
            )

        except NoCredentialsError:
            raise HTTPException(status_code=500, detail="No AWS credentials found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
