from fastapi import APIRouter, Depends

from src.chapter_recommendation.service import SubQuestionService, SectionService, SectionClusteringService
from src.chapter_recommendation.schemas import SubQuestionInput, SectionInput, SectionClusteringInput
from src.chapter_recommendation.schemas import SubQuestionOutput, SectionOutput, SectionClusteringOutput
from src.accounts.libs import current_active_user
from src.accounts.models import User

router = APIRouter(
    prefix="/api/chapter-recommendation"
)


# @router.post("/main-question", tags=['chapter-recommendation'], response_model=MainQuestionOutput)
# def create_main_question(
#         data: MainQuestionInput,
# ):
#     _service = MainQuestionService(
#         model_name="claude-3-5-sonnet-20240620",
#         prompt_version="2.1"
#     )
#     return _service.create(data)


@router.post(
    "/sub-question",
    tags=['chapter-recommendation'],
    response_model=SubQuestionOutput
)
async def create_sub_question(
    data: SubQuestionInput,
    user: User = Depends(current_active_user),
    sub_question_service: SubQuestionService = Depends(SubQuestionService)
):
    return await sub_question_service.create(data)


@router.post(
    "/section",
    tags=['chapter-recommendation'],
    response_model=SectionOutput
)
async def create_section(
    data: SectionInput,
    user: User = Depends(current_active_user),
    section_service: SectionService = Depends(SectionService)
):
    return await section_service.create(data)


@router.post(
    "/section-clustering",
    tags=['chapter-recommendation'],
    response_model=SectionClusteringOutput
)
async def create_section_clustering(
    data: SectionClusteringInput,
    user: User = Depends(current_active_user),
    section_clustering_service: SectionClusteringService = Depends(SectionClusteringService)
):
    return await section_clustering_service.create(data)
