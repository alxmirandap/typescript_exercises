import { quicksort, mergesort } from './sort_array'
import { randomNumber, range } from './utils'

let manyTestValues: number[] = []
let fewTestValues: number[] = []
let sortedTestValues: number[] = []
let inverseSortedTestValues: number[] = []
let emptyTestValues: number[] = []
let withRepeatedElements: number[] = []
let MANY_ELEMENTS = 10000
let FEW_ELEMENTS = 10

for (const i of range(FEW_ELEMENTS)) {
    fewTestValues.push(randomNumber(1, 100))
}

for (const i of range(FEW_ELEMENTS)) {
    let doubleElement = randomNumber(1, 100)
    withRepeatedElements.push(doubleElement)
    withRepeatedElements.push(doubleElement)
}

for (const i of range(MANY_ELEMENTS)) {    
    manyTestValues.push(randomNumber(1, 100))
}

for (const i of range(MANY_ELEMENTS)) {
    sortedTestValues.push(i)
}

for (const i of range(MANY_ELEMENTS).reverse()) {
    inverseSortedTestValues.push(i)
}

let sorter = quicksort
let sorterName = 'quicksort'

let sorters = [
    {
        fn: quicksort,
        name: 'quicksort'
    },
    {
        fn: mergesort,
        name: 'mergesort'
    }
]

for (const sorter of sorters) {  

    describe(`${sorter.name} behaviour`, () => {
        test('sorting an empty array returns an empty array', () => {
            expect(sorter.fn(emptyTestValues)).toStrictEqual(emptyTestValues)
        })

        test('sorting an array with repeated elements correctly returns all of them', () => {
            let copyExpected = withRepeatedElements.concat().sort((a,b) => a-b)
            let sorted = sorter.fn(withRepeatedElements)
            expect(sorter.fn(withRepeatedElements)).toStrictEqual(copyExpected)
        })      

        test('sorting an already sorted array returns the same array', () => {
            expect(sorter.fn(sortedTestValues)).toStrictEqual(sortedTestValues)
        })    

        test('sorting the reverse of an already sorted array returns the same array', () => {
            let copyExpected = inverseSortedTestValues.concat().reverse()
            expect(sorter.fn(inverseSortedTestValues)).toStrictEqual(copyExpected)
        })    

        test('sorting a small array correctly returns that array sorted', () => {
            let sortedArray = fewTestValues.concat().sort((a,b) => a-b)
            let testArray = sorter.fn(fewTestValues) 
            expect(testArray).toStrictEqual(sortedArray)
        })

        test('sorting a large array correctly returns that array sorted', () => {
            let sortedArray = manyTestValues.concat().sort((a,b) => a-b)
            expect(sorter.fn(manyTestValues)).toStrictEqual(sortedArray)
        })
    })

}