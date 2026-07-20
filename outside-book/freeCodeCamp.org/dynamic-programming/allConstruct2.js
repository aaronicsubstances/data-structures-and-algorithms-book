// https://www.youtube.com/watch?v=oBt53YbR9Kk&t=17423s
const allConstruct = (target, wordBank, memo = new Map()) => {
    const table = Array(target.length + 1)
        .fill()
        .map(() => []);
    table[0] = [[]];
    
    for (let i = 0; i <= target.length; i++) {
        for (let word of wordBank) {
            // if the word matches the characters starting at position i
            if (target.slice(i, i + word.length) === word) {
                const newCombinations = table[i].map(subarray => [...subarray, word]);
                table[i + word.length].push(...newCombinations);
            }
        }
    }

    return table[target.length];
};

console.log(allConstruct("purple", ["purp", "p", "ur", "le", "purpl"]));
// [
//   [ 'purp', 'le' ],
//   [ 'p', 'ur', 'p', 'le ]
// ]
console.log(allConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd", "ef", "c"]));
// [
//   [ 'abc', 'def' ],
//   [ 'ab', 'c', 'def' ],
//   [ 'abcd', 'ef' ],
//   [ 'ab', 'cd', 'ef' ]
// ]
console.log(allConstruct("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));
// []
console.log(allConstruct("aaaaaaaaaaz", ["a", "aa", "aaa", "aaaa", "aaaa"]));
// []