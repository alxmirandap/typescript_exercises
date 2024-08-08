class ListNode {
     val: number
     next: ListNode | null
     constructor(val?: number, next?: ListNode | null) {
         this.val = (val===undefined ? 0 : val)
         this.next = (next===undefined ? null : next)
     }

}

function traverse(head: ListNode | null): number[] {
    let result: number[] = []
    while (head !== null) {
        result.push(head.val)
        head = head.next
    }

    return result
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    let newList
    while (lists.length >= 2) {
        newList = merge2Lists(lists.pop()!, lists.pop()!)
        lists.push(newList)
        console.log('concluded loop iteration. New size', lists.length)
    } 
    return lists[0]
};

function merge2Lists(head1: ListNode | null, head2: ListNode | null): ListNode | null {
    if (head1 === null) return head2
    if (head2 === null) return head1

    let newHead
    if (head1.val < head2.val) {
        newHead = new ListNode(head1.val)
        head1 = head1.next
    } else {
        newHead = new ListNode(head2.val)
        head2 = head2.next
    }

    let rest = merge2Lists(head1, head2)
    newHead.next = rest

    return newHead
}

let node5 = new ListNode(5)
let node4 = new ListNode(4)
let node3 = new ListNode(3, node5)
let node1 = new ListNode(1, node3)

let list1 = node1
let list2 = node4 

console.log('List 1', traverse(list1)) // [1,3,5]
console.log('List 2', traverse(list2)) // [4]

let list3 = merge2Lists(list1, list2)
console.log('Merge list1 and list2\n', traverse(list3)) // [1,3,4,5]

let list4 = node3 // [3,5]

console.log('Merge list1 and list3\n', traverse(merge2Lists(list1, list3))) // [1,1,3,3,4,5,5]

console.log('Merge k lists', traverse(mergeKLists([list1, list2, list3, list4]))) // [1,1,3,3,3,4,4,5,5,5]

