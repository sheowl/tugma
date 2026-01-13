# hashing algorithm for the backend

import time
import statistics
from typing import List, Dict

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

########################### TESTING PURPOSES ##############################
# ==================== ADDITIONAL HASHING ALGORITHMS ====================

def djb2_hash(data: str) -> int:
    """DJB2 Hash Algorithm"""
    hash_value = 5381
    for char in data:
        hash_value = ((hash_value << 5) + hash_value) + ord(char)
        hash_value &= 0xffffffff
    return hash_value

def sdbm_hash(data: str) -> int:
    """SDBM Hash Algorithm"""
    hash_value = 0
    for char in data:
        hash_value = ord(char) + (hash_value << 6) + (hash_value << 16) - hash_value
        hash_value &= 0xffffffff
    return hash_value

def simple_hash(data: str) -> int:
    """Simple Hash Algorithm (Poor distribution)"""
    return sum(ord(char) for char in data) % 2147483647

def polynomial_hash(data: str) -> int:
    """Polynomial Rolling Hash"""
    hash_value = 0
    p = 31
    m = 1000000007
    p_pow = 1
    
    for char in data:
        hash_value = (hash_value + (ord(char) - ord('a') + 1) * p_pow) % m
        p_pow = (p_pow * p) % m
    return hash_value

# ==================== COLLISION HANDLING CLASSES ====================

class SeparateChainingHashTable:
    """Separate Chaining with Linked Lists (Your current choice)"""
    def __init__(self, size=101, hash_func=fnv1a_hash):
        self.size = size
        self.buckets = [None] * size
        self.hash_func = hash_func
        self.collisions = 0
        self.operations = 0

    def _hash(self, key: str) -> int:
        return self.hash_func(key) % self.size

    def insert(self, key: str):
        self.operations += 1
        index = self._hash(key)
        
        # Check if bucket already has items (collision)
        if self.buckets[index] is not None:
            self.collisions += 1
            
        new_node = Node(key)
        new_node.link = self.buckets[index]
        self.buckets[index] = new_node
        return True

    def contains(self, key: str) -> bool:
        self.operations += 1
        index = self._hash(key)
        current = self.buckets[index]
        
        while current:
            if current.info == key:
                return True
            current = current.link
        return False

    def get_stats(self) -> dict:
        chain_lengths = []
        for bucket in self.buckets:
            length = 0
            current = bucket
            while current:
                length += 1
                current = current.link
            chain_lengths.append(length)
        
        return {
            "collision_rate": (self.collisions / self.operations) * 100 if self.operations > 0 else 0,
            "avg_chain_length": statistics.mean(chain_lengths),
            "max_chain_length": max(chain_lengths),
            "empty_buckets": chain_lengths.count(0),
            "load_factor": sum(chain_lengths) / self.size
        }

class LinearProbingHashTable:
    """Linear Probing (Open Addressing)"""
    def __init__(self, size=101, hash_func=fnv1a_hash):
        self.size = size
        self.buckets = [None] * size
        self.deleted = [False] * size
        self.hash_func = hash_func
        self.collisions = 0
        self.operations = 0
        self.count = 0

    def _hash(self, key: str) -> int:
        return self.hash_func(key) % self.size

    def insert(self, key: str):
        if self.count >= self.size * 0.7:  # Resize when load factor > 0.7
            return False
            
        self.operations += 1
        index = self._hash(key)
        original_index = index
        
        while self.buckets[index] is not None and not self.deleted[index]:
            if self.buckets[index] == key:
                return True  # Already exists
            self.collisions += 1
            index = (index + 1) % self.size
            if index == original_index:  # Table full
                return False
        
        self.buckets[index] = key
        self.deleted[index] = False
        self.count += 1
        return True

    def contains(self, key: str) -> bool:
        self.operations += 1
        index = self._hash(key)
        original_index = index
        
        while self.buckets[index] is not None:
            if self.buckets[index] == key and not self.deleted[index]:
                return True
            index = (index + 1) % self.size
            if index == original_index:
                break
        return False

    def get_stats(self) -> dict:
        return {
            "collision_rate": (self.collisions / self.operations) * 100 if self.operations > 0 else 0,
            "load_factor": self.count / self.size,
            "empty_buckets": self.buckets.count(None)
        }

