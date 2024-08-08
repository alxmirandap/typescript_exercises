class _Node {
    val: number
    neighbors: _Node[]

    constructor(val?: number, neighbors?: _Node[]) {
        this.val = (val===undefined ? 0 : val)
        this.neighbors = (neighbors===undefined ? [] : neighbors)
    }
}

function cloneGraph(node: _Node | null): _Node | undefined | null {
    if (node === null) return null
    let visited: Set<_Node> = new Set()
    let linked: Set<string> = new Set()
    let graphCopy: Map<_Node, _Node> = new Map()
    
    registerNodeCopy(node!, graphCopy)  
    buildSubgraph(node!, visited, linked, graphCopy)

    return graphCopy.get(node!)
};

function registerNodeCopy(node: _Node, graphCopy: Map<_Node, _Node>) {
    let copyNode = new _Node(node.val)
    graphCopy.set(node, copyNode)
}

function buildSubgraph(node: _Node, visited: Set<_Node>, linked: Set<string>, graphCopy: Map<_Node, _Node>) {
    visited.add(node)
    for (const neighbor of node.neighbors) {
        if (!visited.has(neighbor)) {
            registerNodeCopy(neighbor, graphCopy)
            buildSubgraph(neighbor, visited, linked, graphCopy)
        }

        if (!linked.has(getSignature(node, neighbor))) {
            linkNodes(node, neighbor, linked, graphCopy)        
        }
        
    }
}

function linkNodes(node: _Node, neighbor: _Node, linked: Set<string>, graphCopy: Map<_Node, _Node>) {
    linked.add(getSignature(node, neighbor))
    linked.add(getSignature(neighbor, node))

    let copyNode = graphCopy.get(node)
    let copyNeighbor = graphCopy.get(neighbor)

    if (!copyNode || !copyNeighbor) return

    copyNode.neighbors.push(copyNeighbor)
    copyNeighbor.neighbors.push(copyNode)
}

function getSignature(nodeA: _Node, nodeB: _Node): string {
    return `${nodeA.val} - ${nodeB.val}`
}

function main() {
    let node1 = new _Node(1)
    let node2 = new _Node(2)
    let node3 = new _Node(3)
    let node4 = new _Node(4)

    node1.neighbors.push(node2)
    node1.neighbors.push(node4)

    node2.neighbors.push(node1)
    node2.neighbors.push(node3)

    node3.neighbors.push(node2)
    node3.neighbors.push(node4)

    node4.neighbors.push(node1)
    node4.neighbors.push(node3)

    let clone = cloneGraph(node1)

    console.log(node1, clone)
}


main()

