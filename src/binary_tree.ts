import { DoubleLinkedList, BiNode } from "./double_linked_list"

export class Tree<T extends number> {
    root: TreeNode<T>
    leftChild: Tree<T>
    rightChild: Tree<T>

    static createSingleNodeTree<T extends number>(value: T): Tree<T> {
        return new Tree<T>(value)
    }

    static createTree<T extends number>(values: T[]): Tree<T> {
        let tree = new Tree<T>(values[0])
        for (const value of values.slice(1)) {
            tree.insert(value)
        }
        return tree
    }

    constructor(value: T) {
        this.root = new TreeNode(value)        
    }

    collectNodes(): TreeNode<T>[] {
        let leftNodes: TreeNode<T>[] = []
        let rightNodes: TreeNode<T>[] = []

        if (this.leftChild !== undefined) {
            leftNodes = this.leftChild.collectNodes()
        }

        if (this.rightChild !== undefined) {
            rightNodes = this.rightChild.collectNodes()
        }

        return leftNodes.concat([this.root], rightNodes)
    }

    insert(value: T) {
        if (value < this.root.value) {
            this.insertValueOnLeftSide(value)
        } else {
            this.insertValueOnRightSide(value)
        }
    }

    inOrderTraversal(): T[] {
        let leftValues: T[] = []
        let rightValues: T[] = []
        
        if (this.leftChild) {
            leftValues = this.leftChild.inOrderTraversal()
        }

        if (this.rightChild) {
            rightValues = this.rightChild.inOrderTraversal()
        }

        return leftValues.concat([this.root.value], rightValues)
    }

    min(): TreeNode<T> {
        if (this.leftChild === undefined) return this.root
        return this.leftChild.min()
    }

    max(): TreeNode<T> {
        if (this.rightChild === undefined) return this.root
        return this.rightChild.max()
    }

    private insertValueOnLeftSide(value: T) {
        if (this.leftChild === undefined) {
            this.leftChild = new Tree(value)
        } else {
            this.leftChild.insert(value)
        }
    }

    private insertValueOnRightSide(value: T) {
        if (this.rightChild === undefined) {
            this.rightChild = new Tree(value)
        } else {
            this.rightChild.insert(value)
        }
    }
}


export function searchTreeToLinkedList<T extends number>(tree: Tree<T>): DoubleLinkedList<T> {
    // Extract to a function to create the binodes
    let binodes = new Map<TreeNode<T>, BiNode<T>>()
    let treeNodes = tree.collectNodes()

    for (const node of treeNodes) {
        let binode = new BiNode<T>(node.value)
        binodes.set(node, binode)
    }
    
    // Traverse tree one by one, update links in the binodes
    let list = new DoubleLinkedList<T>()
    let root = tree.root
    let rootBiNode = binodes.get(root)!
    updateLinks<T>(tree, binodes, list)
    let min = tree.min()
    list.head = binodes.get(min)!

    let max = tree.max()
    list.tail = binodes.get(max)!
    return list
}

function updateLinks<T extends number>(tree: Tree<T>, binodes: Map<TreeNode<T>, BiNode<T>>, list: DoubleLinkedList<T>) {
    let root = tree.root
    let rootBiNode = binodes.get(root)!  

    if (tree.leftChild !== undefined) {
        let leftNeighbour = tree.leftChild.max()
        let leftBinode = binodes.get(leftNeighbour)!
        rootBiNode.leftNode = leftBinode
        leftBinode.rightNode = rootBiNode

        updateLinks(tree.leftChild, binodes, list)
    }

    if (tree.rightChild !== undefined) {
        let rightNeighbour = tree.rightChild.min()
        let rightBinode = binodes.get(rightNeighbour)!
        rootBiNode.rightNode = rightBinode
        rightBinode.leftNode = rootBiNode    

        updateLinks(tree.rightChild, binodes, list)
    }


}

export class TreeNode<T extends number> {
    value: T

    constructor (value) {
        this.value = value
    }
}

