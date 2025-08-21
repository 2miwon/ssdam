from typing import Optional
from beanie import PydanticObjectId
from langchain_openai import ChatOpenAI
from fastapi import HTTPException, Depends

from src.prompts.prompt_manager import PromptManager
from src.sentence_predictor import utils
from src.book_setting.repository import BookSettingRepository


class SentencePredictorService:
    def __init__(
        self,
        model_name: str = "gpt-4o-mini-2024-07-18",
        prompt_version: Optional[str] = "2.0",
        book_setting_repository: BookSettingRepository = Depends(BookSettingRepository)
    ):
        self.model = ChatOpenAI(
            model=model_name
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

        self.book_setting_repository = book_setting_repository

    async def create(
        self,
        data,
        user,
        book_id: PydanticObjectId
    ):
        input_variable = await self.create_book_info(
            book_id=book_id,
            section_title=data.title
        )
        input_variable["prev_sentence"] = data.prev_sentence

        prompt, input_variable = utils.create_prompt_template_for_sentence_predictor(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_sentence_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

        return response

    async def create_book_info(
        self,
        book_id: PydanticObjectId,
        section_title: str,
    ) -> dict:

        book_setting = await self.book_setting_repository.get_by_book_id(book_id)
        book_info = \
            f"""
            Section title: {section_title}
            Style example: {book_setting.writing_style if book_setting.writing_style else "No information provided"}
            Book genre: {book_setting.genre if book_setting.genre else "No information provided"}
            """

        input_variable = {
            "book_info": book_info
        }

        return input_variable
