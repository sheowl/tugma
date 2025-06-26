# crud/tag.py
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.models.tags import Tags, TagCategory
from app.schemas.tags import TagCreate, TagCategoryCreate

# Fetch all tag categories
async def get_all_categories(db: AsyncSession) -> List[TagCategory]:
    result = await db.execute(select(TagCategory))
    return list(result.scalars().all())

# Create a new category
async def create_category(db: AsyncSession, category_in: TagCategoryCreate) -> TagCategory:
    category = TagCategory(**category_in.model_dump())
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category

# Fetch all tags
async def get_all_tags(db: AsyncSession) -> List[Tags]:
    result = await db.execute(select(Tags))
    return list(result.scalars().all())

# Create a new tag
async def create_tag(db: AsyncSession, tag_in: TagCreate) -> Tags:
    tag = Tags(**tag_in.model_dump())
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return tag

# Get tags by category
async def get_tags_by_category(db: AsyncSession, category_id: int) -> List[Tags]:
    result = await db.execute(select(Tags).where(Tags.category_id == category_id))
    return list(result.scalars().all())

async def create_applicant_tag(db: AsyncSession, applicant_id: int, tag_id: int):
    """Create an applicant tag association"""
    try:
        from app.models.applicant import ApplicantTag
        from app.models.tags import Tags  # Fixed: Tags not Tag
        
        print(f"🔍 DEBUG: Creating applicant tag for applicant_id: {applicant_id}, tag_id: {tag_id}")
        
        # Check if tag exists
        tag_stmt = select(Tags).where(Tags.tag_id == tag_id)  # Fixed: Tags not Tag
        tag_result = await db.execute(tag_stmt)
        tag = tag_result.scalar_one_or_none()
        
        if not tag:
            raise ValueError(f"Tag with ID {tag_id} not found")
        
        # Check if association already exists
        existing_stmt = select(ApplicantTag).where(
            ApplicantTag.applicant_id == applicant_id,
            ApplicantTag.tag_id == tag_id
        )
        existing_result = await db.execute(existing_stmt)
        existing = existing_result.scalar_one_or_none()
        
        if existing:
            print(f"⚠️ DEBUG: Association already exists for applicant {applicant_id} and tag {tag_id}")
            return {
                "applicant_id": applicant_id,
                "tag_id": tag_id,
                "tag_name": tag.tag_name,
                "status": "already_exists"
            }
        
        # Create new association with is_tagged=True
        applicant_tag = ApplicantTag(
            applicant_id=applicant_id,
            tag_id=tag_id,
            is_tagged=True
        )
        
        db.add(applicant_tag)
        await db.commit()
        
        print(f"✅ DEBUG: Created applicant tag association")
        
        return {
            "applicant_id": applicant_id,
            "tag_id": tag_id,
            "tag_name": tag.tag_name,
            "status": "created"
        }
        
    except Exception as e:
        await db.rollback()
        print(f"❌ DEBUG: Error creating applicant tag: {e}")
        raise e

async def get_applicant_tags(db: AsyncSession, applicant_id: int) -> List[dict]:
    """Get all tags for a specific applicant with tag names"""
    try:
        from app.models.applicant import ApplicantTag
        from app.models.tags import Tags  # Fixed: Tags not Tag
        
        print(f"🔍 DEBUG: Getting tags for applicant_id: {applicant_id}")
        
        # Join ApplicantTag with Tags to get tag names
        stmt = select(ApplicantTag, Tags).join(
            Tags, ApplicantTag.tag_id == Tags.tag_id  # Fixed: Tags not Tag
        ).where(
            ApplicantTag.applicant_id == applicant_id,
            ApplicantTag.is_tagged == True
        )
        
        result = await db.execute(stmt)
        rows = result.all()
        
        tags = [
            {
                "applicant_id": row.ApplicantTag.applicant_id,
                "tag_id": row.ApplicantTag.tag_id,
                "tag_name": row.Tags.tag_name,  # Fixed: Tags not Tag
                "is_tagged": row.ApplicantTag.is_tagged
            }
            for row in rows
        ]
        
        print(f"✅ DEBUG: Found {len(tags)} tags for applicant {applicant_id}")
        return tags
        
    except Exception as e:
        print(f"❌ Error getting applicant tags: {e}")
        return []

