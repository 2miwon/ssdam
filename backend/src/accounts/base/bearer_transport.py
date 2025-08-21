from fastapi import Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi_users.schemas import model_dump
from fastapi_users.authentication import BearerTransport


class BearerResponse(BaseModel):
    access_token: str
    access_token_expiration_time: int
    token_type: str
    onboarding_process: int


class CustomBearerTransport(BearerTransport):
    token_url: str

    def __init__(self, token_url: str):
        self.token_url = token_url
        super().__init__(tokenUrl=token_url)

    async def get_login_response(
            self,
            access_token: str,
            access_token_expiration_time: int,
            refresh_token: str,
            onboarding_process: int
    ) -> Response:
        bearer_response = BearerResponse(
                                        access_token=access_token,
                                        access_token_expiration_time=access_token_expiration_time,
                                        token_type="bearer",
                                        onboarding_process=onboarding_process
        )
        response = JSONResponse(model_dump(bearer_response))
        response.set_cookie(
                            key="refresh_token",
                            value=refresh_token,
                            samesite="none",
                            secure=True,
                            max_age=1209600,
                            httponly=True
        )
        return response

    async def get_logout_response(self) -> Response:
        response = Response()
        response.delete_cookie(key="refresh_token")
        return response
