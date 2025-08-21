from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from fastapi import HTTPException, Depends
from anthropic import APIStatusError
from beanie import PydanticObjectId

from src.prompts.prompt_manager import PromptManager
from src.draft_generator import utils
from src.data_hub.service import DraftDataService
from src.book_setting.repository import BookSettingRepository


class LightDraftService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "1.1",
        draft_data_service: DraftDataService = Depends(DraftDataService),

    ):
        self.model = ChatAnthropic(
            model=model_name,
            max_tokens=4096
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version
        self.draft_data_service = draft_data_service

    async def create(self, data, user, page_id):
        input_variable = {
            "title": data.title
        }

        prompt, input_variable = utils.create_prompt_template_for_light_draft_generator(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_light_draft_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_light_draft_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        draft_content = ' '.join(response['draft']) if 'draft' in response else ''
        await self.draft_data_service.create(
                data.title,
                draft_content,
                page_id,
                user
            )

        return response


class DraftService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "1.0",
        draft_data_service: DraftDataService = Depends(DraftDataService),
        book_setting_repository: BookSettingRepository = Depends(BookSettingRepository),
    ):
        self.model = ChatAnthropic(
            model=model_name,
            max_tokens=4096
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

        self.draft_data_service = draft_data_service
        self.book_setting_repository = book_setting_repository

    async def create(
        self,
        data,
        user,
        book_id: PydanticObjectId,
        page_id: PydanticObjectId
    ):
        input_variable = await self.create_book_info(
            book_id=book_id,
            section_title=data.title
        )

        prompt, input_variable = utils.create_prompt_template_for_draft_generator(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_draft_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_draft_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        try:
            draft_content = ' '.join(response['draft']) if 'draft' in response else ''
            await self.draft_data_service.create(
                data.title,
                draft_content,
                page_id,
                user
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to create draft data: {e}")

        return response

    async def create_book_info(
        self,
        book_id: PydanticObjectId,
        section_title: str
    ) -> dict:
        # book setting 정보가 없을 시 chapter data 확인 후, 데이터가 존재하면 업데이트 -> 프론트 모달 띄우기로 변경
        book_setting = await self.book_setting_repository.get_by_book_id(book_id)

        genre_prompt = await utils.select_genre_prompt(book_setting.genre)
        book_info = \
            f"""
            section_title: {section_title}
            book_genre: {book_setting.genre if book_setting.genre else "No information provided"}
            book_subject: {book_setting.subject if book_setting.subject else "No information provided"}
            book_purpose: {book_setting.purpose if book_setting.purpose else "No information provided"}
            writing_style: {book_setting.writing_style if book_setting.writing_style else "No information provided"}
            target_readers: {book_setting.target_readers if book_setting.target_readers else "No information provided"}
            target_readers_description: {book_setting.target_readers_description if book_setting.target_readers_description else "No information provided"}
            """

        input_variable = {
            "genre_prompt": genre_prompt,
            "book_info": book_info
        }

        return input_variable
