# hashing algorithm for the backend

#FNV-1a Hashing Algorithm Implementation
def fnv1a_hash(data: str) -> int:
    offset_basis = 0x811c9dc5
    fnv_prime = 0x01000193
    hash_value = offset_basis

    for char in data:
        hash_value ^= ord(char)
        hash_value *= fnv_prime
        hash_value &= 0xffffffff  # keep 32-bit
    return hash_value

# Hash Table with Separate Chaining (Linked List Implementation)
class Node:
    def __init__(self, info):
        self.info = info
        self.link = None

class HashTable:
    def __init__(self, size=101):
        self.size = size
        self.buckets = [None] * size

    def _hash(self, key: str) -> int:
        return fnv1a_hash(key) % self.size

    def insert(self, key: str):
        index = self._hash(key)
        new_node = Node(key)
        new_node.link = self.buckets[index]
        self.buckets[index] = new_node

    def contains(self, key: str) -> bool:
        index = self._hash(key)
        current = self.buckets[index]
        while current:
            if current.info == key:
                return True
            current = current.link
        return False

# TagMatcher Class for Matching Applicant Tags with Job Tags
class TagMatcher:
    def __init__(self, applicant_tags, job_tags):
        self.applicant_tags = applicant_tags  # A
        self.job_tags = job_tags              # J

        # Build hash table for fast O(1) lookups
        self.job_table = HashTable()
        for tag in job_tags:
            self.job_table.insert(tag)

    def calculate_score(self):
        # Handle edge cases
        if not self.job_tags or not self.applicant_tags:
            return 0.0

        # Calculate intersection |A ∩ J|
        intersection = 0
        for tag in self.applicant_tags:
            if self.job_table.contains(tag):  # O(1) lookup using hash table
                intersection += 1

        # Apply the weighted formula
        # Match Score = (|A ∩ J| / |J|) * 70% + (|A ∩ J| / |A|) * 30%
        score = (
            (intersection / len(self.job_tags)) * 70 +
            (intersection / len(self.applicant_tags)) * 30
        )
        
        return round(score)

# TagHashTable for O(1) tag hash lookup
class TagHashTable:
    def __init__(self, tags: list[str]):
        # Map tag name to its FNV-1a hash
        self.tag_to_hash = {tag: fnv1a_hash(tag) for tag in tags}
        # Optionally, map hash to tag name for reverse lookup
        self.hash_to_tag = {v: k for k, v in self.tag_to_hash.items()}

    def get_hash(self, tag: str) -> int | None:
        """Get the FNV-1a hash for a tag name"""
        return self.tag_to_hash.get(tag)

    def get_tag(self, hash_value: int) -> str | None:
        """Get the tag name from its hash (reverse lookup)"""
        return self.hash_to_tag.get(hash_value)

    def __contains__(self, tag: str) -> bool:
        """Check if a tag exists in the hash table"""
        return tag in self.tag_to_hash

    def __len__(self) -> int:
        """Get the number of tags in the hash table"""
        return len(self.tag_to_hash)

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
