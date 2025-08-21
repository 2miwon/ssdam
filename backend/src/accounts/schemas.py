from pydantic import BaseModel


# Request DTO
class UpdateUserInput(BaseModel):
    onboarding_process: int