class QuadraticProbingHashTable:
    """Quadratic Probing (Open Addressing)"""
    def __init__(self, size=101, hash_func=fnv1a_hash):
        self.size = size
        self.buckets = [None] * size
        self.deleted = [False] * size
        self.hash_func = hash_func
        self.collisions = 0
        self.operations = 0
        self.count = 0

    def _hash(self, key: str) -> int:
        return self.hash_func(key) % self.size

    def insert(self, key: str):
        if self.count >= self.size * 0.7:
            return False
            
        self.operations += 1
        index = self._hash(key)
        i = 0
        
        while i < self.size:
            probe_index = (index + i * i) % self.size
            
            if self.buckets[probe_index] is None or self.deleted[probe_index]:
                self.buckets[probe_index] = key
                self.deleted[probe_index] = False
                self.count += 1
                return True
            elif self.buckets[probe_index] == key:
                return True  # Already exists
            
            self.collisions += 1
            i += 1
        
        return False  # Table full

    def contains(self, key: str) -> bool:
        self.operations += 1
        index = self._hash(key)
        i = 0
        
        while i < self.size:
            probe_index = (index + i * i) % self.size
            
            if self.buckets[probe_index] is None:
                return False
            elif self.buckets[probe_index] == key and not self.deleted[probe_index]:
                return True
            
            i += 1
        
        return False

    def get_stats(self) -> dict:
        return {
            "collision_rate": (self.collisions / self.operations) * 100 if self.operations > 0 else 0,
            "load_factor": self.count / self.size,
            "empty_buckets": self.buckets.count(None)
        }

class DoubleHashingTable:
    """Double Hashing (Open Addressing)"""
    def __init__(self, size=101, hash_func=fnv1a_hash):
        self.size = size
        self.buckets = [None] * size
        self.deleted = [False] * size
        self.hash_func = hash_func
        self.collisions = 0
        self.operations = 0
        self.count = 0

    def _hash1(self, key: str) -> int:
        return self.hash_func(key) % self.size

    def _hash2(self, key: str) -> int:
        return 7 - (self.hash_func(key) % 7)

    def insert(self, key: str):
        if self.count >= self.size * 0.7:
            return False
            
        self.operations += 1
        index = self._hash1(key)
        step = self._hash2(key)
        i = 0
        
        while i < self.size:
            probe_index = (index + i * step) % self.size
            
            if self.buckets[probe_index] is None or self.deleted[probe_index]:
                self.buckets[probe_index] = key
                self.deleted[probe_index] = False
                self.count += 1
                return True
            elif self.buckets[probe_index] == key:
                return True
            
            self.collisions += 1
            i += 1
        
        return False

    def contains(self, key: str) -> bool:
        self.operations += 1
        index = self._hash1(key)
        step = self._hash2(key)
        i = 0
        
        while i < self.size:
            probe_index = (index + i * step) % self.size
            
            if self.buckets[probe_index] is None:
                return False
            elif self.buckets[probe_index] == key and not self.deleted[probe_index]:
                return True
            
            i += 1
        
        return False

    def get_stats(self) -> dict:
        return {
            "collision_rate": (self.collisions / self.operations) * 100 if self.operations > 0 else 0,
            "load_factor": self.count / self.size,
            "empty_buckets": self.buckets.count(None)
        }

# ==================== COMPARISON CLASS ====================

