import { mergeSort } from './mergeSort'

function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    let merged = mergeSort(nums1, nums2)
    let n = merged.length
    if (n % 2 === 0) {
        return (merged[n/2] + merged[n/2 - 1]) / 2
    } else {
        return merged[(n-1)/2]
    }
};

console.log('Case 1: ', findMedianSortedArrays([1,3], [2])) // Expected: 2.0
console.log('Case 2: ', findMedianSortedArrays([1,2], [3,4])) // Expected: 2.5