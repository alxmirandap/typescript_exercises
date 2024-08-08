export class DoubleLinkedList<T extends number> {
    head: BiNode<T>
    tail: BiNode<T>
    size: number

    constructor() {
        this.size = 0
    }

    traverseFromHead(): T[] {
        let nodeValues: T[] = []
        let currentNode = this.head
        while(true) {
            nodeValues.push(currentNode.value)
            if (currentNode.rightNode === undefined) break

            currentNode = currentNode.rightNode
        }

        return nodeValues
    }

    traverseFromTail(): T[] {
        let nodeValues: T[] = []
        let currentNode = this.tail
        while(true) {
            nodeValues.push(currentNode.value)
            if (currentNode.leftNode === undefined) break

            currentNode = currentNode.leftNode
        }

        return nodeValues
    }

    add(value: T) {
        let newNode = new BiNode<T>(value)
        this.size++

        if (this.tail === undefined) {
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.rightNode = newNode
            newNode.leftNode = this.tail
            this.tail = newNode    
        }
    }

    bulkAdd(values: T[]) {
        for (const value of values) {
            this.add(value)
        }
    }

    remove(value: T) {
        let previous: BiNode<T> | undefined = undefined
        let searchNode = this.head
        while(true) {
            if (searchNode.value === value) {
                if (searchNode.rightNode) {
                    searchNode.rightNode.leftNode = previous
                }

                if (previous) {
                    previous.rightNode = searchNode.rightNode
                }

                if (searchNode === this.head) {
                    this.head = searchNode.rightNode
                }

                if (searchNode === this.tail) {
                    this.tail = searchNode.leftNode
                }

                this.size--
            } 

            if (searchNode.rightNode === undefined) break
            previous = searchNode
            searchNode = searchNode.rightNode
        
        }
    }
}

export class BiNode<T extends number> {
    value: T
    leftNode: BiNode<T> | undefined
    rightNode: BiNode<T> | undefined

    constructor (value) {
        this.value = value
    }
}