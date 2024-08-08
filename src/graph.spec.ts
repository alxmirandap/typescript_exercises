import * as _ from "lodash";

import { GraphNode } from './graph'
import { BidirectionalGraph } from './graph'
import { range, last } from './utils'

let inexistentNode = 2342698

describe('Bidirectional Graph behaviour', () => {
    let g

    beforeAll(() => {
        g = new BidirectionalGraph<number>()
    })

    test('Calling the constructor creates an empty graph with no nodes', () => {        
        expect(g.nodes.length).toBe(0)
        expect(g.size()).toBe(0)        
    })

    describe('adding a node to the graph', () => {
        let value = 3

        test('if the graph is empty, it simply adds a node without neighbours', () => {
            expect(g.size()).toBe(0)
        
            g.addNode(value)

            expect(g.size()).toBe(1)
            expect(g.nodes[0].value).toBe(value)
            expect(g.nodes[0].edges.length).toBe(0)

            verifyGraphNodesConsistency(g)
        })
       
        test('silently succeeds if the node\'s value already exists in the graph, but makes no changes', () => {
            let oldValue = value

            let oldState = getGraphState(g)
            expect(g.containsNode(oldValue)).toBe(true)

            g.addNode(oldValue)

            let newState = getGraphState(g)
            expect(oldState).toStrictEqual(newState)

            expect(g.containsNode(oldValue)).toBe(true)

            verifyGraphNodesConsistency(g)
        })
    })

    describe('adding an edge to the graph', () => {
        let source = 10
        let destination = 11
    
        beforeAll(() => {
            g.addNode(source)
            g.addNode(destination)
            expect(g.size()).toBeGreaterThanOrEqual(2)

            verifyGraphNodesConsistency(g)            
        })

        describe('succeeds if both nodes exist and are not connected', () => {
            let sourceNode, destNode
            let sourceNeighbours, destNeighbours
            beforeAll( () => {
                sourceNode = g.map.get(source)
                destNode = g.map.get(destination)    

                sourceNeighbours = sourceNode.edges.length
                destNeighbours = destNode.edges.length

                g.addEdge(source, destination)
            })

            test('both nodes receive one new neighbour', () => {
                expect(sourceNode.edges.length).toBe(sourceNeighbours + 1)
                expect(destNode.edges.length).toBe(destNeighbours + 1)    
            })

            test('the resulting edge can be travelled in both directions', () => {
                expect(sourceNode.isNeighbourOf(destination)).toBe(true)
                expect(destNode.isNeighbourOf(source)).toBe(true)                
            })
    
        })

        test('fails if some of the nodes does not exist', () => {
            let missingNode = 12
            expect(g.containsNode(missingNode)).toBe(false)
            expect(g.containsNode(source)).toBe(true)
            expect(g.containsNode(destination)).toBe(true)

            let oldState = getGraphState(g)

            g.addEdge(source, missingNode)

            let newState = getGraphState(g)
            expect(oldState).toStrictEqual(newState)            

            g.addEdge(missingNode, destination)

            let latestState = getGraphState(g)
            expect(oldState).toStrictEqual(latestState)            
        })

        test('fails if the nodes are already connected', () => {
            expect(g.containsNode(source)).toBe(true)
            expect(g.containsNode(destination)).toBe(true)

            let sourceNode = g.map.get(source)
            let destNode = g.map.get(destination)

            expect(sourceNode.isNeighbourOf(destination)).toBe(true)
            expect(destNode.isNeighbourOf(source)).toBe(true)

            let oldState = getGraphState(g)

            g.addEdge(source, destination)

            let newState = getGraphState(g)
            expect(oldState).toStrictEqual(newState)            

            g.addEdge(destination, source)

            let latestState = getGraphState(g)
            expect(oldState).toStrictEqual(latestState)            

        })

    })

    

    describe('removing a node', () => {
        test('fails if the node does not exist', () => {
            let g = createExampleGraph()

            let oldState = getGraphState(g)

            let result = g.removeNode(inexistentNode)
            expect(result).toBeNull()

            let newState = getGraphState(g)
            expect(oldState).toStrictEqual(newState)            
        })

        test('removes the node and all associated edges if it exists, returning the node data with previous neighbours', () => {
            let g = createExampleGraph()

            let oldClusters = g.numberClusters()

            let expectedNode: GraphNode<number> = _.cloneDeep(g.map.get(3)!)
            let result = g.removeNode(3) // This node guarantees the creation of a new disconnected component in the graph
            expect(result?.print()).not.toStrictEqual(expectedNode.print())
            expect(result?.value).toStrictEqual(expectedNode.value)
            expect(result?.edges.length).toBe(0)

            let oldNeighbours = expectedNode.edges
                .map(node => node.value)
            let updatedNeighbours: GraphNode<number>[] = oldNeighbours
                .map(nodeValue => g.map.get(nodeValue)!)

            for(const neighbour of updatedNeighbours) {
                expect(neighbour.isNeighbourOf(3)).toBe(false)
            }

            let newClusters = g.numberClusters()
            expect(newClusters).toBe(oldClusters + 1)

        })
    })


    describe('BFS search examples', () => {
        let example
        beforeAll(() => {
            example = createExampleGraph()
        })

        test('searching for a node that is not in the graph returns undefined', () => {
            let path = example.bfSearch(11, inexistentNode)
            expect(path).toBeUndefined()
        })

        test('starting a search on a node that is not in the graph returns undefined', () => {
            let path = example.bfSearch(inexistentNode, 13)
            expect(path).toBeUndefined()
        })


        test('searching for node 13 from 12 returns an empty path', () => {
            let path = example.bfSearch(12, 13)
            expect(path).toStrictEqual([])
        })

        test('searching for node 5 from 1 returns [1,3,5]', () => {
            let path = example.bfSearch(1, 5)
            expect(path).toStrictEqual([1, 3, 5])
        })

        test('searching for node 13 from 11 returns [11,13]', () => {
            let path = example.bfSearch(11, 13)
            expect(path).toStrictEqual([11, 13])
        })

        test('searching for node 10 from 10 returns [10]', () => {
            let path = example.bfSearch(10, 10)
            expect(path).toStrictEqual([10])
        })

        test('searching for node 8 from 9 returns a path with 3 edges', () => {
            let path = example.bfSearch(9, 8)
            let edges = path.length - 1
            expect(edges).toBe(3)
        })
    })

    describe('DFS search examples', () => {
        let example
        beforeAll(() => {
            example = createExampleGraph()
        })

        test('searching for a node that is not in the graph returns undefined', () => {
            let path = example.dfSearch(11, inexistentNode)
            expect(path).toBeUndefined()
        })

        test('starting a search on a node that is not in the graph returns undefined', () => {
            let path = example.dfSearch(inexistentNode, 13)
            expect(path).toBeUndefined()
        })


        test('searching for node 13 from 12 returns an empty path', () => {
            let path = example.dfSearch(12, 13)
            expect(path).toStrictEqual([])
        })

        test('searching for node 5 from 1 returns a legal path from 1 to 5', () => {
            let source = 1
            let destination = 5

            let path = example.dfSearch(source, destination)
            expect(path.length).toBeGreaterThanOrEqual(3)
            let previousNode: GraphNode<number> = example.map.get(path[0])

            expect(previousNode.value).toBe(source)
            for (const node of path.slice(1)) {
                let currentNode: GraphNode<number> = example.map.get(node)
                expect(previousNode.isNeighbourOf(currentNode.value))
            }

            let lastNodeValue = last(path)
            expect(lastNodeValue).toBe(destination)
        })

        test('searching for node 13 from 11 returns [11,13]', () => {
            let path = example.dfSearch(11, 13)
            expect(path).toStrictEqual([11, 13])            
        })

        test('searching for node 10 from 10 returns [10]', () => {
            let path = example.dfSearch(10, 10)
            expect(path).toStrictEqual([10])
        })

        test('searching for node 8 from 9 returns a path with length 3', () => {
            let path = example.dfSearch(9, 8)
            let edges = path.length - 1
            expect(edges).toBe(3)
        })

    })

    describe('function that returns the number of connected components in a graph', () => {
        test('returns number of nodes, when graph has no edges', () => {
            let newGraph = new BidirectionalGraph()
            let noSubComponents = newGraph.numberClusters()
            expect(noSubComponents).toBe(0)
        })

        test('returns 1, when all nodes are connected', () => {
            /*
                1 --- 2 --- 3
                  \   |   /
                    \ |  /
                      4                  

            */

            let newGraph = new BidirectionalGraph()
            newGraph.addNode(1)
            newGraph.addNode(2)
            newGraph.addNode(3)
            newGraph.addNode(4)

            newGraph.addEdge(1, 2)
            newGraph.addEdge(2, 3)
            newGraph.addEdge(3, 4)
            newGraph.addEdge(2, 4)
            newGraph.addEdge(4, 1)

            let noSubComponents = newGraph.numberClusters()
            expect(noSubComponents).toBe(1)
        })

        test('returns 4 components for the example graph', () => {
            let newGraph = createExampleGraph()
            let noSubComponents = newGraph.numberClusters()
            expect(noSubComponents).toBe(4)
        })
    })
})

