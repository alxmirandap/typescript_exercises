console.log('Hello world from Ts test')

let s: Set<number> = new Set()
s.add(1)
s.add(2)
s.add(2)
s.add(3)

console.log(s)

let t: Set<number> = new Set([1,7,4])

for (const e of t) {
    s.add(e)
}

console.log('Final', s)