from fastapi import Depends, HTTPException, File, UploadFile
from beanie import PydanticObjectId
from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from anthropic import APIStatusError

from src.book_setting.models import BookSetting
from src.book_setting.repository import BookSettingRepository
from src.book_setting.schemas import BookSettingInput, BookSettingOutput
from src.book_setting import utils
from src.prompts.prompt_manager import PromptManager
from src.data_hub.repository import ChapterDataRepository


class BookSettingService:
    def __init__(
        self,
        book_setting_repository: BookSettingRepository = Depends(BookSettingRepository),
    ):
        self.book_setting_repository = book_setting_repository

    async def create(
        self,
        book_id: PydanticObjectId
    ) -> BookSettingOutput:
        # This func will operate with create book
        book_setting = await self.book_setting_repository.create(BookSetting.of(str(book_id)))
        return BookSettingOutput.of(book_setting)

    async def get_by_book_id(
        self,
        book_id: PydanticObjectId
    ) -> BookSettingOutput:
        book_setting = await self.book_setting_repository.get_by_book_id(book_id)
        if book_setting is None:
            return await self.create(book_id)
        return BookSettingOutput.of(book_setting)

    async def update(
        self,
        book_id: PydanticObjectId,
        update_book_setting_input: BookSettingInput
    ) -> BookSettingOutput:
        book_setting = await self.book_setting_repository.get_by_book_id(book_id)
        if book_setting is None:
            raise HTTPException(status_code=404, detail="book id에 해당하는 book setting이 없음")
        book_setting.update_by_request(update_book_setting_input)
        updated_book_setting = await self.book_setting_repository.update(book_setting)
        return BookSettingOutput.of(updated_book_setting)

    async def delete(
        self,
        book_id: PydanticObjectId
    ) -> None:
        book_setting = await self.book_setting_repository.get_by_book_id(book_id)
        if book_setting is None:
            raise HTTPException(status_code=404, detail="book id에 해당하는 book setting이 없음")
        await self.book_setting_repository.delete(book_setting)

    async def update_from_chapter_data(
        self,
        book_id: PydanticObjectId,
        chapter_data_repository: ChapterDataRepository = Depends(ChapterDataRepository)
    ) -> BookSettingOutput:
        # Generate subject, purpose draft for book setting
        # This func will operate after chapter recommendation

        book_setting_draft_service = BookSettingDraftService(
            model_name="claude-3-5-sonnet-20240620",
            prompt_version="1.1",
            chapter_data_repository=chapter_data_repository
        )

        book_setting_draft_response = await book_setting_draft_service.create(book_id)

        book_setting = await self.book_setting_repository.get_by_book_id(book_id)
        if book_setting is None:
            raise HTTPException(status_code=404, detail="book id에 해당하는 book setting이 없음")

        book_setting.update_subject_and_purpose_by_request(book_setting_draft_response)
        updated_book_setting = await self.book_setting_repository.update(book_setting)

        return BookSettingOutput.of(updated_book_setting)


class BookSettingDraftService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = None,
        chapter_data_repository: ChapterDataRepository = Depends(ChapterDataRepository)
    ):
        self.model = ChatAnthropic(
            model=model_name,
            max_tokens=4096
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

        self.chapter_data_repository = chapter_data_repository

    async def create(self, book_id):
        chapter_data_list = await self.chapter_data_repository.get_by_book_id(book_id)

        if not chapter_data_list:
            raise HTTPException(status_code=404, detail="book id에 해당하는 chapter data가 없음")

        chapter_qa_list = [(data.question, data.answer) for data in chapter_data_list]

        input_variable = {
            "qa_data": chapter_qa_list
        }

        prompt, input_variable = utils.create_prompt_template_for_book_setting_subject_and_purpose(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_subject_and_purpose_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )

            if not ('subject' in response and 'purpose' in response):
                raise HTTPException(status_code=500, detail="subject 혹은 purpose 데이터가 생성되지 않음")

            return response

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_subject_and_purpose_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
                return response
            else:
                raise HTTPException(status_code=500, detail="APIStatusError: " + str(e))

        except Exception as e:
            try:
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_subject_and_purpose_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
                return response

            except Exception as e:
                raise HTTPException(status_code=500, detail=str(e))
