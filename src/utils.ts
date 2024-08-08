export function randomNumber(min: number, max: number): number {
    return min + Math.trunc(Math.random() * (max+1 - min))   
}

export function range(n) {
    return [...new Array(n).keys()]
}

export function last(array) {
    return array.slice(-1)[0]
}
