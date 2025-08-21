from fastapi import Depends, HTTPException, status
from src.accounts.libs import get_user_manager, get_jwt_strategy, auth_backend, JWTStrategy, BaseUserManager, User, PydanticObjectId
from src.accounts.auth.model import RefreshToken


class AuthService:
    def __init__(
            self,
            auth_backend,
            jwt_strategy: JWTStrategy,
            user_manager: BaseUserManager[User, PydanticObjectId]
    ):
        self.auth_backend = auth_backend
        self.jwt_strategy = jwt_strategy
        self.user_manager = user_manager

    async def get_user_id_by_refresh_token(self, refresh_token: str):
        refresh_token = await RefreshToken.find_one(RefreshToken.refresh_token == refresh_token)
        if refresh_token is not None:
            return refresh_token.user_id
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="NOT FOUND REFRESH TOKEN"
        )

    async def create_new_access_token(self, refresh_token: str):
        user_id = await self.get_user_id_by_refresh_token(refresh_token)
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="NOT FOUND USER ID"
            )
        user = await self.user_manager.get(user_id)
        response = await self.auth_backend.login(strategy=self.jwt_strategy, user=user)
        return response

    async def logout(self, refresh_token: str, user: User):
        await RefreshToken.find_one(RefreshToken.refresh_token == refresh_token).delete()
        response = await self.auth_backend.logout(strategy=self.jwt_strategy, user=user)
        return response


def get_auth_service(
        auth_backend=auth_backend,
        jwt_strategy: JWTStrategy = Depends(get_jwt_strategy),
        user_manager: BaseUserManager[User, PydanticObjectId] = Depends(get_user_manager)
):
    return AuthService(auth_backend, jwt_strategy, user_manager)