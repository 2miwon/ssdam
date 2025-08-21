from fastapi import HTTPException, File, UploadFile

import hashlib
import imghdr


def hash_user_id(
    user_id: str
) -> str:
    return hashlib.sha256(str(user_id).encode()).hexdigest()[:16]


async def validate_image(
    img_file: UploadFile,
    max_file_size: int,
    allowed_image_types: dict[str, str]
) -> bool:

    # 파일 크기 확인
    img_file.file.seek(0, 2)
    file_size = img_file.file.tell()
    # 파일 포인터 복구
    img_file.file.seek(0)

    if file_size > max_file_size:
        raise HTTPException(status_code=400, detail="File size exceeds the limit")

    content = await img_file.read(1024)  # async method in fastapi
    img_file.file.seek(0)

    image_type = imghdr.what(None, content)
    if image_type not in allowed_image_types:
        raise HTTPException(status_code=400, detail="Image type is not allowed")

    return True
