from pydantic import BaseModel


class BookSettingInput(BaseModel):
    genre: str
    subject: str
    purpose: str
    target_readers: str
    target_readers_description: str
    writing_style: str


class BookSettingOutput(BaseModel):
    book_id: str
    genre: str
    subject: str
    purpose: str
    target_readers: str
    target_readers_description: str
    writing_style: str

    @classmethod
    def of(cls, book_setting: "BookSetting") -> "BookSettingOutput":
        return cls(
            book_id=book_setting.book_id,
            genre=book_setting.genre,
            subject=book_setting.subject,
            purpose=book_setting.purpose,
            target_readers=book_setting.target_readers,
            target_readers_description=book_setting.target_readers_description,
            writing_style=book_setting.writing_style,
        )
