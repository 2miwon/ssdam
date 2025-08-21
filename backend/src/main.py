import os

from fastapi import FastAPI
from dotenv import load_dotenv
from beanie import init_beanie
from mangum import Mangum
from starlette.middleware.cors import CORSMiddleware

from src.database import db
from src.accounts.models import User
from src.books.models import Book
from src.pages.models import Page
from src.book_setting.models import BookSetting
from src.accounts.auth.model import RefreshToken
from src.data_hub.models import ChapterData, RevisionData, DraftData, SentenceData

from src.accounts import router as accounts_router
from src.books import router as books_router
from src.pages import router as pages_router
from src.data_hub import router as data_hub_router
from src.revision import router as revision_router
from src.chapter_recommendation import router as chapter_recommendation_router
from src.sentence_predictor import router as sentence_predictor_router
from src.draft_generator import router as draft_generator_router
from src.synonym_generator import router as synonym_generator_router
from src.book_setting import router as book_setting_router
from src.illustration_generator import router as illustration_generator_router
from contextlib import asynccontextmanager


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_beanie(
        database=db,
        document_models=[
            User,
            Book,
            Page,
            BookSetting,
            RefreshToken,
            ChapterData,
            RevisionData,
            DraftData,
            SentenceData,
        ],
    )
    yield
    # Shutdown (필요한 경우)


app = FastAPI(lifespan=lifespan)

origins = [
    "http://127.0.0.1:8001",
    "http://localhost:3000",
    "https://ssdam.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts_router.router)
app.include_router(books_router.router)
app.include_router(pages_router.router)
app.include_router(data_hub_router.router)
app.include_router(chapter_recommendation_router.router)
app.include_router(revision_router.router)
app.include_router(sentence_predictor_router.router)
app.include_router(draft_generator_router.router)
app.include_router(synonym_generator_router.router)
app.include_router(book_setting_router.router)
app.include_router(illustration_generator_router.router)

handler = Mangum(app)


