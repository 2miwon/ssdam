from fastapi import APIRouter, Depends
from src.accounts.libs import current_active_user

from src.revision.service import RevisionService
from src.revision.schemas import BlocksInput
from src.revision.schemas import BlocksOutput

router = APIRouter(
    prefix="/api/revision"
)


@router.post(
    "",
    tags=['revision'],
    response_model=BlocksOutput
)
async def create_revision(
    data: BlocksInput,
    user=Depends(current_active_user),
    revision_service: RevisionService = Depends(RevisionService)
):
    return await revision_service.create(data, user)
