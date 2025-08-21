from typing import Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from fastapi import HTTPException, Depends, UploadFile
from anthropic import APIStatusError
from beanie import PydanticObjectId

from src.prompts.prompt_manager import PromptManager
from src.illustration_generator import utils
from src.pages.service import PageImageService

import io


class IllustrationService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "1.0",
        page_image_service: PageImageService = Depends(PageImageService)
    ):
        self.model = ChatAnthropic(
            model=model_name,
            max_tokens=4096
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

        self.page_image_service = page_image_service

    async def create(
        self,
        data,
        user,
        book_id: PydanticObjectId,
        page_id: PydanticObjectId
    ) -> dict:
        input_variable = {
            "desired_image": data.user_prompt,
            "relevant_excerpt": data.excerpt,
            "section_title": data.title,
            "book_genre": data.genre
        }

        prompt, input_variable = utils.create_prompt_template_for_illustration_prompt(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            image_prompt = await utils.generate_prompt_for_illustration_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                image_prompt = await utils.generate_prompt_for_illustration_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

        try:
            image = await utils.generate_illustration_response(image_prompt)
            image_file = io.BytesIO(image)

            image_object = UploadFile(
                file=image_file,
                filename="image.png"
            )

            s3_image_key = await self.page_image_service.upload_image_file(
                user_id=str(user.id),
                book_id=book_id,
                page_id=page_id,
                img_file=image_object
            )
            return s3_image_key

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
