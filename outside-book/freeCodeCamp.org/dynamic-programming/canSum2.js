// https://www.youtube.com/watch?v=oBt53YbR9Kk&t=13079s
const canSum = (targetSum, numbers) => {
    const table = Array(targetSum + 1).fill(false);
    table[0] = true;

    for (let i = 0; i <= targetSum; i++) {
        if (table[i]) {
            for (let num of numbers) {
                table[i + num] = true;
            }
        }
    }

    return table[targetSum];
};

console.log(canSum(7, [2, 3])); // true
console.log(canSum(7, [5, 3, 4, 7])); // true
console.log(canSum(7, [2, 4])); // false
console.log(canSum(8, [2, 3, 5])); // true
console.log(canSum(300, [7, 14])); // false
