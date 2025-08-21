from typing import Optional
from langchain_openai import ChatOpenAI
from fastapi import HTTPException

from src.prompts.prompt_manager import PromptManager
from src.synonym_generator import utils


class SynonymGeneratorService:
    def __init__(
        self,
        model_name: str = "gpt-4o-mini-2024-07-18",
        prompt_version: Optional[str] = "1.0"
    ):
        self.model = ChatOpenAI(
            model=model_name
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

    async def create(self, data):
        input_variable = {
            "context_text": data.context_text,
            "target_text": data.target_text
        }

        prompt, input_variable = utils.create_prompt_template_for_synonym_generator(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_synonym_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

        return response
