from fastapi_users.db import BeanieUserDatabase
from typing import List
from fastapi_users.db import BaseOAuthAccount, BeanieBaseUser
from pydantic import Field
from src.models import TimestampMixin
from beanie import Document
from src.revision.models import RevisionDay
from src.accounts.schemas import UpdateUserInput
from enum import Enum
from src.config import settings


class Grade(str, Enum):
    FREE: str = 'free'
    BASIC: str = 'basic'
    PREMIUM: str = 'premium'


class OAuthAccount(BaseOAuthAccount, TimestampMixin):
    pass


class User(BeanieBaseUser, Document, TimestampMixin):
    oauth_accounts: List[OAuthAccount] = Field(default_factory=list)
    revision: List[RevisionDay] = Field(default_factory=list)
    onboarding_process: int = Field(default_factory=int)
    grade: Grade = Field(default=Grade.FREE)

    def update_by_request(self, update_user_input: UpdateUserInput) -> "User":
        self.onboarding_process = update_user_input.onboarding_process
        return self

    def get_daily_revision_limit(self) -> int:
        if self.grade is None:
            return settings.DAILY_REVISION_LIMIT

        limits = {
            Grade.FREE: settings.DAILY_REVISION_LIMIT,
            Grade.BASIC: settings.DAILY_REVISION_LIMIT,
            Grade.PREMIUM: settings.DAILY_PREMIUM_REVISION_LIMIT
        }
        return limits.get(self.grade, settings.DAILY_REVISION_LIMIT)


async def get_user_db():
    yield BeanieUserDatabase(User, OAuthAccount)
