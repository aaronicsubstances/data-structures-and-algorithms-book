// https://www.youtube.com/watch?v=fAAZixBzIAI&t=3935s

const { Node } = require("./node-class");

/*
// based on breadth first search.
const treeSum = (root) => {
    if (root === null) return 0;
    let totalSum = 0;
    const queue = [ root ];
    while (queue.length > 0) {
        const current = queue.shift();
        totalSum += current.val;
        if (current.left !== null) queue.push(current.left);
        if (current.right !== null) queue.push(current.right);
    }
    return totalSum;
};*/

/*
// less elegant breadth first search, but correct.
const treeSum = (root) => {
    if (root === null) return 0;
    let totalSum = root.val;
    const queue = [ root ];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.left !== null) {
            queue.push(current.left);
            totalSum += current.left.val;
        }
        if (current.right !== null) {
            queue.push(current.right);
            totalSum += current.right.val;
        }
    }
    return totalSum;
};*/

const treeSum = (root) => {
    if (root === null) return 0;
    return root.val + treeSum(root.left) + treeSum(root.right);
};

let a = new Node(3);
(function() {
    const b = new Node(11);
    const c = new Node(4);
    const d = new Node(4);
    const e = new Node(-2);
    const f = new Node(1);

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;

    //       3
    //    /    \
    //   11     4
    //  / \      \
// 4   -2     1
})();

console.log(treeSum(a)); // -> 21

a = new Node(1);
(function() {
    const b = new Node(6);
    const c = new Node(0);
    const d = new Node(3);
    const e = new Node(-6);
    const f = new Node(2);
    const g = new Node(2);
    const h = new Node(2);

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;
    e.left = g;
    f.right = h;

    //      1
    //    /   \
    //   6     0
    //  / \     \
    // 3   -6    2
    //    /       \
    //   2         2
})();

console.log(treeSum(a)); // -> 10

console.log(treeSum(null)); // -> 0
