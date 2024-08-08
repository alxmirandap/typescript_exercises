import { MinHeap, MaxHeap } from './heap'
import { randomNumber } from './utils'

describe('MinHeap behaviour', () => {
    let minHeap: MinHeap<number>
    let testValues: number[]
    let n: number
    let minimal: number
    let secondMinimal: number

    beforeAll( () => {
        minHeap = new MinHeap()        
        n = randomNumber(10, 100)
        testValues = []
        for (let i = 0; i < n; i++) {
            testValues.push(randomNumber(1, 100))
        }
        let sortedValues = testValues.concat()
        sortedValues.sort((a,b) => a-b)
        minimal = sortedValues[0]
        secondMinimal = sortedValues[1]

    })

    test('Adding n elements to an empty heap makes it have size n', () => {
        for (const element of testValues) {
            minHeap.add(element)
        }

        expect(minHeap.size()).toBe(n)
    })

    test('The root element is always the minimal element in the heap', () => {
        expect(minHeap.root()).toBe(minimal)
    })

    test('RemoveRoot returns the element indicated by root()', () => {
        let previousRoot: number = minHeap.root()
        let extractedRoot: number | undefined = minHeap.removeRoot()

        expect(previousRoot).toBeDefined()
        expect(extractedRoot).toBe(previousRoot)
    })

    test('Adding one element and then removing it returns an empty heap', () => {
        minHeap = new MinHeap()
        minHeap.add(testValues[0])
        minHeap.removeRoot()

        expect(minHeap.size()).toBe(0)
        expect(minHeap.root()).toBeUndefined()
    })

    describe('After removing the root element', () => {
        beforeAll( () => {
            minHeap = new MinHeap()
            for (const element of testValues) {
                minHeap.add(element)
            }
    
            minHeap.removeRoot()
        })

        test('the size of the heap decreases by 1', () => {
            expect(minHeap.size()).toBe(n - 1)
        })

        test('the new root is the second minimal', () => {
            expect(minHeap.root()).toBe(secondMinimal)
        })
    })

    test('Successively removing the root until the heap is empty returns a sorted sequence', () => {
        let extractedValues: number[] = []
        minHeap = new MinHeap()
        for (const element of testValues) {
            minHeap.add(element)
        }

        while (minHeap.size() > 0) {
            expect(minHeap.root()).toBeDefined()
            extractedValues.push(minHeap.removeRoot())
        }

        expect(extractedValues.length).toBe(n)
        for (let i = 1; i < extractedValues.length; i++) {
            expect(extractedValues[i]).toBeGreaterThanOrEqual(extractedValues[i-1])
        }
    })

})

describe('MaxHeap behaviour', () => {
    let maxHeap: MaxHeap<number>
    let testValues: number[]
    let n: number
    let maximal: number
    let secondMaximal: number

    beforeAll( () => {
        maxHeap = new MaxHeap()        
        n = randomNumber(10, 100)
        testValues = []
        for (let i = 0; i < n; i++) {
            testValues.push(randomNumber(1, 100))
        }
        let sortedValues = testValues.concat()
        sortedValues.sort((a,b) => b-a)
        maximal = sortedValues[0]
        secondMaximal = sortedValues[1]

    })

    test('Adding n elements to an empty heap makes it have size n', () => {
        for (const element of testValues) {
            maxHeap.add(element)
        }

        expect(maxHeap.size()).toBe(n)
    })

    test('The root element is always the maximal element in the heap', () => {
        expect(maxHeap.root()).toBe(maximal)
    })

    test('RemoveRoot returns the element indicated by root()', () => {
        let previousRoot: number = maxHeap.root()
        let extractedRoot: number | undefined = maxHeap.removeRoot()

        expect(previousRoot).toBeDefined()
        expect(extractedRoot).toBe(previousRoot)
    })

    describe('After removing the root element', () => {
        beforeAll( () => {
            maxHeap = new MaxHeap()
            for (const element of testValues) {
                maxHeap.add(element)
            }
    
            maxHeap.removeRoot()
        })

        test('the size of the heap decreases by 1', () => {
            expect(maxHeap.size()).toBe(n - 1)
        })

        test('the new root is the second maximal', () => {
            expect(maxHeap.root()).toBe(secondMaximal)
        })
    })

    test('Successively removing the root until the heap is empty returns a sorted sequence', () => {
        let extractedValues: number[] = []
        maxHeap = new MaxHeap()
        for (const element of testValues) {
            maxHeap.add(element)
        }

        while (maxHeap.size() > 0) {
            expect(maxHeap.root()).toBeDefined()
            extractedValues.push(maxHeap.removeRoot())
        }

        expect(extractedValues.length).toBe(n)
        for (let i = 1; i < extractedValues.length; i++) {
            expect(extractedValues[i]).toBeLessThanOrEqual(extractedValues[i-1])
        }
    })

})
