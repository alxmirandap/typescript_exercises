import { Tree, TreeNode, searchTreeToLinkedList } from './binary_tree'

describe('Calling the tree constructor', () => {
    test('without an argument results in an error', () => {
        // @ts-expect-error Function requires arguments
        let tree = new Tree()
    })

    test('with a single argument creates a single node without children', () => {
        let nodeValue = 2

        let tree = Tree.createSingleNodeTree(nodeValue)
        
        expect(tree).toBeInstanceOf(Tree)
        expect(tree.root).toBeInstanceOf(TreeNode)
        expect(tree.root.value).toBe(nodeValue)
        expect(tree.leftChild).toBeUndefined()
        expect(tree.rightChild).toBeUndefined()
    })

    test('with an array of values creates a non-balanced binary tree with the same elements of the array', () => {
        let nodeValues = [1,25,63,7,10,21,4,8,10]

        let tree = Tree.createTree(nodeValues)
        expect(tree).toBeInstanceOf(Tree)
        expect(tree.root).toBeInstanceOf(TreeNode)

        let treeNodes = tree.inOrderTraversal()
        expect(treeNodes.length).toBe(nodeValues.length)
        expect(treeNodes).toStrictEqual(nodeValues.concat().sort((a,b) => (a-b)))
    })
})

test('it is possible to convert a tree to a double-linked list keeping the same ordering', () => {
    let nodeValues = [1,25,63,7,10,21,4,8,10]
    let tree = Tree.createTree(nodeValues)
    let list = searchTreeToLinkedList(tree)

    let treeNodes = tree.inOrderTraversal()
    let listNodes = list.traverseFromHead()

    expect(treeNodes).toStrictEqual(listNodes)

    let reverseListNodes = list.traverseFromTail()
    expect(reverseListNodes).toStrictEqual(listNodes.concat().reverse())
})