function verifyGraphNodesConsistency(g) {
    for (const node of g.nodes) {
        expect(node).toBeInstanceOf(GraphNode)
        expect(g.map.get(node.value)).toBe(node)
    }
}

function getGraphState(g) {
    return {
        graphSize: g.size,
        nodes: g.nodes.map(node => _.cloneDeep(node))
    }
}


// Vertices: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
/*

1  ---- 2 ---4
     \     /
      \   /
        3
        |
        |
        5

queue: (1) - ( [1,2], [1,3] ) - ( [1,3], [1,2,4] ) - ()
visited: [] - [1] - [1, 2] - [1, 2, 3] - [1, 2, 3, 4] - [1,2,3,4,5]


6 --- 7 --- 8
|     |
|     |
9---- 12

stack (8) - ( [8, 7]) - ( [8, 7, 6], [8, 7, 12]) - ( [8,7,6], [8,7,12,9])
visited: [8] - [8, 7] - [8,7,12]

10


11---13
*/


function createExampleGraph() {
    let g = new BidirectionalGraph()
    for(const i in range(13)) {
        g.addNode(parseInt(i) + 1)
    }

    g.addEdge(1, 2)
    g.addEdge(2, 4)
    g.addEdge(1, 3)
    g.addEdge(4, 3)
    g.addEdge(3, 5)

    g.addEdge(6, 7)
    g.addEdge(7, 8)
    g.addEdge(6, 9)
    g.addEdge(9, 12)
    g.addEdge(7, 12)

    g.addEdge(11, 13)

    return g
}