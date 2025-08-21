from fastapi import APIRouter, Depends
from src.accounts.libs import current_active_user
from beanie import PydanticObjectId

from src.draft_generator.service import LightDraftService, DraftService
from src.draft_generator.schemas import LightDraftInput, DraftInput
from src.draft_generator.schemas import LightDraftOutput, DraftOutput


router = APIRouter(
    prefix="/api/draft-generator",
)


@router.post(
    "/pages/{page_id}",
    tags=['draft-generator'],
    response_model=LightDraftOutput
)
async def create_light_draft(
    page_id: PydanticObjectId,
    data: LightDraftInput,
    user=Depends(current_active_user),
    light_draft_service: LightDraftService = Depends(LightDraftService),
):
    return await light_draft_service.create(data, user, page_id)


@router.post(
    "/books/{book_id}/pages/{page_id}",
    tags=['draft-generator'],
    response_model=DraftOutput
)
async def create_draft(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    data: DraftInput,
    user=Depends(current_active_user),
    draft_service: DraftService = Depends(DraftService),
):
    return await draft_service.create(data, user, book_id, page_id)
