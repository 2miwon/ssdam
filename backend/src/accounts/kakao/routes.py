from httpx_oauth.clients.kakao import KakaoOAuth2
from src.accounts.libs import fastapi_users
from src.accounts.libs import auth_backend
from src.config import settings

kakao_oauth_client = KakaoOAuth2(
    client_id=settings.KAKAO_CLIENT_ID,
    client_secret=settings.KAKAO_SECRET_KEY,
    scopes=["account_email"]
)

kakao_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=kakao_oauth_client,
    backend=auth_backend,
    state_secret=settings.JWT_SECRET_KEY,
    redirect_url=settings.KAKAO_REDIRECT_URL,
    associate_by_email=True,
)
