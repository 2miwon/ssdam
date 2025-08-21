from httpx_oauth.clients.naver import NaverOAuth2
from src.accounts.libs import fastapi_users
from src.accounts.libs import auth_backend
from src.config import settings

naver_oauth_client = NaverOAuth2(
    client_id=settings.NAVER_CLIENT_ID,
    client_secret=settings.NAVER_SECRET_KEY,
)


naver_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=naver_oauth_client,
    backend=auth_backend,
    state_secret=settings.JWT_SECRET_KEY,
    redirect_url=settings.NAVER_REDIRECT_URL,
    associate_by_email=True,
)
