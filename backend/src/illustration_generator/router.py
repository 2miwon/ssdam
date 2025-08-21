from fastapi import APIRouter, Depends, HTTPException
from src.accounts.libs import current_active_user
from beanie import PydanticObjectId

from src.illustration_generator.service import IllustrationService
from src.illustration_generator.schemas import IllustrationInput
from src.illustration_generator.schemas import IllustrationOutput


router = APIRouter(
    prefix="/api/illustration-generator",
)


@router.post(
    "/books/{book_id}/pages/{page_id}",
    tags=['illustration-generator'],
    response_model=IllustrationOutput,
)
async def create_illustration(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    data: IllustrationInput,
    user=Depends(current_active_user),
    illustration_service: IllustrationService = Depends(IllustrationService),
):
    try:
        return await illustration_service.create(
            data,
            user,
            book_id,
            page_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
