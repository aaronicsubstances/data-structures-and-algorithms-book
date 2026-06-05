// https://www.youtube.com/watch?v=oBt53YbR9Kk
const allConstruct = (target, wordBank, memo = new Map()) => {
    if (memo.has(target)) return memo.get(target);
    if (target === '') return [[]];

    const results = [];

    for (let word of wordBank) {
        if (target.indexOf(word) === 0) {
            const suffix = target.slice(word.length);
            const suffixWays = allConstruct(suffix, wordBank, memo);
            const targeWays = suffixWays.map(way => [ word,...way ]);
            results.push(...targeWays);
        }
    }

    memo.set(target, results);
    return results;
};

console.log(allConstruct("purple", ["purp", "p", "ur", "le", "purpl"]));
// [
//   [ 'purp', 'le' ],
//   [ 'p', 'ur', 'p', 'le ]
// ]
console.log(allConstruct("abcdef", ["ab", "abc", "cd", "def", "abcd", "ef", "c"]));
// [
//   [ 'ab', 'cd', 'ef' ],
//   [ 'ab', 'c', 'def' ],
//   [ 'abc', 'def' ],
//   [ 'abcd', 'ef' ]
// ]
console.log(allConstruct("skateboard", ["bo", "rd", "ate", "t", "ska", "sk", "boar"]));
// []
console.log(allConstruct("aaaaaaaaaaaaaaaaaaaaaaaaaaz", ["a", "aa", "aaa", "aaaa", "aaaa"]));
// []