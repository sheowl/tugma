from app.algorithms.hashing import TagHashTable
from app.crud import tags as crud

_tag_hash_table = None

async def get_tag_hash_table(db):
    global _tag_hash_table
    if _tag_hash_table is None:
        tags_from_db = [tag.tag_name for tag in await crud.get_all_tags(db)]
        _tag_hash_table = TagHashTable(tags_from_db)
    return _tag_hash_table

# Optionally, add a function to refresh the cache if tags change
async def refresh_tag_hash_table(db):
    global _tag_hash_table
    tags_from_db = [tag.tag_name for tag in await crud.get_all_tags(db)]
    _tag_hash_table = TagHashTable(tags_from_db)
    return _tag_hash_table