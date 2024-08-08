// Brute force approach:

/*
- find the size of all strings in dictionary: d
- find the number of words in the dictionary: n
- keep a list of all the words in the dictionary, and how many times they must occur in the concatenated string
- scan the s array from left to right, d characters at a time, until one of them matches a word in the dictionary
    - after a match, enter into a special phase to check the whole check of the string. Stop as soon as the match fails. 
    - On stopping, remove one character from the test word, add one at the end and check again
    - If the string matches:
        add it to the results list
        remove the front word, add one more word at the end and check again
*/


function findSubstring(s: string, words: string[]): number[] {
    // Setup
    let n = words.length
    let wordSize = words[0].length
    let totalSize = n * wordSize
    let requiredWords = new Map<string, number>()
    let memo = new Map<string, boolean>()

    for (const word of words) {
        addToMap(word, requiredWords)
    }

    // Scan string 
    let results: number[] = []
    let slideIndex = 0;
    while(slideIndex + totalSize <= s.length) {
        let testWord = s.slice(slideIndex, slideIndex + wordSize)
        if (requiredWords.has(testWord)) {
            let candidateWord = s.slice(slideIndex, slideIndex + totalSize)
            if (candidateWord.length < totalSize) {
                break
            }

            let isMatch = verifyCandidate(candidateWord, requiredWords, wordSize, memo)
            if (isMatch) {
                results.push(slideIndex)
            } 
        }

        slideIndex++
    }

    return results
};

function verifyCandidate(word: string, dictionary: Map<string, number>, wordSize: number, memo: Map<string, boolean>): boolean {
    if (memo.has(word)) {
        return memo.get(word)!
    }

    let seenWords = new Map<string, number>()
    let wordsCompleted = 0

    for (let i = 0; i < word.length; i+=wordSize) {
        let subWord = word.slice(i, i + wordSize)
        if (!dictionary.has(subWord)) {
            memo.set(word, false)
            return false
        }

        addToMap(subWord, seenWords)
        let seen = seenWords.get(subWord)!
        if (seen > dictionary.get(subWord)!) {
            memo.set(word, false)
            return false
        }
        if (seen === dictionary.get(subWord)!) wordsCompleted++
    }

    let result = wordsCompleted === dictionary.size
    memo.set(word, result)
    return result
}


function addToMap(key, map) {
    if (!map.has(key)) {
        map.set(key, 1)
    } else {
        map.set(key, map.get(key) + 1)
    }
}

let results = findSubstring('barfoofoobarthefoobarman', ["bar","foo","the"])
console.log('Found results', results)

