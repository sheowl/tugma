# merge sort algorithm implementation

import time
from typing import List, Dict, Callable

def merge_sort(data: list, sort_key: str, descending: bool = False) -> list:
    # Start timing
    
    # Base case: if list has 1 or 0 elements, it's already sorted
    if len(data) <= 1:
        return data
    
    # Create a copy to avoid modifying the original list
    data_copy = data.copy()
    
    # Split the array into two halves
    mid = len(data_copy) // 2
    left_array = data_copy[:mid]
    right_array = data_copy[mid:]
    
    # Recursively sort both halves
    left_sorted = merge_sort(left_array, sort_key, descending)
    right_sorted = merge_sort(right_array, sort_key, descending)
    
    # Merge the sorted halves
    result = merge(left_sorted, right_sorted, sort_key, descending)
    

    
    return result

def merge(left: list, right: list, sort_key: str, descending: bool = False) -> list:
    """
    Helper function to merge two sorted lists
    """
    merged_array = []
    left_index = right_index = 0
    
    # Merge elements while both arrays have elements
    while left_index < len(left) and right_index < len(right):
        left_value = left[left_index].get(sort_key)
        right_value = right[right_index].get(sort_key)
        
        # Handle None values (put them at the end)
        if left_value is None:
            merged_array.append(right[right_index])
            right_index += 1
        elif right_value is None:
            merged_array.append(left[left_index])
            left_index += 1
        else:
            # Compare values based on ascending/descending order
            if descending:
                # For descending order: take the larger value first
                if left_value >= right_value:
                    merged_array.append(left[left_index])
                    left_index += 1
                else:
                    merged_array.append(right[right_index])
                    right_index += 1
            else:
                # For ascending order: take the smaller value first
                if left_value <= right_value:
                    merged_array.append(left[left_index])
                    left_index += 1
                else:
                    merged_array.append(right[right_index])
                    right_index += 1
    
    # Copy leftover elements from left array
    while left_index < len(left):
        merged_array.append(left[left_index])
        left_index += 1
    
    # Copy leftover elements from right array
    while right_index < len(right):
        merged_array.append(right[right_index])
        right_index += 1
    
    return merged_array

########################### ADDITIONAL SORTING ALGORITHMS ##############################

def quick_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Quick Sort Algorithm - O(n log n) average, O(n²) worst case"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    
    def _quick_sort(arr, low, high):
        if low < high:
            pi = _partition(arr, low, high, sort_key, descending)
            _quick_sort(arr, low, pi - 1)
            _quick_sort(arr, pi + 1, high)
    
    def _partition(arr, low, high, key, desc):
        pivot = arr[high].get(key)
        i = low - 1
        
        for j in range(low, high):
            curr_val = arr[j].get(key)
            if curr_val is None:
                continue
                
            should_swap = (curr_val <= pivot) if not desc else (curr_val >= pivot)
            if should_swap:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    _quick_sort(data_copy, 0, len(data_copy) - 1)
    return data_copy

