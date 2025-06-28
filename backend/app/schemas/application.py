# schemas/application.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobApplicationBase(BaseModel):
    status: Optional[str]
    remarks: Optional[str]
    created_at: Optional[datetime]

class JobApplicationCreate(JobApplicationBase):
    applicant_id: int
    job_id: int
    status: str
    remarks: Optional[str] = None

class JobApplicationUpdate(BaseModel):
    status: Optional[str] = None
    remarks: Optional[str] = None
    # Don't include created_at - it should never be updated

class JobApplicationOut(JobApplicationBase):
    applicant_id: int
    job_id: int

    model_config = {"from_attributes": True}

class JobMatchingBase(BaseModel):
    match_score: float

class JobMatchingCreate(JobMatchingBase):
    applicant_id: int
    job_id: int

class JobMatchingUpdate(BaseModel):
    match_score: Optional[float] = None

class JobMatchingOut(JobMatchingBase):
    applicant_id: int
    job_id: int

    model_config = {"from_attributes": True}

