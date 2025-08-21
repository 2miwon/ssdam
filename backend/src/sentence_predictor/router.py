from fastapi import APIRouter, Depends
from beanie import PydanticObjectId

from src.accounts.libs import current_active_user
from src.sentence_predictor.service import SentencePredictorService
from src.sentence_predictor.schemas import SentenceInput
from src.sentence_predictor.schemas import SentenceOutput


router = APIRouter(
    prefix="/api/sentence-predictor",
)


@router.post(
    "/books/{book_id}",
    tags=['sentence-predictor'],
    response_model=SentenceOutput
)
async def create_sentence(
    book_id: PydanticObjectId,
    data: SentenceInput,
    user=Depends(current_active_user),
    sentence_predictor_service: SentencePredictorService = Depends(SentencePredictorService)
):
    return await sentence_predictor_service.create(data, user, book_id)
