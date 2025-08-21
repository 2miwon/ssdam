from pydantic import Field, BaseModel
from datetime import datetime
import pytz


class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=lambda: datetime.now(pytz.timezone('Asia/Seoul')))
