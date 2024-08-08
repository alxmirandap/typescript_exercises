function last(nums: number[]): number {
    return nums.slice(-1)[0]   
}

export function mergeSort(nums1: number[], nums2: number[]) {
    let merged: number[] = []
    let reversed1 = nums1.reverse()
    let reversed2 = nums2.reverse()

    while(reversed1.length + reversed2.length > 0) {
        let number = chooseNext(reversed1, reversed2)
        if (number !== undefined) {
            merged.push(number)
        }
    }

    return merged
}

function chooseNext(nums1: number[], nums2: number[]): number | undefined {
    if (nums1.length === 0) {
        return nums2.pop()
    }

    if (nums2.length === 0) {
        return nums1.pop()
    }

    if (last(nums1) < last(nums2)) {
        return nums1.pop()
    } else {
        return nums2.pop()
    }
}
