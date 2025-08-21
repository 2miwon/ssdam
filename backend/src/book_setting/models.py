from beanie import Document
from pydantic import Field

from src.models import TimestampMixin
from src.book_setting.schemas import BookSettingInput


class BookSetting(Document, TimestampMixin):
    book_id: str = Field(default='')
    genre: str = Field(default='')
    subject: str = Field(default='')
    purpose: str = Field(default='')
    target_readers: str = Field(default='')
    target_readers_description: str = Field(default='')
    writing_style: str = Field(default='')

    @classmethod
    def of(cls, book_id: str, subject: str = '', purpose: str = ''):
        return cls(
            book_id=book_id,
            genre='',
            subject=subject,  # 따로 LLM 초안 데이터 받기
            purpose=purpose,  # 따로 LLM 초안 데이터 받기
            target_readers='',
            target_readers_description='',
            writing_style=''
        )

    def update_by_request(self, update_book_setting_input: BookSettingInput) -> "BookSetting":
        self.genre = update_book_setting_input.genre
        self.subject = update_book_setting_input.subject
        self.purpose = update_book_setting_input.purpose
        self.target_readers = update_book_setting_input.target_readers
        self.target_readers_description = update_book_setting_input.target_readers_description
        self.writing_style = update_book_setting_input.writing_style
        return self

    def update_subject_and_purpose_by_request(self, subject_and_purpose_dict: dict) -> "BookSetting":
        self.subject = subject_and_purpose_dict['subject']
        self.purpose = subject_and_purpose_dict['purpose']
        return self
