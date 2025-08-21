from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse

from src.accounts.models import User
from src.accounts.libs import current_active_user
from src.accounts.google.routes import google_oauth_router
from src.accounts.naver.routes import naver_oauth_router
from src.accounts.kakao.routes import kakao_oauth_router
from src.accounts.service import AccountsService
from src.accounts.auth.service import get_auth_service, AuthService
from src.accounts.schemas import UpdateUserInput

router = APIRouter()

routers = [
    (google_oauth_router, dict(prefix="/api/auth/google", tags=["auth"])),
    (naver_oauth_router, dict(prefix="/api/auth/naver", tags=["auth"])),
    (kakao_oauth_router, dict(prefix="/api/auth/kakao", tags=["auth"])),
]


for r, kwargs in routers:
    router.include_router(r, **kwargs)


@router.get("/api/auth/authenticated-route", tags=['auth'])
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}


@router.post("/api/auth/token/reissue", tags=['auth'])
async def refresh_access_token(request: Request, auth_service: AuthService = Depends(get_auth_service)):

    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token missing"
        )
    return await auth_service.create_new_access_token(refresh_token)


@router.post("/api/accounts/logout", tags=['accounts'])
async def logout(request: Request,
                 user: User = Depends(current_active_user),
                 auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.logout(request.cookies.get("refresh_token"), user)


@router.delete("/api/accounts", tags=['accounts'])
async def cancel_account(accounts_service: AccountsService = Depends(AccountsService)):
    try:
        accounts_service = accounts_service()
        await accounts_service.delete()
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Successfully Cancel account"})
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/api/accounts", tags=['accounts'])
async def update_account(
        update_user_input: UpdateUserInput,
        user: User = Depends(current_active_user),
        accounts_service: AccountsService = Depends(AccountsService)):
    try:
        await accounts_service.update(user, update_user_input)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Successfully update account"})
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