class HashingComparison:
    def __init__(self, tags: List[str]):
        self.tags = tags
        self.hash_functions = {
            "FNV-1a": fnv1a_hash,
            "DJB2": djb2_hash,
            "SDBM": sdbm_hash,
            "Simple": simple_hash,
            "Polynomial": polynomial_hash
        }
        
        self.collision_handlers = {
            "Separate Chaining": SeparateChainingHashTable,
            "Linear Probing": LinearProbingHashTable,
            "Quadratic Probing": QuadraticProbingHashTable,
            "Double Hashing": DoubleHashingTable
        }
        
        self.results = {}

    def run_comprehensive_test(self) -> Dict:
        """Run tests for all combinations of hash functions and collision handlers"""
        print("🔍 Running Comprehensive Hashing Performance Tests...")
        print(f"📊 Testing with {len(self.tags)} tags\n")
        
        for hash_name, hash_func in self.hash_functions.items():
            self.results[hash_name] = {}
            
            for handler_name, handler_class in self.collision_handlers.items():
                print(f"Testing {hash_name} + {handler_name}...")
                
                # Create hash table
                table = handler_class(size=127, hash_func=hash_func)
                
                # Measure insertion time
                start_time = time.time()
                insertion_success = 0
                
                for tag in self.tags:
                    if table.insert(tag):
                        insertion_success += 1
                
                insertion_time = time.time() - start_time
                
                # Measure lookup time
                start_time = time.time()
                lookup_success = 0
                
                for tag in self.tags:
                    if table.contains(tag):
                        lookup_success += 1
                
                lookup_time = time.time() - start_time
                
                # Get statistics
                stats = table.get_stats()
                
                self.results[hash_name][handler_name] = {
                    "insertion_time": insertion_time * 1000,  # Convert to milliseconds
                    "lookup_time": lookup_time * 1000,
                    "insertion_success_rate": (insertion_success / len(self.tags)) * 100,
                    "lookup_success_rate": (lookup_success / len(self.tags)) * 100,
                    "collision_rate": stats.get("collision_rate", 0),
                    "load_factor": stats.get("load_factor", 0),
                    "avg_chain_length": stats.get("avg_chain_length", 0),
                    "max_chain_length": stats.get("max_chain_length", 0),
                    "empty_buckets": stats.get("empty_buckets", 0)
                }
        
        return self.results

    def generate_report(self) -> str:
        """Generate a comprehensive performance report"""
        if not self.results:
            return "No test results available. Run comprehensive test first."
        
        report = []
        report.append("=" * 80)
        report.append("🏆 HASHING ALGORITHM & COLLISION HANDLING COMPARISON REPORT")
        report.append("=" * 80)
        report.append(f"Dataset: {len(self.tags)} unique tags")
        report.append("")
        
        # Performance Summary
        report.append("📊 PERFORMANCE SUMMARY (Lower is Better)")
        report.append("-" * 80)
        report.append(f"{'Algorithm + Handler':<25} {'Insert(ms)':<12} {'Lookup(ms)':<12} {'Collisions%':<12}")
        report.append("-" * 80)
        
        performance_scores = []
        
        for hash_name, handlers in self.results.items():
            for handler_name, stats in handlers.items():
                combo_name = f"{hash_name} + {handler_name}"
                if len(combo_name) > 24:
                    combo_name = combo_name[:21] + "..."
                
                insert_time = stats["insertion_time"]
                lookup_time = stats["lookup_time"]
                collision_rate = stats["collision_rate"]
                
                # Performance score (lower is better)
                performance_score = (insert_time * 0.3 + lookup_time * 0.4 + collision_rate * 0.3)
                performance_scores.append((combo_name, performance_score, stats))
                
                report.append(f"{combo_name:<25} {insert_time:<12.2f} {lookup_time:<12.2f} {collision_rate:<12.1f}")
        
        # Sort by performance score
        performance_scores.sort(key=lambda x: x[1])
        
        report.append("")
        report.append("🏅 RANKING (Best to Worst Performance)")
        report.append("-" * 50)
        
        for i, (combo_name, score, stats) in enumerate(performance_scores, 1):
            emoji = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
            report.append(f"{emoji} {combo_name} (Score: {score:.2f})")
        
        # Highlight FNV-1a + Separate Chaining
        fnv_separate = self.results.get("FNV-1a", {}).get("Separate Chaining", {})
        if fnv_separate:
            report.append("")
            report.append("🎯 YOUR CURRENT CHOICE: FNV-1a + Separate Chaining")
            report.append(f"   • Insertion Time: {fnv_separate['insertion_time']:.2f}ms")
            report.append(f"   • Lookup Time: {fnv_separate['lookup_time']:.2f}ms")
            report.append(f"   • Collision Rate: {fnv_separate['collision_rate']:.1f}%")
        
        return "\n".join(report)
