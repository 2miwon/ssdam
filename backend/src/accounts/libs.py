from typing import Optional
from fastapi_users.authentication import JWTStrategy
from src.accounts.models import User
from src.accounts.models import get_user_db
from src.config import settings
from src.accounts.base.backend import OAuthBackend
from fastapi_users.db import BeanieUserDatabase, ObjectIDIDMixin
from beanie import PydanticObjectId
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, FastAPIUsers
from src.accounts.base.jwt_strategy import CustomJWTStrategy
from src.accounts.base.bearer_transport import CustomBearerTransport


SECRET = settings.JWT_SECRET_KEY


class UserManager(ObjectIDIDMixin, BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        pass


async def get_user_manager(user_db: BeanieUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


def get_jwt_strategy() -> JWTStrategy:
    return CustomJWTStrategy(
        secret=SECRET,
        lifetime_seconds=settings.JWT_ACCESS_TOKEN_EXPIRE_SECONDS,
        lifetime_refresh_seconds=settings.JWT_REFRESH_TOKEN_EXPIRE_SECONDS,
        algorithm=settings.JWT_ALGORITHM
    )


bearer_transport = CustomBearerTransport(token_url="auth/jwt/login")


auth_backend = OAuthBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, PydanticObjectId](get_user_manager, [auth_backend])

current_active_user = fastapi_users.current_user(active=True)

