# app/api/v1/endpoints/tag.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.tags import TagCreate, TagOut, TagCategoryCreate, TagCategoryOut, TagIdsRequest
from app.core.database import get_db
from app.crud import tags as crud
from app.middleware.auth import get_current_applicant

router = APIRouter(prefix="/tags", tags=["tags"])

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

# === TAG CATEGORY ROUTES ===

@router.get("/categories", response_model=List[TagCategoryOut])
async def get_all_categories(db: AsyncSession = Depends(get_db)):
    return await crud.get_all_categories(db)

@router.post("/categories", response_model=TagCategoryOut)
async def create_category(category: TagCategoryCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_category(db, category)


# me routes for authenticated applicants
@router.put("/applicant/me")
async def update_my_tags(
    tag_ids: TagIdsRequest,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    """Replace all tags for the current authenticated applicant"""
    db_applicant = applicant_info["db_user"]
    try:
        result = await crud.update_applicant_tags(db, db_applicant.applicant_id, tag_ids.tag_ids)
        print(f"✅ Tags updated successfully: {result}")
        return {"message": "Tags updated successfully"}
    except Exception as e:
        print(f"❌ Error in update_my_tags: {e}")
        print(f"❌ Error type: {type(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/applicant/me/add-tags")  # New endpoint for adding tags
async def add_applicant_tags(
    tag_ids: TagIdsRequest,
    db: AsyncSession = Depends(get_db),
    applicant_info = Depends(get_current_applicant)
):
    """Add tags to existing applicant tags (doesn't replace)"""
    db_applicant = applicant_info["db_user"]
    try:
        # Get existing tags
        existing_tags = await crud.get_applicant_tags(db, db_applicant.applicant_id)
        
        # FIXED: Handle both dict and object formats
        existing_tag_ids = []
        for tag in existing_tags:
            if isinstance(tag, dict):
                existing_tag_ids.append(tag.get('tag_id'))
            else:
                existing_tag_ids.append(tag.tag_id)
        
        # Remove None values
        existing_tag_ids = [tag_id for tag_id in existing_tag_ids if tag_id is not None]
        
        print(f"🔍 DEBUG: Existing tag IDs: {existing_tag_ids}")
        print(f"🔍 DEBUG: New tag IDs: {tag_ids.tag_ids}")
        
        # Combine with new tags (remove duplicates)
        all_tag_ids = list(set(existing_tag_ids + tag_ids.tag_ids))
        
        print(f"🔍 DEBUG: Combined tag IDs: {all_tag_ids}")
        
        # Update with combined tags
        result = await crud.update_applicant_tags(db, db_applicant.applicant_id, all_tag_ids)
        return {"message": "Tags added successfully", "total_tags": len(all_tag_ids)}
    except Exception as e:
        print(f"❌ Error in add_applicant_tags: {e}")
        raise HTTPException(status_code=400, detail=str(e))

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
@router.get("/test-all-hashes")
async def test_all_tag_hashes(db: AsyncSession = Depends(get_db)):
    """Test that ALL tags from database are properly hashed"""
    try:
        # Get ALL tags from database
        all_tags_from_db = await crud.get_all_tags(db)
        
        # Get the hash table
        tag_hash_table = await get_tag_hash_table(db)
        
        results = {
            "total_tags_in_db": len(all_tags_from_db),
            "total_tags_in_hash_table": len(tag_hash_table),
            "all_tags_hashed": True,
            "missing_tags": [],
            "sample_hashes": []
        }
        
        # Check if every tag from DB is in the hash table
        for tag_obj in all_tags_from_db:
            tag_name = tag_obj.tag_name
            hash_value = tag_hash_table.get_hash(tag_name)
            
            if hash_value is None:
                results["all_tags_hashed"] = False
                results["missing_tags"].append(tag_name)
            else:
                # Add first 10 to sample
                if len(results["sample_hashes"]) < 10:
                    results["sample_hashes"].append({
                        "tag": tag_name,
                        "hash": hash_value,
                        "reverse_lookup_works": tag_hash_table.get_tag(hash_value) == tag_name
                    })
        
        return results
        
    except Exception as e:
        return {"error": str(e)}

@router.get("/debug-hash-table-contents")
async def debug_hash_table_contents(db: AsyncSession = Depends(get_db)):
    """Show the actual contents of the hash table"""
    try:
        tag_hash_table = await get_tag_hash_table(db)
        
        return {
            "hash_table_size": len(tag_hash_table),
            "tag_to_hash_mapping": tag_hash_table.tag_to_hash,
            "hash_to_tag_mapping": tag_hash_table.hash_to_tag
        }
        
    except Exception as e:
        return {"error": str(e)}

# Add to your tags.py endpoints for testing
@router.get("/test-formula")
async def test_match_formula(db: AsyncSession = Depends(get_db)):
    """Test the match score formula with sample data"""
    try:
        # Sample data
        applicant_tags = ["Python", "React", "SQL", "JavaScript"]  # A
        job_tags = ["Python", "React", "Node.js"]                  # J
        
        # Calculate intersection manually
        intersection = len(set(applicant_tags) & set(job_tags))  # |A ∩ J| = 2
        
        # Apply formula: (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%
        manual_score = (intersection / len(job_tags)) * 70 + (intersection / len(applicant_tags)) * 30
        
        # Use TagMatcher
        matcher = TagMatcher(applicant_tags, job_tags)
        calculated_score = matcher.calculate_score()
        
        return {
            "applicant_tags": applicant_tags,
            "job_tags": job_tags,
            "intersection": list(set(applicant_tags) & set(job_tags)),
            "intersection_count": intersection,
            "manual_calculation": round(manual_score),
            "tagmatcher_result": calculated_score,
            "formula": "Match Score = (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%",
            "explanation": {
                "job_coverage": f"({intersection} / {len(job_tags)}) * 70% = {round((intersection / len(job_tags)) * 70, 2)}%",
                "applicant_relevance": f"({intersection} / {len(applicant_tags)}) * 30% = {round((intersection / len(applicant_tags)) * 30, 2)}%",
                "total": f"{round(manual_score)}%"  # Changed to round to whole number
            }
        }
        
    except Exception as e:
        return {"error": str(e)}


