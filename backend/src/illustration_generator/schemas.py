from pydantic import BaseModel


class IllustrationInput(BaseModel):
    user_prompt: str
    excerpt: str
    title: str
    genre: str


class IllustrationOutput(BaseModel):
    s3_image_key: str
