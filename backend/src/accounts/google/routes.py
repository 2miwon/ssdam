from src.config import settings
from httpx_oauth.clients.google import GoogleOAuth2
from src.accounts.libs import fastapi_users
from src.accounts.libs import auth_backend

SECRET = settings.JWT_SECRET_KEY
GOOGLE_SCOPE_PROFILE = settings.GOOGLE_SCOPE_PROFILE
GOOGLE_SCOPE_EMAIL = settings.GOOGLE_SCOPE_EMAIL

google_oauth_client = GoogleOAuth2(
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_SECRET_KEY,
    scopes=[
        GOOGLE_SCOPE_EMAIL, GOOGLE_SCOPE_PROFILE
    ],
)


google_oauth_router = fastapi_users.get_oauth_router(
    oauth_client=google_oauth_client,
    backend=auth_backend,
    state_secret=settings.JWT_SECRET_KEY,
    redirect_url=settings.GOOGLE_REDIRECT_URL,
    associate_by_email=True,
)
