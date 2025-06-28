import sys
import os
import time
import random

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

# Import your original merge sort
from app.algorithms.mergesort import merge_sort

def generate_test_data(size: int):
    """Generate simple test data for sorting algorithms"""
    data = []
    for i in range(size):
        data.append({
            "id": i,
            "score": random.randint(0, 100)
        })
    return data

def bubble_sort(data: list, sort_key: str) -> list:
    """Bubble Sort Algorithm - O(n²)"""
    data_copy = data.copy()
    n = len(data_copy)
    
    for i in range(n):
        for j in range(0, n - i - 1):
            if data_copy[j][sort_key] > data_copy[j + 1][sort_key]:
                data_copy[j], data_copy[j + 1] = data_copy[j + 1], data_copy[j]
    
    return data_copy

def insertion_sort(data: list, sort_key: str) -> list:
    """Insertion Sort Algorithm - O(n²)"""
    data_copy = data.copy()
    
    for i in range(1, len(data_copy)):
        key_item = data_copy[i]
        key_val = key_item[sort_key]
        j = i - 1
        
        while j >= 0 and data_copy[j][sort_key] > key_val:
            data_copy[j + 1] = data_copy[j]
            j -= 1
        
        data_copy[j + 1] = key_item
    
    return data_copy

def selection_sort(data: list, sort_key: str) -> list:
    """Selection Sort Algorithm - O(n²)"""
    data_copy = data.copy()
    n = len(data_copy)
    
    for i in range(n):
        min_idx = i
        
        for j in range(i + 1, n):
            if data_copy[j][sort_key] < data_copy[min_idx][sort_key]:
                min_idx = j
        
        data_copy[i], data_copy[min_idx] = data_copy[min_idx], data_copy[i]
    
    return data_copy

def shaker_sort(data: list, sort_key: str) -> list:
    """Shaker Sort (Cocktail Sort) Algorithm - O(n²)"""
    data_copy = data.copy()
    n = len(data_copy)
    left = 0
    right = n - 1
    
    while left < right:
        # Forward pass
        for i in range(left, right):
            if data_copy[i][sort_key] > data_copy[i + 1][sort_key]:
                data_copy[i], data_copy[i + 1] = data_copy[i + 1], data_copy[i]
        right -= 1
        
        # Backward pass
        for i in range(right, left, -1):
            if data_copy[i][sort_key] < data_copy[i - 1][sort_key]:
                data_copy[i], data_copy[i - 1] = data_copy[i - 1], data_copy[i]
        left += 1
    
    return data_copy

def merge_sort_clean(data: list, sort_key: str) -> list:
    """Wrapper for your original merge sort to match interface"""
    # Your merge sort expects descending=False for ascending order
    return merge_sort(data, sort_key, descending=False)

def test_sorting_algorithms(data_size: int):
    """Test all sorting algorithms with given data size"""
    
    algorithms = {
        "Merge Sort": merge_sort_clean,  # YOUR ORIGINAL - Should be the best!
        "Bubble Sort": bubble_sort,
        "Insertion Sort": insertion_sort,
        "Selection Sort": selection_sort,
        "Shaker Sort": shaker_sort
    }
    
    # Generate test data
    test_data = generate_test_data(data_size)
    
    print(f"Testing with {data_size} items")
    print("-" * 40)
    
    results = []
    
    for algo_name, algo_func in algorithms.items():
        try:
            # Measure execution time
            start_time = time.perf_counter()
            sorted_data = algo_func(test_data, "score")
            execution_time = (time.perf_counter() - start_time) * 1000  # ms
            
            # Verify correctness
            is_sorted = all(sorted_data[i]["score"] <= sorted_data[i+1]["score"] 
                           for i in range(len(sorted_data)-1))
            
            results.append((algo_name, execution_time, is_sorted))
            
        except Exception as e:
            results.append((algo_name, float('inf'), False))
    
    # Sort by execution time
    results.sort(key=lambda x: x[1])
    
    # Display results
    for i, (algo_name, exec_time, is_correct) in enumerate(results, 1):
        status = "PASS" if is_correct else "FAIL"
        if exec_time == float('inf'):
            print(f"  {i}. {algo_name}: FAILED - {status}")
        else:
            # Highlight merge sort performance
            star = " ⭐ YOUR CHOICE" if algo_name == "Merge Sort" else ""
            print(f"  {i}. {algo_name}: {exec_time:.3f}ms - {status}{star}")
    
    return results

def simple_test():
    """Simple test with 10 items"""
    print("Simple Sorting Test (10 Items)")
    print("=" * 40)
    return test_sorting_algorithms(10)

def medium_test():
    """Medium test with 50 items"""
    print("Medium Sorting Test (50 Items)")
    print("=" * 40)
    return test_sorting_algorithms(50)

def hard_test():
    """Hard test with 100 items"""
    print("Hard Sorting Test (100 Items)")
    print("=" * 40)
    return test_sorting_algorithms(100)

def extreme_test():
    """Extreme test with 500 items"""
    print("Extreme Sorting Test (500 Items)")
    print("=" * 40)
    result = test_sorting_algorithms(500)
    
    # Special analysis for extreme test
    print(f"\nEXTREME SCALE ANALYSIS:")
    merge_result = next((r for r in result if r[0] == "Merge Sort"), None)
    if merge_result and merge_result[2]:  # if merge sort passed
        merge_time = merge_result[1]
        merge_rank = next(i for i, r in enumerate(result, 1) if r[0] == "Merge Sort")
        
        print(f"Your Merge Sort: #{merge_rank} position, {merge_time:.3f}ms")
        print(f"O(n log n) performance: Guaranteed scalability")
        
        # Compare with O(n²) algorithms
        n2_algos = [r for r in result if r[0] in ["Bubble Sort", "Selection Sort", "Insertion Sort", "Shaker Sort"] and r[2]]
        if n2_algos:
            avg_n2_time = sum(r[1] for r in n2_algos) / len(n2_algos)
            improvement = avg_n2_time / merge_time
            print(f"Average O(n²) time: {avg_n2_time:.3f}ms")
            print(f"Merge Sort advantage: {improvement:.1f}x faster")
    
    return result

if __name__ == "__main__":
    print("Choose sorting test scale:")
    print("1. Simple test (10 items)")
    print("2. Medium test (50 items)")
    print("3. Hard test (100 items)")
    print("4. Extreme test (500 items)")
    
    choice = input("Enter choice (1, 2, 3, or 4, default 4): ").strip() or "4"
    
    if choice == "1":
        results = simple_test()
    elif choice == "2":
        results = medium_test()
    elif choice == "3":
        results = hard_test()
    else:
        results = extreme_test()
    
    if results:
        print(f"\nTest completed successfully!")
        fastest = min(results, key=lambda x: x[1])
        
        # Highlight if merge sort won
        if fastest[0] == "Merge Sort":
            print(f"WINNER: {fastest[0]} ({fastest[1]:.3f}ms) - Your choice is the best!")
        else:
            print(f"Fastest: {fastest[0]} ({fastest[1]:.3f}ms)")
            merge_result = next((r for r in results if r[0] == "Merge Sort"), None)
            if merge_result:
                print(f"Your Merge Sort: {merge_result[1]:.3f}ms - Still excellent O(n log n) performance!")
    else:
        print(f"\nTest failed!")