async def remove_applicant_tag(db: AsyncSession, applicant_id: int, tag_id: int) -> bool:
    """Remove an applicant tag association"""
    try:
        from app.models.applicant import ApplicantTag  # Fixed: applicant not applicants
        
        print(f"🔍 DEBUG: Removing tag {tag_id} from applicant {applicant_id}")
        
        # Delete the association
        stmt = delete(ApplicantTag).where(
            ApplicantTag.applicant_id == applicant_id,
            ApplicantTag.tag_id == tag_id
        )
        
        result = await db.execute(stmt)
        await db.commit()
        
        success = result.rowcount > 0
        print(f"✅ DEBUG: Removed applicant tag, success: {success}")
        return success
        
    except Exception as e:
        await db.rollback()
        print(f"❌ Error removing applicant tag: {e}")
        return False

async def update_applicant_tags(db: AsyncSession, applicant_id: int, tag_ids: List[int]) -> List[dict]:
    """Update applicant tags by replacing all existing tags with new ones"""
    try:
        from app.models.applicant import ApplicantTag
        from app.models.tags import Tags  # Fixed: Tags not Tag
        
        print(f"🔍 DEBUG: Updating tags for applicant {applicant_id} with {len(tag_ids)} tags")
        
        # Remove all existing tags for this applicant
        delete_stmt = delete(ApplicantTag).where(ApplicantTag.applicant_id == applicant_id)
        delete_result = await db.execute(delete_stmt)
        deleted_count = delete_result.rowcount
        
        print(f"🔍 DEBUG: Removed {deleted_count} existing tags")
        
        # Add new tags
        new_tags = []
        for tag_id in tag_ids:
            # Verify tag exists
            tag_stmt = select(Tags).where(Tags.tag_id == tag_id)  # Fixed: Tags not Tag
            tag_result = await db.execute(tag_stmt)
            tag = tag_result.scalar_one_or_none()
            
            if not tag:
                await db.rollback()
                raise ValueError(f"Tag with ID {tag_id} not found")
            
            # Create association with is_tagged=True
            applicant_tag = ApplicantTag(
                applicant_id=applicant_id,
                tag_id=tag_id,
                is_tagged=True
            )
            db.add(applicant_tag)
            
            new_tags.append({
                "applicant_id": applicant_id,
                "tag_id": tag_id,
                "tag_name": tag.tag_name,
                "is_tagged": True
            })
        
        await db.commit()
        
        print(f"✅ DEBUG: Updated applicant tags, added {len(new_tags)} new tags")
        return new_tags
        
    except Exception as e:
        await db.rollback()
        print(f"❌ Error updating applicant tags: {e}")
        raise e

async def clear_all_applicant_tags(db: AsyncSession, applicant_id: int) -> int:
    """Remove all tags from an applicant"""
    try:
        from app.models.applicant import ApplicantTag  # Fixed: applicant not applicants
        
        print(f"🔍 DEBUG: Clearing all tags for applicant {applicant_id}")
        
        # Delete all associations for this applicant
        stmt = delete(ApplicantTag).where(ApplicantTag.applicant_id == applicant_id)
        result = await db.execute(stmt)
        await db.commit()
        
        deleted_count = result.rowcount
        print(f"✅ DEBUG: Cleared {deleted_count} tags for applicant {applicant_id}")
        return deleted_count
        
    except Exception as e:
        await db.rollback()
        print(f"❌ Error clearing applicant tags: {e}")
        return 0

# Function for job matching (returns only tag IDs)
async def get_applicant_tag_ids(db: AsyncSession, applicant_id: int) -> List[int]:
    """Get just the tag IDs for an applicant (for jobs endpoint)"""
    try:
        from app.models.applicant import ApplicantTag  # Fixed: applicant not applicants
        
        # Only get tags that are marked as tagged
        stmt = select(ApplicantTag.tag_id).where(
            ApplicantTag.applicant_id == applicant_id,
            ApplicantTag.is_tagged == True
        )
        result = await db.execute(stmt)
        tag_ids = result.scalars().all()
        
        return list(tag_ids)
        
    except Exception as e:
        print(f"❌ Error getting applicant tag IDs: {e}")
        return []

