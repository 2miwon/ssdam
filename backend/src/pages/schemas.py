from beanie import PydanticObjectId
from pydantic import BaseModel


# Request DTO
class CreatePageInput(BaseModel):
    title: str

    @classmethod
    def of(cls, title: str) -> "CreatePageInput":
        return cls(
            title=title,
        )


class CreatePageOutput(BaseModel):
    page_id: PydanticObjectId


class GetPageOutput(BaseModel):
    page_id: PydanticObjectId
    title: str
    content: str

    @classmethod
    def of(cls, page: "Page") -> "GetPageOutput":
        return cls(
            page_id=page.id,
            title=page.title,
            content=page.content
        )


class UpdatePageInput(BaseModel):
    title: str
    content: str


class UpdatePageOutput(BaseModel):
    page_id: PydanticObjectId


# =============================================================================
# 페이지 내 s3 이미지 관련 DTO
# =============================================================================
class UploadImageOutput(BaseModel):
    s3_image_key: str
