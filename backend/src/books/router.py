from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from starlette.responses import JSONResponse
from src.accounts.libs import current_active_user
from src.accounts.models import User
from src.books.service import BookService, BookCoverService
from src.books.schemas import CreateBookOutput, GetBookListOutput, UpdateBookInput, CreateBookInput, CreateBookStructureInput
from beanie import PydanticObjectId

router = APIRouter(
    prefix="/api/books"
)


@router.post(
    "",
    tags=['books'],
    status_code=200,
    response_model=CreateBookOutput
)
async def create_book(
    create_book_input: CreateBookInput,
    user: User = Depends(current_active_user),
    book_service: BookService = Depends(BookService)
):
    try:
        return await book_service.create_book(create_book_input, user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get(
    "",
    tags=['books'],
    status_code=200,
    response_model=GetBookListOutput
)
async def get_book_list(
    user: User = Depends(current_active_user),
    book_service: BookService = Depends(BookService)
):
    try:
        return await book_service.get_book_list(user=user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/{book_id}/structure",
    tags=['books']
)
async def get_book_by_id(
        book_id: str,
        create_book_structure_input: CreateBookStructureInput,
        user: User = Depends(current_active_user),
        book_service: BookService = Depends(BookService)
):
    try:
        return await book_service.create_book_structure(
            create_book_structure_input=create_book_structure_input,
            book_id=book_id
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get(
    "/{book_id}",
    tags=['books']
)
async def get_book_by_id(
    book_id: PydanticObjectId,
    user: User = Depends(current_active_user),
    book_service: BookService = Depends(BookService)
):
    try:
        return await book_service.get_book_by_id(book_id=book_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put(
    "/{book_id}",
    tags=['books']
)
async def update_book(
    book_id: PydanticObjectId,
    update_book_input: UpdateBookInput,
    user: User = Depends(current_active_user),
    book_service: BookService = Depends(BookService)
):
    try:
        return await book_service.update_book(update_book_input, book_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post(
    "/{book_id}/cover",
    tags=['books']
)
async def update_book_cover(
    book_id: PydanticObjectId,
    file: UploadFile = File(...),
    user: User = Depends(current_active_user),
    book_cover_service: BookCoverService = Depends(BookCoverService)
):
    try:
        return await book_cover_service.update_book_cover(user.id, book_id, file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete(
    "/{book_id}",
    tags=['books']
)
async def delete_book(
    book_id: PydanticObjectId,
    user: User = Depends(current_active_user),
    book_service: BookService = Depends(BookService)
):
    try:
        await book_service.delete_book(user, book_id)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Successfully delete"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




