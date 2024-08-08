
import { last } from './utils'
import * as _ from "lodash";

export class BidirectionalGraph<T extends number> {
    nodes: GraphNode<T>[]
    map: Map<T, GraphNode<T>>

    constructor() {
        this.map = new Map()
        this.nodes = []
    }

    containsNode(value: T): boolean {
        return this.map.has(value)
    }

    addNode(value: T) {
        if (this.map.has(value)) return

        let newNode = new GraphNode(value)
        this.map.set(value, newNode)
        this.nodes.push(newNode)
    }

    addEdge(source: T, destination: T) {
        if (!this.containsNode(source)) return
        if (!this.containsNode(destination)) return

        let sourceNode = this.map.get(source)!
        if (sourceNode.isNeighbourOf(destination)) return

        let destNode = this.map.get(destination)!
        if (destNode.isNeighbourOf(source)) return

        sourceNode.connectTo(destNode)
        destNode.connectTo(sourceNode)
    }

    removeNode(nodeValue: T): GraphNode<T> | null {
        if (!this.containsNode(nodeValue)) return null

        let targetNode = this.map.get(nodeValue)!

        let nodesToDelete: T[] = []
        for(const neighbour of targetNode.edges) {
            nodesToDelete.push(neighbour.value)                      
        }

        for (const toDelete of nodesToDelete) {
            this.removeEdge(toDelete, nodeValue)
        }
        

        let removedNode = _.cloneDeep(targetNode)

        this.map.delete(nodeValue)
        let removeIndex = this.nodes.findIndex(node => node.value === nodeValue)
        this.nodes.splice(removeIndex, 1)

        return removedNode
    }

    removeEdge(source: T, destination: T) {
        if (!this.containsNode(source)) return
        if (!this.containsNode(destination)) return

        let sourceNode = this.map.get(source)!
        if (!sourceNode.isNeighbourOf(destination)) return

        let destNode = this.map.get(destination)!
        if (!destNode.isNeighbourOf(source)) return

        sourceNode.disconnect(destNode)
        destNode.disconnect(sourceNode)
    }

    size(): number {
        return this.map.size
    }

    dfSearch(source: T, destination: T): T[] | undefined {

        if (!this.containsNode(source)) {
            console.log('returning undefined because source does not exist', source)
            return undefined
        }

        if (!this.containsNode(destination)) {
            console.log('returning undefined because dest does not exist', destination)
            return undefined        
        }

        let visitedNodes = new Map<T, boolean> ()
        for (const node of this.nodes) {
            visitedNodes.set(node.value, false)
        }

        let stack: Path<T>[] = []
        let sourceNode = this.map.get(source)!
        stack.push( [sourceNode] )      

        let found

        while(stack.length > 0) {
            let searchPath: Path<T> = stack.pop()!
            if (last(searchPath).value === destination) {
                found = searchPath
                break
            }

            let lastNode = last(searchPath)
            if (visitedNodes.get(lastNode.value)) continue
            
            visitedNodes.set(lastNode.value, true)
            for (const neighbour of lastNode.edges) {
                if (visitedNodes.get(neighbour.value)) continue
                stack.push(searchPath.concat([neighbour]))
            }
        }

        if (found) return found.map(node => node.value)

        return []

    }

    bfSearch(source: T, destination: T): T[] | undefined {

        if (!this.containsNode(source)) {
            console.log('returning undefined because source does not exist', source)
            return undefined
        }

        if (!this.containsNode(destination)) {
            console.log('returning undefined because dest does not exist', destination)
            return undefined        
        }

        let visitedNodes = new Map<T, boolean> ()
        for (const node of this.nodes) {
            visitedNodes.set(node.value, false)
        }

        let queue: Path<T>[] = []
        let sourceNode = this.map.get(source)!
        queue.push( [sourceNode] )      

        let found

        while(queue.length > 0) {
            let searchPath: Path<T> = queue.shift()!
            if (last(searchPath).value === destination) {
                found = searchPath
                break
            }

            let lastNode = last(searchPath)
            if (visitedNodes.get(lastNode.value)) continue
            
            visitedNodes.set(lastNode.value, true)
            for (const neighbour of lastNode.edges) {
                if (visitedNodes.get(neighbour.value)) continue
                queue.push(searchPath.concat([neighbour]))
            }
        }

        if (found) return found.map(node => node.value)

        return []
    }

    numberClusters(): number {
        let visitedNodes = new Map<T, boolean> ()
        for (const node of this.nodes) {
            visitedNodes.set(node.value, false)
        }

        let totalClusters = 0

        for (const node of this.nodes) {
            if (visitedNodes.get(node.value)) continue

            visitedNodes.set(node.value, true)
            totalClusters++
            traverseFrom(node, visitedNodes)
        }

        return totalClusters
    }
}

function traverseFrom<T extends number>(node: GraphNode<T>, visitedMap: Map<T, boolean>): void {
    for (const neighbour of node.edges) {
        if (visitedMap.get(neighbour.value)) continue

        visitedMap.set(neighbour.value, true)
        traverseFrom(neighbour, visitedMap)
    }
}

export class GraphNode<T extends number> {
    value: T
    edges: GraphNode<T>[]

    constructor (value: T) {
        this.value = value
        this.edges = []
    }

    degree(): number {
        return this.edges.length
    }

    isNeighbourOf(maybeNeighbour: T): boolean {
        return this.edges
            .map(node => node.value)
            .includes(maybeNeighbour)
    }

    connectTo(neighbour: GraphNode<T>) {
        this.edges.push(neighbour)
    }

    disconnect(neighbour: GraphNode<T>) {
        let removeIndex = this.edges.findIndex(node => node.value === neighbour.value)
        this.edges.splice(removeIndex, 1)
    }

    print(): string {
        let contents: T[] = []
        contents.push(this.value)
        for (const edge of this.edges) {
            contents.push(edge.value)
        }

        return contents.join(',')
    }
}

type Path<T extends number> = GraphNode<T>[]