from src.accounts.models import User
from src.books.repository import BookRepository
from src.books.models import Book
from src.books.schemas import GetBookListOutput, CreateBookOutput, UpdateBookInput, UpdateBookOutput, GetBookOutput, BookDTO, CreateBookInput, CreateBookStructureInput, CreateBookStructureOutput
from src.books.utils import hash_user_id, validate_image
from src.pages.repository import PageRepository
from src.config import settings
from src.book_setting.service import BookSettingService
from src.pages.schemas import CreatePageInput
from src.pages.models import Page
from src.database import client

from fastapi import HTTPException, Depends, File, UploadFile
from beanie import PydanticObjectId
from botocore.exceptions import NoCredentialsError
from io import BytesIO
import os
import boto3


class BookService:
    def __init__(
        self,
        book_repository: BookRepository = Depends(BookRepository),
        page_repository: PageRepository = Depends(PageRepository),
        book_setting_service: BookSettingService = Depends(BookSettingService),
    ):
        self.book_repository = book_repository
        self.page_repository = page_repository
        self.book_setting_service = book_setting_service
        self.client = client

    async def create_book(
        self,
        create_book_input: CreateBookInput,
        user: User
    ) -> CreateBookOutput:
        book = await self.book_repository.create_book(Book.of(create_book_input, user))

        try:
            # create book setting
            await self.book_setting_service.create(book.id)
        except Exception as e:
            print(e)

        return CreateBookOutput.of(book)

    async def create_book_structure(
        self,
        create_book_structure_input: CreateBookStructureInput,
        book_id: str,
    ) -> CreateBookStructureOutput:
        async with await self.client.start_session() as session:
            async with session.start_transaction():
                try:
                    book = await self.book_repository.get_book_by_id(book_id, session=session)
                    if book is None:
                        raise HTTPException(status_code=404, detail="Book id에 해당하는 책이 없음")

                    main_chapter = create_book_structure_input.main_chapter
                    for sub_chapter in main_chapter['sub_chapter_list']:
                        page = await self.page_repository.create_page(
                            Page.of(CreatePageInput.of(sub_chapter['title']), str(book_id)),
                            session=session
                        )
                        sub_chapter['page_id'] = str(page.id)
                        sub_chapter['is_deleted'] = False
                        sub_chapter['deleted_at'] = None
                        for section in sub_chapter['section_list']:
                            page = await self.page_repository.create_page(
                                Page.of(CreatePageInput.of(sub_chapter['title']), str(book_id)),
                                session=session
                            )
                            section['page_id'] = str(page.id)
                            section['is_deleted'] = False
                            section['deleted_at'] = None
                    book.create_structure(main_chapter=main_chapter)
                    await self.book_repository.update_book(book, session=session)
                    return CreateBookStructureOutput.of(main_chapter=book.book_schema['main_chapter'])
                except Exception as e:
                    raise HTTPException(status_code=400, detail="정상적으로 목차 구성을 처리하지 못했습니다.")

    async def get_book_by_id(
        self,
        book_id: PydanticObjectId
    ) -> GetBookOutput:
        book = await self.book_repository.get_book_by_id(book_id)
        if book is None:
            raise HTTPException(status_code=404, detail="Book id에 해당하는 페이지가 없음")
        return GetBookOutput.of(book)

    async def get_book_list(
        self,
        user: User
    ) -> GetBookListOutput:
        book_list = await self.book_repository.get_book_list_by_user(user)
        book_dto_list = [BookDTO.convert_book_to_dto(book) for book in book_list]
        return GetBookListOutput(book_list=book_dto_list)

    async def update_book(
        self,
        update_book_input: UpdateBookInput,
        book_id: PydanticObjectId
    ) -> GetBookListOutput:
        book = await self.book_repository.get_book_by_id(book_id)
        if not book:
            raise HTTPException(status_code=404, detail="Book id에 해당하는 페이지가 없음")
        book.update_by_request(update_book_input)
        updated_book = await self.book_repository.update_book(book)
        return UpdateBookOutput.of(updated_book)

    async def delete_book(
        self,
        user: User,
        book_id: PydanticObjectId
    ) -> None:
        book = await self.book_repository.get_book_by_id(book_id)
        if book is None:
            raise HTTPException(status_code=404, detail="Book not found")
        if book.user.id != user.id:
            raise HTTPException(status_code=401, detail="Not authorized to delete this book")

        await self.page_repository.delete_pages_by_book_id(str(book_id))

        try:
            # delete book setting
            await self.book_setting_service.delete(book_id)
        except Exception as e:
            print(e)

        return await self.book_repository.delete_book(book)


class BookCoverService:
    def __init__(
        self
    ):
        self.aws_book_cover_bucket_name = settings.AWS_BOOK_COVER_BUCKET_NAME
        self.aws_region = "ap-northeast-2"

        # Lambda에서 이미 IAM을 통해 자격 증명을 하기 때문에 SECRET KEY 입력 시 인증 중복 오류 발생
        self.s3 = boto3.client(
            's3'
        )

        self.MAX_FILE_SIZE = 10 * 1024 * 1024
        self.ALLOWED_IMAGE_TYPES = {"jpeg", "png", "jpg"}

    async def update_book_cover(
        self,
        user_id: str,
        book_id: PydanticObjectId,
        img_file: UploadFile = File(...),
    ):
        try:
            if not await validate_image(
                img_file,
                max_file_size=self.MAX_FILE_SIZE,
                allowed_image_types=self.ALLOWED_IMAGE_TYPES
            ):
                raise HTTPException(status_code=400, detail="Not a valid image")

            # original_extension = os.path.splitext(img_file.filename)[1].lower()
            # actual_extension = '.' + (imghdr.what(img_file.file) or 'jpg')
            _, extension = os.path.splitext(img_file.filename)

            # user id가 그대로 url로 노출되는 것을 막기 위한 해시 처리 (퍼블릭 버킷 사용)
            hashed_user_id = hash_user_id(user_id)
            s3_path = f"book_covers/{hashed_user_id}/{book_id}{extension}"

            file_content = await img_file.read()
            file_object = BytesIO(file_content)

            self.s3.upload_fileobj(
                Fileobj=file_object,
                Bucket=self.aws_book_cover_bucket_name,
                Key=s3_path,
            )

            s3_file_url = f"https://{self.aws_book_cover_bucket_name}.s3.{self.aws_region}.amazonaws.com/{s3_path}"

            return {
                "image_url": s3_file_url
            }
        except NoCredentialsError:
            raise HTTPException(status_code=500, detail="No AWS credentials found")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
