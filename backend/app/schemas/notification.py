# schemas/notification.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    recipient_applicant_id: int
    job_id: Optional[int]
    type: str
    message: Optional[str]
    is_read: Optional[bool] = False
    created_at: Optional[datetime]

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    notification_id: int

    model_config = {"from_attributes": True}

