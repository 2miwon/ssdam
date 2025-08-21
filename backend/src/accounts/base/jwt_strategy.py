from fastapi_users.authentication import  JWTStrategy
from typing import List, Optional

from fastapi_users.jwt import SecretType, generate_jwt


class CustomJWTStrategy(JWTStrategy):
    def __init__(
            self,
            secret: SecretType,
            lifetime_seconds: Optional[int],
            lifetime_refresh_seconds: Optional[int],
            token_audience: List[str] = ["fastapi-users:auth"],
            algorithm: str = "HS256",
            public_key: Optional[SecretType] = None,
    ):
        super().__init__(secret, lifetime_seconds, token_audience, algorithm, public_key)
        self.lifetime_refresh_seconds = lifetime_refresh_seconds

    async def write_token(self, user_id: str) -> str:
        data = {"sub": str(user_id), "aud": self.token_audience}
        return generate_jwt(
            data, self.encode_key, self.lifetime_seconds, algorithm=self.algorithm
        )

    async def write_refresh_token(self) -> str:
        return generate_jwt(
            {}, self.encode_key, self.lifetime_refresh_seconds, algorithm=self.algorithm
        )

    async def get_access_token_expiration_time(self) -> int:
        return self.lifetime_seconds

    async def get_refresh_token_expiration_time(self) -> int:
        return self.lifetime_refresh_seconds
