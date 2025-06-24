# api/v1/endpoints/applicant.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.applicant import (
    ApplicantCreate,
    ApplicantOut,
    ApplicantUpdate,
    ApplicantWorkExperienceCreate,
    ApplicantWorkExperienceOut,
    ApplicantCertificateCreate,
    ApplicantCertificateOut,
)
from app.crud import applicant as crud
from app.core.database import get_db

router = APIRouter(prefix="/applicants", tags=["applicants"])

# Create a new applicant
@router.post("/", response_model=ApplicantOut, status_code=status.HTTP_201_CREATED)
async def create_applicant(applicant: ApplicantCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_applicant(db, applicant)

# Get applicant by ID
@router.get("/{applicant_id}", response_model=ApplicantOut)
async def get_applicant(applicant_id: int, db: AsyncSession = Depends(get_db)):
    db_applicant = await crud.get_applicant_by_id(db, applicant_id)
    if not db_applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return db_applicant

# Update applicant
@router.put("/{applicant_id}", response_model=ApplicantOut)
async def update_applicant(applicant_id: int, applicant: ApplicantUpdate, db: AsyncSession = Depends(get_db)):
    db_applicant = await crud.get_applicant_by_id(db, applicant_id)
    if not db_applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return await crud.update_applicant(db, db_applicant, applicant)

# Delete applicant
@router.delete("/{applicant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_applicant(applicant_id: int, db: AsyncSession = Depends(get_db)):
    await crud.delete_applicant(db, applicant_id)

# Get all applicants
@router.get("/", response_model=List[ApplicantOut])
async def get_all_applicants(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_applicants(db)

# --- Work Experience Endpoints ---

# Add work experience
@router.post("/{applicant_id}/experience", response_model=ApplicantWorkExperienceOut)
async def add_experience(applicant_id: int, experience: ApplicantWorkExperienceCreate, db: AsyncSession = Depends(get_db)):
    return await crud.add_work_experience(db, applicant_id, experience)

# Get all work experiences of an applicant
@router.get("/{applicant_id}/experience", response_model=List[ApplicantWorkExperienceOut])
async def get_experience(applicant_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_applicant_experience(db, applicant_id)

# --- Certificates Endpoints ---

# Add certificate
@router.post("/{applicant_id}/certificates", response_model=ApplicantCertificateOut)
async def add_certificate(applicant_id: int, certificate: ApplicantCertificateCreate, db: AsyncSession = Depends(get_db)):
    return await crud.add_certificate(db, applicant_id, certificate)

# Get certificates
@router.get("/{applicant_id}/certificates", response_model=List[ApplicantCertificateOut])
async def get_certificates(applicant_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_applicant_certificates(db, applicant_id)

