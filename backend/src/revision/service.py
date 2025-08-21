from typing import Optional
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI
from datetime import datetime, date
from fastapi import HTTPException
from anthropic import APIStatusError

from src.prompts.prompt_manager import PromptManager
from src.revision import utils
from src.accounts.models import User
from src.revision.models import RevisionDay, RevisionDetail

class RevisionService:
    def __init__(
        self,
        claude_model_name: str = "claude-3-5-sonnet-20241022",
        gpt_model_name: str = "gpt-4o",
        prompt_version: Optional[str] = "3.1",
    ):
        self.claude_model = ChatAnthropic(
            model=claude_model_name,
            max_tokens=8192
        )
        self.gpt_model = ChatOpenAI(
            model=gpt_model_name,
        )
        self.prompt_manager = PromptManager()
        self.prompt_version = prompt_version

    async def create(self, data, user):
        input_variable = {
            "blocks": data.blocks
        }

        today = date.today()
        text_length = utils.text_length_in_blocks(input_variable["blocks"])

        if await self.is_revision_available(
                user,
                text_length=text_length,
                today=today
        ) is False:
            raise HTTPException(status_code=400, detail="Revision is not available")

        prompt, input_variable = utils.create_prompt_template_for_revision(
            prompt_manager=self.prompt_manager,
            prompt_version=self.prompt_version,
            input_variable=input_variable,
        )

        try:
            response = await utils.generate_revision_response(
                prompt=prompt,
                model=self.claude_model,
                input_variable=input_variable,
            )

            return response

        except APIStatusError as e:
            try:
                response = await utils.generate_revision_response(
                    prompt=prompt,
                    model=self.gpt_model,
                    input_variable=input_variable,
                )

                return response

            except Exception as e:
                # 퇴고 실패시 토큰 재충전
                await self.failed_revision(
                    user,
                    text_length=text_length,
                    today=today,
                )
                raise HTTPException(status_code=500, detail=str(e))

        except Exception as e:
            # 퇴고 실패시 토큰 재충전
            await self.failed_revision(
                user,
                text_length=text_length,
                today=today,
            )
            raise HTTPException(status_code=500, detail=str(e))

    async def is_revision_available(
        self,
        user: User,
        text_length: int,
        today: datetime.date
    ) -> bool:

        current_time = datetime.now()
        daily_revision_limit = user.get_daily_revision_limit()

        try:
            if user.revision and user.revision[-1].date == today:
                if user.revision[-1].count > daily_revision_limit:
                    return False
                user.revision[-1].count += text_length
                user.revision[-1].details.append(RevisionDetail(time=current_time))
            else:
                new_revision_day = RevisionDay(
                    date=today,
                    count=text_length,
                    details=[RevisionDetail(time=current_time)]
                )
                user.revision.append(new_revision_day)

            await user.save()

            return True

        except Exception as e:
            print(f"Error in is_revision_available: {str(e)}")
            return False

    async def failed_revision(
        self,
        user: User,
        text_length: int,
        today: datetime.date
    ) -> bool:

        try:
            if user.revision and user.revision[-1].date == today:
                user.revision[-1].count -= text_length

            await user.save()

            return True

        except Exception as e:
            print(f"Error in failed_revision: {str(e)}")
            return False
