import os

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Config(BaseSettings):
    ENV: str = "dev"
    DB_URL: str = os.getenv("DB_DEV_URL")
    DB_NAME: str = os.getenv("DB_DEV_NAME")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")

    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRE_SECONDS: int = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_SECONDS", 3600))
    JWT_REFRESH_TOKEN_EXPIRE_SECONDS: int = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_SECONDS", 1209600))

    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_SECRET_KEY: str = os.getenv("GOOGLE_SECRET_KEY")
    GOOGLE_REDIRECT_URL: str = os.getenv("GOOGLE_DEV_REDIRECT_URL")

    GOOGLE_SCOPE_PROFILE: str = os.getenv("GOOGLE_SCOPE_PROFILE")
    GOOGLE_SCOPE_EMAIL: str = os.getenv("GOOGLE_SCOPE_EMAIL")

    NAVER_CLIENT_ID: str = os.getenv("NAVER_CLIENT_ID")
    NAVER_SECRET_KEY: str = os.getenv("NAVER_SECRET_KEY")
    NAVER_REDIRECT_URL: str = os.getenv("NAVER_DEV_REDIRECT_URL")

    KAKAO_CLIENT_ID: str = os.getenv("KAKAO_CLIENT_ID")
    KAKAO_SECRET_KEY: str = os.getenv("KAKAO_SECRET_KEY")
    KAKAO_REDIRECT_URL: str = os.getenv("KAKAO_DEV_REDIRECT_URL")

    DAILY_REVISION_LIMIT: int = int(os.getenv("DAILY_DEV_REVISION_LIMIT", 3000))
    # DAILY_PREMIUM_REVISION_LIMIT: int = int(os.getenv("DAILY_PROD_PREMIUM_REVISION_LIMIT", 100000))
    DAILY_PREMIUM_REVISION_LIMIT: int = 100000

    AWS_BOOK_COVER_BUCKET_NAME: str = os.getenv("AWS_BOOK_COVER_BUCKET_NAME")
    AWS_PAGE_IMAGE_BUCKET_NAME: str = os.getenv("AWS_PAGE_IMAGE_BUCKET_NAME")

    GETIMG_API_KEY: str = os.getenv("GETIMG_API_KEY")


settings: Config = Config()
