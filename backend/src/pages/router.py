from src.accounts.libs import current_active_user
from src.accounts.models import User
from src.pages.schemas import CreatePageInput, CreatePageOutput, GetPageOutput, UpdatePageInput, UpdatePageOutput, UploadImageOutput
from src.pages.service import PageService, PageImageService

from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from starlette.responses import JSONResponse
from beanie import PydanticObjectId


router = APIRouter(
    prefix="/api/books"
)


@router.post(
    "/{book_id}/pages",
    description="페이지 생성", tags=['pages'],
    status_code=200,
    response_model=CreatePageOutput
)
async def create_page(
    book_id: PydanticObjectId,
    create_page_input: CreatePageInput,
    user=Depends(current_active_user),
    page_service: PageService = Depends(PageService)
):
    try:
        return await page_service.create_page(create_page_input, book_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{book_id}/pages/{page_id}",
    description="페이지 조회", tags=['pages'],
    status_code=200,
    response_model=GetPageOutput
)
async def get_page(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    user=Depends(current_active_user),
    page_service: PageService = Depends(PageService)
):
    try:
        return await page_service.get_page_by_id(page_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{book_id}/pages/{page_id}",
    description="페이지 수정", tags=['pages'],
    status_code=200,
    response_model=UpdatePageOutput
)
async def update_page(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    update_page_input: UpdatePageInput,
    user=Depends(current_active_user),
    page_service: PageService = Depends(PageService)
):
    try:
        return await page_service.update_page(page_id, update_page_input)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{book_id}/pages/{page_id}",
    description="페이지 삭제", tags=['pages'],
    status_code=200
)
async def delete_page(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    user=Depends(current_active_user),
    page_service: PageService = Depends(PageService)
):
    try:
        await page_service.delete_page(page_id)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "페이지가 성공적으로 삭제되었습니다."})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# 페이지 내 s3 이미지 관련 router
# =============================================================================
@router.post(
    "/{book_id}/pages/{page_id}/image",
    description="파일 형식 이미지 s3 업로드",
    tags=['pages'],
    status_code=200,
    response_model=UploadImageOutput
)
async def upload_image_file(
    book_id: PydanticObjectId,
    page_id: PydanticObjectId,
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    page_image_service: PageImageService = Depends(PageImageService)
):
    try:
        return await page_image_service.upload_image_file(
            user.id,
            book_id,
            page_id,
            file
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "/{book_id}/pages/{page_id}/image",
    description="s3 이미지 key로 접근하여 파일로 반환",
    tags=['pages'],
    status_code=200
)
async def get_image_file(
    s3_image_key: str,
    user: User = Depends(current_active_user),
    page_image_service: PageImageService = Depends(PageImageService)
):
    try:
        return await page_image_service.get_image_file(
            s3_image_key
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
