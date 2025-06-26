# schemas/interview.py
from pydantic import BaseModel
from datetime import date, time
from typing import Optional
from app.models.enums import InterviewTypeEnum, InterviewStatusEnum

class InterviewDetailsBase(BaseModel):
    interview_type: InterviewTypeEnum
    interview_date: date
    interview_time: time
    remarks: Optional[str]
    interview_status: InterviewStatusEnum

class InterviewDetailsCreate(InterviewDetailsBase):
    applicant_id: int
    job_id: int

class InterviewDetailsUpdate(BaseModel):
    interview_type: Optional[InterviewTypeEnum]
    interview_date: Optional[date]
    interview_time: Optional[time]
    remarks: Optional[str]
    interview_status: Optional[InterviewStatusEnum]

class InterviewDetailsOut(InterviewDetailsBase):
    applicant_id: int
    job_id: int

    model_config = {"from_attributes": True}

