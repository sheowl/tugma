# app/api/v1/endpoints/jobmatchtest.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.schemas.application import (
    JobMatchingCreate,
    JobMatchingUpdate,
    JobMatchingOut
)
from app.crud import application as crud
from app.core.database import get_db
from app.algorithms.mergesort import merge_sort  # Import the mergesort algorithm

router = APIRouter(prefix="/job-matches", tags=["job-matches"])

# Create a new job match
@router.post("/", response_model=JobMatchingOut)
async def create_job_match(
    match: JobMatchingCreate, 
    db: AsyncSession = Depends(get_db)
):
    """Create a new job match entry"""
    try:
        # Check if match already exists
        existing_match = await crud.get_job_match(db, match.applicant_id, match.job_id)
        if existing_match:
            raise HTTPException(
                status_code=400, 
                detail="Job match already exists for this applicant and job"
            )
        
        return await crud.create_job_match(db, match)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get all job matches
@router.get("/", response_model=List[JobMatchingOut])
async def get_all_job_matches(db: AsyncSession = Depends(get_db)):
    """Get all job matches"""
    return await crud.get_all_job_matches(db)

# Get all job matches sorted using merge sort algorithm
@router.get("/sorted", response_model=List[JobMatchingOut])
async def get_all_job_matches_sorted(
    sort_by: str = Query(default="match_score", description="Field to sort by (match_score, applicant_id, job_id)"),
    descending: bool = Query(default=True, description="Sort in descending order"),
    db: AsyncSession = Depends(get_db)
):
    """Get all job matches sorted using merge sort algorithm"""
    try:
        # Get all job matches from database
        job_matches = await crud.get_all_job_matches(db)
        
        if not job_matches:
            return []
        
        # Convert to list of dictionaries for sorting
        matches_data = []
        for match in job_matches:
            match_dict = {
                "applicant_id": match.applicant_id,
                "job_id": match.job_id,
                "match_score": match.match_score,
                "original_object": match 
            }
            matches_data.append(match_dict)
        
        # Call merge sort algorithm
        sorted_matches_data = merge_sort(matches_data, sort_by, descending)
        
        # Extract the original objects in sorted order
        sorted_matches = [match_data["original_object"] for match_data in sorted_matches_data]
        
        return sorted_matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sorting job matches: {str(e)}")

# Get job matches for a specific applicant
@router.get("/applicant/{applicant_id}", response_model=List[JobMatchingOut])
async def get_job_matches_by_applicant(
    applicant_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Get all job matches for a specific applicant"""
    return await crud.get_job_matches_by_applicant(db, applicant_id)

# Get job matches for a specific applicant sorted using merge sort
@router.get("/applicant/{applicant_id}/sorted", response_model=List[JobMatchingOut])
async def get_job_matches_by_applicant_sorted(
    applicant_id: int,
    sort_by: str = Query(default="match_score", description="Field to sort by (match_score, job_id)"),
    descending: bool = Query(default=True, description="Sort in descending order"),
    db: AsyncSession = Depends(get_db)
):
    """Get job matches for a specific applicant sorted using merge sort algorithm"""
    try:
        # Get job matches for the applicant
        job_matches = await crud.get_job_matches_by_applicant(db, applicant_id)
        
        if not job_matches:
            return []
        
        # Convert to list of dictionaries for sorting
        matches_data = []
        for match in job_matches:
            match_dict = {
                "applicant_id": match.applicant_id,
                "job_id": match.job_id,
                "match_score": match.match_score,
                "original_object": match
            }
            matches_data.append(match_dict)
        
        # Call merge sort algorithm
        sorted_matches_data = merge_sort(matches_data, sort_by, descending)
        
        # Extract the original objects in sorted order
        sorted_matches = [match_data["original_object"] for match_data in sorted_matches_data]
        
        return sorted_matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sorting job matches for applicant: {str(e)}")

# Get job matches for a specific job
@router.get("/job/{job_id}", response_model=List[JobMatchingOut])
async def get_job_matches_by_job(
    job_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Get all job matches for a specific job"""
    return await crud.get_job_matches_by_job(db, job_id)

# Get job matches for a specific job sorted using merge sort
@router.get("/job/{job_id}/sorted", response_model=List[JobMatchingOut])
async def get_job_matches_by_job_sorted(
    job_id: int,
    sort_by: str = Query(default="match_score", description="Field to sort by (match_score, applicant_id)"),
    descending: bool = Query(default=True, description="Sort in descending order"),
    db: AsyncSession = Depends(get_db)
):
    """Get job matches for a specific job sorted using merge sort algorithm"""
    try:
        # Get job matches for the job
        job_matches = await crud.get_job_matches_by_job(db, job_id)
        
        if not job_matches:
            return []
        
        # Convert to list of dictionaries for sorting
        matches_data = []
        for match in job_matches:
            match_dict = {
                "applicant_id": match.applicant_id,
                "job_id": match.job_id,
                "match_score": match.match_score,
                "original_object": match
            }
            matches_data.append(match_dict)
        
        # Call merge sort algorithm
        sorted_matches_data = merge_sort(matches_data, sort_by, descending)
        
        # Extract the original objects in sorted order
        sorted_matches = [match_data["original_object"] for match_data in sorted_matches_data]
        
        return sorted_matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sorting job matches for job: {str(e)}")

# Update a job match
@router.put("/{applicant_id}/{job_id}", response_model=JobMatchingOut)
async def update_job_match(
    applicant_id: int,
    job_id: int,
    updates: JobMatchingUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a job match entry"""
    updated_match = await crud.update_job_match(db, applicant_id, job_id, updates)
    if not updated_match:
        raise HTTPException(status_code=404, detail="Job match not found")
    return updated_match

# Delete a job match
@router.delete("/{applicant_id}/{job_id}", status_code=204)
async def delete_job_match(
    applicant_id: int, 
    job_id: int, 
    db: AsyncSession = Depends(get_db)
):
    """Delete a job match entry"""
    deleted = await crud.delete_job_match(db, applicant_id, job_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Job match not found")

# Create or update a job match (upsert)
@router.post("/upsert", response_model=JobMatchingOut)
async def upsert_job_match(
    applicant_id: int,
    job_id: int,
    match_score: float,
    db: AsyncSession = Depends(get_db)
):
    """Create or update a job match entry (upsert operation)"""
    try:
        return await crud.upsert_job_match(db, applicant_id, job_id, match_score)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Get top matches for an applicant
@router.get("/applicant/{applicant_id}/top", response_model=List[JobMatchingOut])
async def get_top_matches_for_applicant(
    applicant_id: int,
    limit: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get top job matches for an applicant sorted by match score"""
    return await crud.get_top_matches_for_applicant(db, applicant_id, limit)

# Get top matches for a job
@router.get("/job/{job_id}/top", response_model=List[JobMatchingOut])
async def get_top_matches_for_job(
    job_id: int,
    limit: int = Query(default=10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get top applicant matches for a job sorted by match score"""
    return await crud.get_top_matches_for_job(db, job_id, limit)

# Bulk create job matches
@router.post("/bulk", response_model=List[JobMatchingOut])
async def bulk_create_job_matches(
    matches: List[JobMatchingCreate],
    db: AsyncSession = Depends(get_db)
):
    """Create multiple job matches at once"""
    try:
        created_matches = []
        for match in matches:
            # Check if match already exists
            existing_match = await crud.get_job_match(db, match.applicant_id, match.job_id)
            if not existing_match:
                created_match = await crud.create_job_match(db, match)
                created_matches.append(created_match)
        
        return created_matches
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))