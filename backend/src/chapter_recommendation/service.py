from typing import Dict, List, Optional
from fastapi import HTTPException
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from anthropic import APIStatusError

from src.prompts.prompt_manager import PromptManager
from src.chapter_recommendation import utils


# class MainQuestionService:
#     def __init__(
#         self,
#         model_name: str,
#         prompt_version: Optional[str] = None
#     ):
#         self.model = ChatAnthropic(model=model_name)
#         self.prompt_manager = PromptManager()
#         self.prompt_version = prompt_version
#
#     async def create(self, data) -> Dict[str, List[str]]:
#         input_variable = {
#             "topic": data.topic
#         }
#
#         prompt = utils.create_prompt_template_for_main_question(
#             prompt_manager=self.prompt_manager,
#             prompt_version=self.prompt_version,
#         )
#
#         try:
#             response = await utils.generate_single_list_response(
#                 prompt=prompt,
#                 model=self.model,
#                 input_variable=input_variable,
#                 key_name="main_question_list",
#             )
#             return response
#
#         except APIStatusError as e:
#             if e.status_code == 529:  # overloaded error
#                 gpt_model = ChatOpenAI(model="gpt-4o")
#                 response = await utils.generate_single_list_response(
#                     prompt=prompt,
#                     model=gpt_model,
#                     input_variable=input_variable,
#                     key_name="main_question_list",
#                 )
#                 return response
#             else:
#                 raise HTTPException(status_code=500, detail=str(e))
#
#         except Exception as e:
#             raise HTTPException(status_code=422, detail="Failed to process the request")
#
#         return response


class SubQuestionService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "3.0",
    ):
        self.model = ChatAnthropic(model=model_name)
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

    async def create(self, data) -> Dict[str, List[str]]:
        input_variable = {
            "topic": data.topic,
            "main_question": data.main_question,
            "main_answer": data.main_answer,
        }

        prompt, input_variable = utils.create_prompt_template_for_sub_question(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_sub_question_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )
            return response

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_sub_question_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
                return response
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to process the request")

        return response


class SectionService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "3.0"
    ):
        self.model = ChatAnthropic(model=model_name)
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

    async def create(self, data) -> Dict[str, List[str]]:
        input_variable = {
            "topic": data.topic,
            "main_answer": data.main_answer,
            "sub_question": data.sub_question,
            "sub_answer": data.sub_answer,
        }

        prompt, input_variable = utils.create_prompt_template_for_section(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_section_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )
            return response

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_section_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
                return response
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to process the request")

        return response


class SectionClusteringService:
    def __init__(
        self,
        model_name: str = "claude-3-5-sonnet-20241022",
        prompt_version: Optional[str] = "3.0"
    ):
        self.model = ChatAnthropic(model=model_name)
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

    async def create(self, data):
        input_variable = {
            "main_answer": data.main_answer,
            "section_list": data.section_list
        }

        prompt, input_variable = utils.create_prompt_template_for_section_clustering(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_section_clustering_response(
                prompt=prompt,
                model=self.model,
                input_variable=input_variable,
            )
            return response

        except APIStatusError as e:
            if e.status_code == 529:  # overloaded error
                gpt_model = ChatOpenAI(model="gpt-4o")
                response = await utils.generate_section_clustering_response(
                    prompt=prompt,
                    model=gpt_model,
                    input_variable=input_variable,
                )
                return response
            else:
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to process the request")

        return response
