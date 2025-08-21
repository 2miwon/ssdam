from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from starlette.responses import JSONResponse
from beanie import PydanticObjectId

from src.accounts.libs import current_active_user
from src.accounts.models import User
from src.book_setting.schemas import BookSettingInput, BookSettingOutput
from src.book_setting.service import BookSettingService
from src.data_hub.repository import ChapterDataRepository


router = APIRouter(
    prefix="/api/book-setting/books"
)


@router.post(
    "/{book_id}",
    description="북 세팅 생성",
    tags=['book-setting'],
    status_code=200,
    response_model=BookSettingOutput
)
async def create_book_setting(
    book_id: PydanticObjectId,
    user=Depends(current_active_user),
    book_setting_service: BookSettingService = Depends(BookSettingService)
):
    try:
        return await book_setting_service.create(book_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{book_id}",
    description="북 세팅 조회",
    tags=['book-setting'],
    status_code=200,
    response_model=BookSettingOutput
)
async def get_book_setting(
    book_id: PydanticObjectId,
    user=Depends(current_active_user),
    book_setting_service: BookSettingService = Depends(BookSettingService)
):
    try:
        return await book_setting_service.get_by_book_id(book_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{book_id}",
    description="북 세팅 수정",
    tags=['book-setting'],
    status_code=200,
    response_model=BookSettingOutput
)
async def update_book_setting(
    book_id: PydanticObjectId,
    update_book_setting_input: BookSettingInput,
    user=Depends(current_active_user),
    book_setting_service: BookSettingService = Depends(BookSettingService)
):
    try:
        return await book_setting_service.update(book_id, update_book_setting_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{book_id}/book-info",
    description="chapter QA 데이터 기반 북 세팅 수정",
    tags=['book-setting'],
    status_code=200,
    response_model=BookSettingOutput
)
async def update_book_setting_from_chapter_data(
    book_id: PydanticObjectId,
    user=Depends(current_active_user),
    book_setting_service: BookSettingService = Depends(BookSettingService),
    chapter_data_repository: ChapterDataRepository = Depends(ChapterDataRepository)
):
    try:
        return await book_setting_service.update_from_chapter_data(book_id, chapter_data_repository)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{book_id}",
    description="북 세팅 삭제",
    tags=['book-setting'],
    status_code=200
)
async def delete_book_setting(
    book_id: PydanticObjectId,
    user=Depends(current_active_user),
    book_setting_service: BookSettingService = Depends(BookSettingService)
):
    try:
        await book_setting_service.delete(book_id)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "book_setting이 성공적으로 삭제되었습니다."})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
