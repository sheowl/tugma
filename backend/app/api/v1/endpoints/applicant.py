# api/v1/endpoints/applicant.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.middleware.auth import get_current_applicant
from app.schemas.applicant import (
    ApplicantCreate,
    ApplicantOut,
    ApplicantUpdate,
    ApplicantWorkExperienceCreate,
    ApplicantWorkExperienceOut,
    ApplicantCertificateCreate,
    ApplicantCertificateOut,
    ApplicantOnboardingStatus,
    ApplicantProficiencyCreate,
    ApplicantProficiencyOut,
    ApplicantCertificateCreate,
    ApplicantCertificateOut
)
from app.crud import applicant as crud
from app.crud import application as application_crud
from app.schemas.application import JobApplicationOut
from app.core.database import get_db


router = APIRouter(prefix="/applicants", tags=["applicants"])

# Create a new applicant
@router.post("/", response_model=ApplicantOut, status_code=status.HTTP_201_CREATED)
async def create_applicant(applicant: ApplicantCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_applicant(db, applicant)

# Get my profile
@router.get("/me", response_model=ApplicantOut)
async def get_my_profile(
    applicant_info = Depends(get_current_applicant)
):
    """
    Get the currently authenticated applicant's profile.
    """
    return applicant_info["db_user"]

# Update my profile
@router.put("/me", response_model=ApplicantOut)
async def update_my_profile(
    update_data: ApplicantUpdate,  
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    updated_applicant = await crud.update_applicant(db, db_applicant, update_data)
    return updated_applicant

@router.post("/me/certificates", response_model=ApplicantCertificateOut)
async def add_certificate_to_me(
    certificate: ApplicantCertificateCreate,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    new_cert = await crud.add_certificate(
        db, applicant_id=db_applicant.applicant_id, certificate=certificate
    )
    return new_cert

@router.post("/me/proficiency", response_model=ApplicantProficiencyOut)
async def add_proficiency_to_me(
    proficiency: ApplicantProficiencyCreate,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    new_prof = await crud.create_proficiency(
        db, applicant_id=db_applicant.applicant_id, proficiency=proficiency
    )
    return new_prof

@router.put("/me/proficiency", response_model=ApplicantProficiencyOut)
async def update_my_proficiency(
    proficiency: ApplicantProficiencyCreate,  # expects category_id and proficiency
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    updated_prof = await crud.update_proficiency(
        db,
        applicant_id=db_applicant.applicant_id,
        category_id=proficiency.category_id,
        new_proficiency=proficiency.proficiency
    )
    if not updated_prof:
        raise HTTPException(status_code=404, detail="Proficiency record not found")
    return updated_prof

@router.get("/me/proficiency", response_model=List[ApplicantProficiencyOut])
async def get_my_proficiency(
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    return await crud.get_applicant_proficiency(db, db_applicant.applicant_id)

@router.post("/me/experience", response_model=ApplicantWorkExperienceOut)
async def add_experience_to_me(
    experience: ApplicantWorkExperienceCreate,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    db_applicant = applicant_info["db_user"]
    new_exp = await crud.add_work_experience(
        db, applicant_id=db_applicant.applicant_id, experience=experience
    )
    return new_exp

# Get all work experiences of an applicant
@router.get("/me/experience", response_model=List[ApplicantWorkExperienceOut])
async def get_experience(db: AsyncSession = Depends(get_db), applicant_info = Depends(get_current_applicant)):
    db_applicant = applicant_info["db_user"]
    return await crud.get_applicant_experience(db, db_applicant.applicant_id)

# Get my job applications
@router.get("/my-applications")
async def get_my_applications(
    applicant_info = Depends(get_current_applicant),
    db: AsyncSession = Depends(get_db)
):
    applicant = applicant_info["db_user"]
    return await application_crud.get_applications_by_applicant(db, applicant.applicant_id)

# Get onboarding status
@router.get("/onboarding-status", response_model=ApplicantOnboardingStatus)
async def get_applicant_onboarding_status(
    applicant_info = Depends(get_current_applicant)
):
    print("Onboarding Called.")
    applicant = applicant_info["db_user"]
    needs_onboarding = not all([
        applicant.current_address,
        applicant.university,
        applicant.degree,
        applicant.year_graduated,
        applicant.field,
        applicant.preferred_worksetting,
        applicant.preferred_worktype,
    ])
    return {
        "needs_onboarding": needs_onboarding,
        "completed_fields": {
            "current_address": bool(applicant.current_address),
            "university": bool(applicant.university),
            "degree": bool(applicant.degree),
            "year_graduated": bool(applicant.year_graduated),
            "field": bool(applicant.field),
            "preferred_worksetting": bool(applicant.preferred_worksetting),
            "preferred_worktype": bool(applicant.preferred_worktype)
        }
    }

@router.post("/onboarding-details")
async def save_onboarding_details(
    applicant_update: ApplicantUpdate,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    applicant = applicant_info["db_user"]
    print("Saving onboarding details for:", applicant.applicant_id)
    updated_applicant = await crud.update_applicant(db, applicant, applicant_update)
    return updated_applicant

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


# --- Proficiency Endpoints ---

# get proficiency
@router.get("/{applicant_id}/proficiency", response_model=List[ApplicantProficiencyOut])
async def get_applicant_proficiency(applicant_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_applicant_proficiency(db, applicant_id)

