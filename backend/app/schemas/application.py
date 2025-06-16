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

class JobApplicationUpdate(JobApplicationBase):
    pass

class JobApplicationOut(JobApplicationBase):
    applicant_id: int
    job_id: int

    model_config = {"from_attributes": True}

class JobMatchingBase(BaseModel):
    match_score: float

class JobMatchingCreate(JobMatchingBase):
    applicant_id: int
    job_id: int

class JobMatchingOut(JobMatchingBase):
    applicant_id: int
    job_id: int

    model_config = {"from_attributes": True}

