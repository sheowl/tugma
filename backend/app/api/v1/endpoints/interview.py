# app/api/v1/endpoints/interview.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.interview import InterviewDetailsCreate, InterviewDetailsUpdate, InterviewDetailsOut
from app.crud import interview as crud
from app.core.database import get_db

router = APIRouter(prefix="/interviews", tags=["Interviews"])

# Create interview
@router.post("/", response_model=InterviewDetailsOut)
async def create_interview(interview: InterviewDetailsCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_interview(db, interview)

# Get specific interview by applicant + job ID
@router.get("/{applicant_id}/{job_id}", response_model=InterviewDetailsOut)
async def get_interview(applicant_id: int, job_id: int, db: AsyncSession = Depends(get_db)):
    interview = await crud.get_interview(db, applicant_id, job_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")
    return interview

# Get all interviews
@router.get("/", response_model=List[InterviewDetailsOut])
async def get_all_interviews(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_interviews(db)

# Update interview
@router.put("/{applicant_id}/{job_id}", response_model=InterviewDetailsOut)
async def update_interview(
    applicant_id: int,
    job_id: int,
    updates: InterviewDetailsUpdate,
    db: AsyncSession = Depends(get_db)
):
    updated = await crud.update_interview(db, applicant_id, job_id, updates)
    if not updated:
        raise HTTPException(status_code=404, detail="Interview not found")
    return updated

# Delete interview
@router.delete("/{applicant_id}/{job_id}", status_code=204)
async def delete_interview(applicant_id: int, job_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await crud.delete_interview(db, applicant_id, job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Interview not found")

