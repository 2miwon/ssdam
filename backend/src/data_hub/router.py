from src.accounts.libs import current_active_user
from src.data_hub.schemas import ChapterDataInput, RevisionDataInput, DraftDataInput, SentenceDataInput
from src.data_hub.service import ChapterDataService, RevisionDataService, DraftDataService, SentenceDataService

from fastapi import APIRouter, Depends, HTTPException, status
from starlette.responses import JSONResponse
from beanie import PydanticObjectId


router = APIRouter(
    prefix="/api/data"
)


@router.post(
    "/books/{book_id}/chapter",
    description="글감 추천 데이터 저장",
    tags=['data'],
    status_code=200
)
async def create_chapter_data(
    book_id: PydanticObjectId,
    chapter_data_input: ChapterDataInput,
    user=Depends(current_active_user),
    chapter_data_service: ChapterDataService = Depends(ChapterDataService)
):
    try:
        await chapter_data_service.create(
            chapter_data_input,
            book_id,
            user
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "글감 추천 데이터가 성공적으로 저장되었습니다."}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post(
    "/pages/{page_id}/revision",
    description="퇴고 데이터 저장",
    tags=['data'],
    status_code=200
)
async def create_revision_data(
    page_id: PydanticObjectId,
    revision_data_input: RevisionDataInput,
    user=Depends(current_active_user),
    revision_data_service: RevisionDataService = Depends(RevisionDataService)
):
    try:
        await revision_data_service.create(
            revision_data_input,
            page_id,
            user
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "퇴고 데이터가 성공적으로 저장되었습니다."}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post(
    "/pages/{page_id}/draft",
    description="초안 작성 데이터 저장",
    tags=['data'],
    status_code=200
)
async def create_draft_data(
    page_id: PydanticObjectId,
    draft_data_input: DraftDataInput,
    user=Depends(current_active_user),
    draft_data_service: DraftDataService = Depends(DraftDataService)
):
    try:
        await draft_data_service.create(
            draft_data_input,
            page_id,
            user
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "초안 작성 데이터가 성공적으로 저장되었습니다."}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post(
    "/pages/{page_id}/sentence",
    description="문장 추천 데이터 저장",
    tags=['data'],
    status_code=200
)
async def create_sentence_data(
    page_id: PydanticObjectId,
    sentence_data_input: SentenceDataInput,
    user=Depends(current_active_user),
    sentence_data_service: SentenceDataService = Depends(SentenceDataService)
):
    try:
        await sentence_data_service.create(
            sentence_data_input,
            page_id,
            user
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "문장 추천 데이터가 성공적으로 저장되었습니다."}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )