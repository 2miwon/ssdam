from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel


class RevisionDetail(BaseModel):
    time: datetime


class RevisionDay(BaseModel):
    date: date
    count: int
    details: List[RevisionDetail]
