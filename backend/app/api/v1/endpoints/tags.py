# app/api/v1/endpoints/tag.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.tags import TagCreate, TagOut, TagCategoryCreate, TagCategoryOut
from app.core.database import get_db
from app.crud import tags as crud

router = APIRouter()

# === TAG CATEGORY ROUTES ===

@router.get("/categories", response_model=List[TagCategoryOut])
async def get_all_categories(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_categories(db)

@router.post("/categories", response_model=TagCategoryOut)
async def create_category(category: TagCategoryCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_category(db, category)

# === TAG ROUTES ===

@router.get("/", response_model=List[TagOut])
async def get_all_tags(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_tags(db)

@router.post("/", response_model=TagOut)
async def create_tag(tag: TagCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_tag(db, tag)

@router.get("/category/{category_id}", response_model=List[TagOut])
async def get_tags_by_category(category_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.get_tags_by_category(db, category_id)

# === APPLICANT TAG ROUTES (NO AUTHENTICATION FOR TESTING) ===

@router.post("/applicant/{applicant_id}/tags")
async def create_applicant_tag(
    applicant_id: int,
    tag_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Create a single applicant tag association (no auth for testing)"""
    try:
        return await crud.create_applicant_tag(db, applicant_id, tag_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/applicant/{applicant_id}/tags/bulk")
async def create_applicant_tags_bulk(
    applicant_id: int,
    tag_ids: List[int],
    db: AsyncSession = Depends(get_db)
):
    """Create multiple applicant tag associations (no auth for testing)"""
    try:
        results = []
        for tag_id in tag_ids:
            try:
                result = await crud.create_applicant_tag(db, applicant_id, tag_id)
                results.append(result)
            except Exception as e:
                # Continue with other tags even if one fails
                results.append({
                    "applicant_id": applicant_id,
                    "tag_id": tag_id,
                    "error": str(e)
                })
        
        return {
            "applicant_id": applicant_id,
            "total_requested": len(tag_ids),
            "results": results,
            "successful": len([r for r in results if "error" not in r])
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/applicant/{applicant_id}/tags")
async def get_applicant_tags(
    applicant_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all tags for a specific applicant (no auth for testing)"""
    try:
        return await crud.get_applicant_tags(db, applicant_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/applicant/{applicant_id}/tags/{tag_id}")
async def remove_applicant_tag(
    applicant_id: int,
    tag_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Remove a tag from an applicant (no auth for testing)"""
    try:
        success = await crud.remove_applicant_tag(db, applicant_id, tag_id)
        if not success:
            raise HTTPException(status_code=404, detail="Applicant tag association not found")
        return {"message": "Tag removed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/applicant/{applicant_id}/tags")
async def update_applicant_tags(
    applicant_id: int,
    tag_ids: List[int],
    db: AsyncSession = Depends(get_db)
):
    """Replace all tags for an applicant with new ones (no auth for testing)"""
    try:
        return await crud.update_applicant_tags(db, applicant_id, tag_ids)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/applicant/{applicant_id}/tags")
async def clear_all_applicant_tags(
    applicant_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Remove all tags from an applicant (no auth for testing)"""
    try:
        success = await crud.clear_all_applicant_tags(db, applicant_id)
        return {
            "message": f"Cleared all tags for applicant {applicant_id}",
            "tags_removed": success
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


