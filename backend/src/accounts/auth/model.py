from beanie import Document, Indexed
from pydantic import Field
from pymongo import ASCENDING, IndexModel
from datetime import datetime


class RefreshToken(Document):
    refresh_token: str = Field(default=str)
    user_id: str = Field(default=str)
    expires_at: Indexed(datetime) = Field(default_factory=datetime)

    class Settings:
        indexes = [
            IndexModel(
                [("expires_at", ASCENDING)],
                expireAfterSeconds=0
            )
        ]
