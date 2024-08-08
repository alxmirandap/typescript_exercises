import { randomNumber, last } from "./utils"

export function quicksort<T>(array: T[] ) {
    if (array.length === 0) return []
    if (array.length === 1) return array
    if (array.length === 2) {
        if (array[0] < array[1]) {
            return [array[0], array[1]]
        } else {
            return [array[1], array[0]]
        }
    }
        
    let fulcrumIndex = randomNumber(0, array.length-1)
    let fulcrum: T = array[fulcrumIndex]

    let leftSide = array.filter((element: T) => element < fulcrum)
    let rightSide = array.filter((element: T) => element > fulcrum)
    let middle = array.filter((element: T) => element === fulcrum)

    let sortedLeft = quicksort(leftSide)
    let sortedRight = quicksort(rightSide)
    return sortedLeft.concat(middle, sortedRight)
}

export function mergesort<T>(array: T[]) {
    if (array.length === 0) return []
    if (array.length === 1) return array
        
    let leftSide = array.slice(0, array.length / 2)
    let rightSide = array.slice(array.length/2)

    let sortedLeft = mergesort(leftSide)
    let sortedRight = mergesort(rightSide)
    return mergeElements(sortedLeft, sortedRight)
}

function mergeElements<T>(sortedLeft: T[], sortedRight: T[]): T[] {
    let result = []

    // we want to continuously remove the smallest element of each array
    // this has a performance impact because removing from the front shift the whole array, which is O(n)
    // by reversing, we instead pop() from the top, which is O(1). We only incur the initial O(n) cost of reversing it
    sortedLeft.reverse()
    sortedRight.reverse()

    while(true) {
        let extractedValue = extractMinimalElement(sortedLeft, sortedRight)
        result.push(extractedValue)
        if (sortedLeft.length === 0 && sortedRight.length === 0) break
    }

    return result
}

function extractMinimalElement<T>(leftHead: T[], rightHead: T[]) {
    if (empty(leftHead) && empty(rightHead)) {
        throw new Error('Unexpected. Called extract when both lists are empty')
    }

    if (empty(leftHead)) {
        return rightHead.pop()
    }

    if (empty(rightHead)) {
        return leftHead.pop()
    }

    if (last(leftHead) < last(rightHead)) {
        return leftHead.pop()
    } else {
        return rightHead.pop()
    }    
}

function empty(array) {
    return (array.length === 0 || array === undefined || array === null)
}