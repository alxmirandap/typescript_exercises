import { DoubleLinkedList } from './double_linked_list'
import { last } from './utils'

describe('List behaviour', () => {
    test('Calling the constructor returns an empty list', () => {
        let list = new DoubleLinkedList()
        expect(list.head).toBeUndefined()
        expect(list.tail).toBeUndefined()
        expect(list.size).toBe(0)
    })

    test('adding a single value creates a single list node', () => {
        let list = new DoubleLinkedList()
        list.add(7)
        
        expect(list.head).toBe(list.tail)
        expect(list.head.value).toBe(7)
        expect(list.size).toBe(1)
    })

    test('adding an array of values creates an unsorted list of nodes', () => {
        let list = new DoubleLinkedList()
        let testValues = [4,1,7,9,13]
        list.bulkAdd(testValues)
        
        expect(list.head).toBeDefined()
        expect(list.tail).toBeDefined()
        expect(list.head).not.toBe(list.tail)
        expect(list.head.value).toBe(testValues[0])
        expect(list.tail.value).toBe(last(testValues))
        expect(list.size).toBe(testValues.length)

        verifyListMatchesArray(list, testValues)
    })

    test('adding a value to the list appends it to the end of the list', () => {
        let list = new DoubleLinkedList()
        let testValues = [4,1,7,9,13]
        list.bulkAdd(testValues)
        let lastNode = list.tail
        let previousSize = list.size

        list.add(25)
        expect(lastNode.rightNode).toBeDefined()
        expect(lastNode.rightNode).toBe(list.tail)
        expect(list.tail.value).toBe(25)
        expect(list.size).toBe(previousSize + 1)
    })

    describe('removing an element', () => {
        let list 
        let testValues = [4,1,7,9,13]

        beforeEach(() => {
            list = new DoubleLinkedList()
            list.bulkAdd(testValues)       
        })       
        
        test('in the middle of the list conserves the previous order and reduces the size of the list', () => {
            let previousHead = list.head
            let previousTail = list.tail
            let previousSize = list.size

            let indexToRemove = 2
            let newReferenceValues: number[] = testValues.concat()
            newReferenceValues.splice(indexToRemove, 1)

            let valueToRemove = testValues[indexToRemove]
            list.remove(valueToRemove)
            
            expect(list.head).toBe(previousHead)
            expect(list.tail).toBe(previousTail)
            verifyListMatchesArray(list, newReferenceValues)
            expect(list.size).toBe(previousSize - 1)
        })

        test('that does not exist does not change the list', () => {           
            let previousHead = list.head
            let previousTail = list.tail
            let previousSize = list.size
            
            list.remove(-100)

            expect(list.head).toBe(previousHead)
            expect(list.tail).toBe(previousTail)
            verifyListMatchesArray(list, testValues)
            expect(list.size).toBe(previousSize)
        })

        test('in the head position moves the head of the list to the right', () => {
            let previousHead = list.head
            let previousTail = list.tail
            let previousSize = list.size

            let indexToRemove = 0
            let newReferenceValues: number[] = testValues.concat()
            newReferenceValues.splice(indexToRemove, 1)

            let valueToRemove = testValues[indexToRemove]
            list.remove(valueToRemove)
            
            expect(list.head).toBe(previousHead.rightNode)
            expect(list.tail).toBe(previousTail)
            verifyListMatchesArray(list, newReferenceValues)
            expect(list.size).toBe(previousSize - 1)
        })

        test('in the tail position moves the tail of the list to the left', () => {
            let previousHead = list.head
            let previousTail = list.tail
            let previousSize = list.size
            
            let indexToRemove = testValues.length - 1
            let newReferenceValues: number[] = testValues.concat()
            newReferenceValues.splice(indexToRemove, 1)

            let valueToRemove = testValues[indexToRemove]
            list.remove(valueToRemove)
            
            expect(list.head).toBe(previousHead)
            expect(list.tail).toBe(previousTail.leftNode)
            verifyListMatchesArray(list, newReferenceValues)
            expect(list.size).toBe(previousSize - 1)
        })
    })
})      


function verifyListMatchesArray(list, testValues) {
    console.log('Verifying list', testValues)

    let iteratorNode = list.head
    let testValueIndex = 0
    while(true) {
        expect(iteratorNode.value).toBe(testValues[testValueIndex])
        if (iteratorNode.rightNode === undefined) break
        
        expect(iteratorNode.rightNode.leftNode).toBe(iteratorNode)
        iteratorNode = iteratorNode.rightNode
        testValueIndex++
    }

    let listNodes = list.traverseFromHead()
    let reverseListNodes = list.traverseFromTail()
    expect(reverseListNodes).toStrictEqual(listNodes.concat().reverse())
}

// Sorted list?