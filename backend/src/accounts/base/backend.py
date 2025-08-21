from typing import Any
from fastapi_users import models
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.authentication.strategy import Strategy
from fastapi_users.authentication.transport import Transport
from fastapi_users.types import DependencyCallable
from fastapi_users.authentication.transport import TransportLogoutNotSupportedError
from fastapi import Response, status
from src.accounts.models import User
from src.accounts.auth.model import RefreshToken
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


class OAuthBackend(AuthenticationBackend):
    def __init__(
            self,
            name: str,
            transport: Transport,
            get_strategy: DependencyCallable[Strategy[models.UP, models.ID]],
    ):
        super().__init__(name, transport, get_strategy)

    async def login(self, strategy: Strategy, user: User) -> Any:
        access_token = await strategy.write_token(user.id)
        access_token_expiration_time = await strategy.get_access_token_expiration_time()

        refresh_token = await strategy.write_refresh_token()
        refresh_token_expiration_time = await strategy.get_refresh_token_expiration_time()

        await RefreshToken(refresh_token=refresh_token,
                           user_id=str(user.id),
                           expires_at=(datetime.now(ZoneInfo("Asia/Seoul"))
                                       + timedelta(seconds=refresh_token_expiration_time))).insert()
        return await self.transport.get_login_response(access_token, access_token_expiration_time, refresh_token, user.onboarding_process)

    async def logout(self, strategy: Strategy, user: models.UP) -> Response:
        try:
            response = await self.transport.get_logout_response()
        except TransportLogoutNotSupportedError:
            response = Response(status_code=status.HTTP_204_NO_CONTENT)
        return response
