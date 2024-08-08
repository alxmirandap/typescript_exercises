enum Operation {
    MIN,
    MAX
}

class AbstractHeap<T> {
    // heapIndex

    nodes: T[] 
    private operator: Operation

    constructor (operator: Operation) {
        this.nodes = []
        this.operator = operator
    }

    add(value: T) {
        this.nodes.push(value)
        this.bubbleUpLast()
    }

    removeRoot(): T | undefined {
        this.swap(1, this.maxIndex())
        let returnValue = this.nodes.pop()
        this.bubbleDownRoot()
        return returnValue
    }

    root(): T {
        return this.retrieve(1)
    }

    size(): number {
        return this.nodes.length
    }

// ---------- Private functions ------------------
    maxIndex(): number {
        return this.nodes.length
    }

    private bubbleUpLast() {
        let heapIndex = this.nodes.length // heapIndex is 1-based
        this.bubbleUp(heapIndex)
    }

    bubbleDownRoot() {
        this.bubbleDown(1)
    }

    private bubbleUp(heapIndex) {
        let thisValue: T = this.retrieve(heapIndex)

        let ancestorIndex = this.parentIndex(heapIndex)
        let ancestorValue = this.retrieve(ancestorIndex)
        
        if (this.predecessor(thisValue, ancestorValue)) {
            this.swap(heapIndex, ancestorIndex)
            this.bubbleUp(ancestorIndex)
        }
    }

    bubbleDown(heapIndex) {
        let thisValue = this.retrieve(heapIndex)
        let swapIndex

        let firstChildIndex: number = this.childIndex(heapIndex)
        let secondChildIndex = firstChildIndex + 1

        let firstChild: T = this.retrieve(firstChildIndex)
        let secondChild: T = this.retrieve(secondChildIndex)
        
        if (firstChild !== undefined && secondChild !== undefined) {
            if (this.predecessor(firstChild, secondChild)) {
                swapIndex = firstChildIndex
            } else {
                swapIndex = secondChildIndex
            }

        } else if (firstChild !== undefined) {
            swapIndex = firstChildIndex
        } else if (secondChild !== undefined) {
            swapIndex = secondChildIndex
        }
        
        if (swapIndex === undefined) {
        // Nothing to do. If we're here, the node does not have children as is already in place
            return
        }

        let swapValue = this.retrieve(swapIndex)
        if (this.predecessor(swapValue, thisValue)) {
            this.swap(heapIndex, swapIndex)
            this.bubbleDown(swapIndex)
        }

    }
    
    private retrieve(heapIndex) {
        return this.nodes[heapIndex - 1]
    }

    private put(heapIndex, value) {
        this.nodes[heapIndex - 1] = value
    }

    private swap(lowerIndex, greaterIndex) {
        let lowerValue = this.retrieve(lowerIndex)
        let greaterValue = this.retrieve(greaterIndex)        

        this.put(lowerIndex, greaterValue)
        this.put(greaterIndex, lowerValue)
    }

    private parentIndex(heapIndex) {
        if (heapIndex === 1) return undefined
        return Math.trunc(heapIndex / 2)
    }

    private childIndex(heapIndex): number {
        return heapIndex * 2
    }

    private predecessor(testValue: T, referenceValue: T): boolean {
        switch (this.operator) {
            case Operation.MAX: return testValue > referenceValue
            case Operation.MIN: return testValue < referenceValue
        }
    }
}

export class MinHeap<T> extends AbstractHeap<T> {
    constructor () {
        super(Operation.MIN)
    }
}


export class MaxHeap<T> extends AbstractHeap<T> {
    constructor () {
        super(Operation.MAX)
    }
}