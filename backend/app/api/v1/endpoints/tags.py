# app/api/v1/endpoints/tag.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.schemas.tags import TagCreate, TagOut, TagCategoryCreate, TagCategoryOut
from app.core.database import get_db
from app.crud import tags as crud
from app.services.tag_hash_table import get_tag_hash_table
from app.algorithms.hashing import TagMatcher

router = APIRouter(prefix="/tags", tags=["tags"])

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

@router.get("/test-hash")
async def test_hash_table(db: AsyncSession = Depends(get_db)):
    """Test the tag hash table functionality"""
    try:
        print("=== Testing Tag Hash Table ===")
        
        # Test 1: Get the hash table
        tag_hash_table = await get_tag_hash_table(db)
        
        # Test 2: Test some tag lookups
        test_tags = ["Python", "JavaScript", "React", "SQL"]
        results = []
        
        for tag in test_tags:
            hash_value = tag_hash_table.get_hash(tag)
            if hash_value:
                reverse_tag = tag_hash_table.get_tag(hash_value)
                results.append({
                    "tag": tag,
                    "hash": hash_value,
                    "reverse_lookup": reverse_tag,
                    "exists": tag in tag_hash_table
                })
            else:
                results.append({
                    "tag": tag,
                    "hash": None,
                    "error": "Tag not found in database"
                })
        
        return {
            "total_tags": len(tag_hash_table),
            "test_results": results
        }
        
    except Exception as e:
        return {"error": str(e)}

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
                "total": f"{round(manual_score)}%"  # ← Changed to round to whole number
            }
        }
        
    except Exception as e:
        return {"error": str(e)}


