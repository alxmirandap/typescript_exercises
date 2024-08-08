function grayCodeMemoized(n: number, memo: Map<number, number[]>): number[] {
    if (memo.has(n)) {
        return memo.get(n)!
    }

    if (n === 0) {
        return []
    }

    if (n === 1) {
        let result = [0,1]
        memo.set(1, result)
        return result
    }

    let halfList = grayCodeMemoized(n-1, memo)
    let reversedHalflist = halfList.concat().reverse()
    let fullList = halfList.concat(
        reversedHalflist.map(element => element + Math.pow(2, (n-1)))
    )

    memo.set(n, fullList)  
    return fullList
}

console.log(`Gray Code for n = ${0}`, grayCodeMemoized(0, new Map())) // []
console.log(`Gray Code for n = ${1}`, grayCodeMemoized(1, new Map())) // [0,1]
console.log(`Gray Code for n = ${2}`, grayCodeMemoized(2, new Map())) // [0,1,3,2]
console.log(`Gray Code for n = ${3}`, grayCodeMemoized(3, new Map())) // [0,1,3,2,6,7,5,4]
