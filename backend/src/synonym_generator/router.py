from fastapi import APIRouter, Depends
from src.accounts.libs import current_active_user

from src.synonym_generator.service import SynonymGeneratorService
from src.synonym_generator.schemas import SynonymInput
from src.synonym_generator.schemas import SynonymOutput


router = APIRouter(
    prefix="/api/synonym-generator",
)


@router.post(
    "",
    tags=['synonym-generator'],
    response_model=SynonymOutput
)
async def create_synonym(
    data: SynonymInput,
    user=Depends(current_active_user),
    synonym_generator_service: SynonymGeneratorService = Depends(SynonymGeneratorService)
):
    return await synonym_generator_service.create(data)