def heap_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Heap Sort Algorithm - O(n log n) guaranteed"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    n = len(data_copy)
    
    def _heapify(arr, n, i, key, desc):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        
        def compare_values(val1, val2):
            if val1 is None: return False
            if val2 is None: return True
            return (val1 > val2) if not desc else (val1 < val2)
        
        if (left < n and 
            compare_values(arr[left].get(key), arr[largest].get(key))):
            largest = left
        
        if (right < n and 
            compare_values(arr[right].get(key), arr[largest].get(key))):
            largest = right
        
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            _heapify(arr, n, largest, key, desc)
    
    # Build max heap
    for i in range(n // 2 - 1, -1, -1):
        _heapify(data_copy, n, i, sort_key, descending)
    
    # Extract elements from heap
    for i in range(n - 1, 0, -1):
        data_copy[0], data_copy[i] = data_copy[i], data_copy[0]
        _heapify(data_copy, i, 0, sort_key, descending)
    
    return data_copy

def bubble_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Bubble Sort Algorithm - O(n²) - Inefficient but simple"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    n = len(data_copy)
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            val1 = data_copy[j].get(sort_key)
            val2 = data_copy[j + 1].get(sort_key)
            
            if val1 is None or val2 is None:
                continue
            
            should_swap = (val1 > val2) if not descending else (val1 < val2)
            if should_swap:
                data_copy[j], data_copy[j + 1] = data_copy[j + 1], data_copy[j]
                swapped = True
        
        if not swapped:
            break
    
    return data_copy

def insertion_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Insertion Sort Algorithm - O(n²) but efficient for small datasets"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    
    for i in range(1, len(data_copy)):
        key_item = data_copy[i]
        key_val = key_item.get(sort_key)
        j = i - 1
        
        while j >= 0:
            curr_val = data_copy[j].get(sort_key)
            if curr_val is None or key_val is None:
                break
            
            should_move = (curr_val > key_val) if not descending else (curr_val < key_val)
            if not should_move:
                break
                
            data_copy[j + 1] = data_copy[j]
            j -= 1
        
        data_copy[j + 1] = key_item
    
    return data_copy

def selection_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Selection Sort Algorithm - O(n²) - Simple but inefficient"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    n = len(data_copy)
    
    for i in range(n):
        target_idx = i
        
        for j in range(i + 1, n):
            val1 = data_copy[target_idx].get(sort_key)
            val2 = data_copy[j].get(sort_key)
            
            if val1 is None or val2 is None:
                continue
            
            should_select = (val2 < val1) if not descending else (val2 > val1)
            if should_select:
                target_idx = j
        
        data_copy[i], data_copy[target_idx] = data_copy[target_idx], data_copy[i]
    
    return data_copy

def python_builtin_sort(data: list, sort_key: str, descending: bool = False) -> list:
    """Python's Built-in Timsort Algorithm - Highly optimized hybrid"""
    if len(data) <= 1:
        return data
    
    data_copy = data.copy()
    
    def sort_key_func(item):
        val = item.get(sort_key)
        return val if val is not None else (float('inf') if not descending else float('-inf'))
    
    data_copy.sort(key=sort_key_func, reverse=descending)
    return data_copy

# ==================== SORTING COMPARISON CLASS ====================

class SortingComparison:
    def __init__(self, data: List[Dict]):
        self.data = data
        self.sort_algorithms = {
            "Merge Sort": merge_sort,
            "Quick Sort": quick_sort,
            "Heap Sort": heap_sort,
            "Python Builtin": python_builtin_sort,
            "Insertion Sort": insertion_sort,
            "Selection Sort": selection_sort,
            "Bubble Sort": bubble_sort
        }
        self.results = {}

    def run_comprehensive_test(self, sort_key: str = "score", descending: bool = True) -> Dict:
        """Run tests for all sorting algorithms"""
        print(f"Running Comprehensive Sorting Performance Tests...")
        print(f"Testing with {len(self.data)} items, sorting by '{sort_key}' ({'descending' if descending else 'ascending'})")
        print()
        
        for algo_name, algo_func in self.sort_algorithms.items():
            print(f"Testing {algo_name}...")
            
            try:
                # Measure execution time
                start_time = time.perf_counter()
                sorted_data = algo_func(self.data, sort_key, descending)
                execution_time = (time.perf_counter() - start_time) * 1000  # ms
                
                # Verify correctness
                is_sorted = self._verify_sort(sorted_data, sort_key, descending)
                
                self.results[algo_name] = {
                    "execution_time": execution_time,
                    "is_correct": is_sorted,
                    "items_processed": len(sorted_data),
                    "time_per_item": execution_time / len(self.data) if len(self.data) > 0 else 0
                }
                
                print(f"   {algo_name}: {execution_time:.3f}ms ({'CORRECT' if is_sorted else 'INCORRECT'})")
                
            except Exception as e:
                print(f"   {algo_name}: FAILED - {str(e)}")
                self.results[algo_name] = {
                    "execution_time": float('inf'),
                    "is_correct": False,
                    "error": str(e)
                }
        
        return self.results

    def _verify_sort(self, sorted_data: List[Dict], sort_key: str, descending: bool) -> bool:
        """Verify that the data is actually sorted correctly"""
        if len(sorted_data) <= 1:
            return True
        
        for i in range(len(sorted_data) - 1):
            val1 = sorted_data[i].get(sort_key)
            val2 = sorted_data[i + 1].get(sort_key)
            
            if val1 is None or val2 is None:
                continue
            
            if descending:
                if val1 < val2:
                    return False
            else:
                if val1 > val2:
                    return False
        
        return True

    def generate_report(self) -> str:
        """Generate a comprehensive performance report"""
        if not self.results:
            return "No test results available. Run comprehensive test first."
        
        report = []
        report.append("=" * 80)
        report.append("SORTING ALGORITHM PERFORMANCE COMPARISON REPORT")
        report.append("=" * 80)
        report.append(f"Dataset: {len(self.data)} items")
        report.append("")
        
        # Performance Summary
        report.append("PERFORMANCE SUMMARY")
        report.append("-" * 60)
        report.append(f"{'Algorithm':<20} {'Time(ms)':<12} {'Per Item(μs)':<15} {'Status':<10}")
        report.append("-" * 60)
        
        # Sort by execution time
        sorted_results = []
        for algo_name, stats in self.results.items():
            if "error" not in stats and stats["is_correct"]:
                sorted_results.append((algo_name, stats["execution_time"], stats))
        
        sorted_results.sort(key=lambda x: x[1])
        
        for algo_name, exec_time, stats in sorted_results:
            per_item_time = stats["time_per_item"] * 1000  # Convert to microseconds
            status = "PASS" if stats["is_correct"] else "FAIL"
            report.append(f"{algo_name:<20} {exec_time:<12.3f} {per_item_time:<15.3f} {status:<10}")
        
        # Add failed algorithms
        for algo_name, stats in self.results.items():
            if "error" in stats or not stats["is_correct"]:
                report.append(f"{algo_name:<20} {'FAILED':<12} {'-':<15} {'FAIL':<10}")
        
        report.append("")
        report.append("RANKING (Fastest to Slowest)")
        report.append("-" * 40)
        
        for i, (algo_name, exec_time, stats) in enumerate(sorted_results, 1):
            rank = "1st" if i == 1 else "2nd" if i == 2 else "3rd" if i == 3 else f"{i}th"
            report.append(f"{rank:>3} {algo_name} ({exec_time:.3f}ms)")
        
        # Highlight your current choice
        merge_stats = self.results.get("Merge Sort", {})
        if merge_stats and "error" not in merge_stats:
            report.append("")
            report.append("YOUR CURRENT CHOICE: Merge Sort")
            report.append(f"   • Execution Time: {merge_stats['execution_time']:.3f}ms")
            report.append(f"   • Time per Item: {merge_stats['time_per_item']*1000:.3f}μs")
            report.append(f"   • Guaranteed O(n log n) performance")
            report.append(f"   • Stable sort (preserves relative order)")
        
        return "\n".join(report)
    

def merge_sort_clean(data: list, sort_key: str, descending: bool = False) -> list:
    """Clean merge sort without timing/printing overhead for performance testing"""
    # Base case: if list has 1 or 0 elements, it's already sorted
    if len(data) <= 1:
        return data
    
    # Create a copy to avoid modifying the original list
    data_copy = data.copy()
    
    # Split the array into two halves
    mid = len(data_copy) // 2
    left_array = data_copy[:mid]
    right_array = data_copy[mid:]
    
    # Recursively sort both halves
    left_sorted = merge_sort_clean(left_array, sort_key, descending)
    right_sorted = merge_sort_clean(right_array, sort_key, descending)
    
    # Merge the sorted halves
    result = merge(left_sorted, right_sorted, sort_key, descending)
    
    return result