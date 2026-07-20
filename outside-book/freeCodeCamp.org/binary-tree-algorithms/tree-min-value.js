// https://www.youtube.com/watch?v=fAAZixBzIAI&t=4793s

const { Node } = require("./node-class");

/*
// based on depth-first search, iterative
const treeMinValue = (root) => {
    let smallest = Infinity;
    const stack = [ root ];
    while (stack.length > 0) {
        const current = stack.pop();
        if (current.val < smallest) smallest = current.val;

        if (current.left !== null) stack.push(current.left);
        if (current.right !== null) stack.push(current.right);
    }

    return smallest;
};*/

/*
// based on breadth-first search
const treeMinValue = (root) => {
    let smallest = Infinity;
    const queue = [ root ];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.val < smallest) smallest = current.val;

        if (current.left !== null) queue.push(current.left);
        if (current.right !== null) queue.push(current.right);
    }

    return smallest;
};*/

const treeMinValue = (root) => {
    if (root === null) return Infinity;
    const leftMin = treeMinValue(root.left);
    const rightMin = treeMinValue(root.right);
    return Math.min(root.val, leftMin, rightMin);
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

console.log(treeMinValue(a)); // -> -2

a = new Node(5);
(function() {
    const b = new Node(11);
    const c = new Node(3);
    const d = new Node(4);
    const e = new Node(14);
    const f = new Node(12);

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;

    //       5
    //    /    \
    //   11     3
    //  / \      \
// 4   14     12
})();

console.log(treeMinValue(a)); // -> 3

a = new Node(-1);
(function() {
    const b = new Node(-6);
    const c = new Node(-5);
    const d = new Node(-3);
    const e = new Node(-4);
    const f = new Node(-13);
    const g = new Node(-2);
    const h = new Node(-2);

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;
    e.left = g;
    f.right = h;

    //        -1
    //      /   \
    //    -6    -5
    //   /  \     \
    // -3   -4   -13
    //     /       \
//    -2       -2
})();

console.log(treeMinValue(a)); // -> -13

a = new Node(42);

//        42

console.log(treeMinValue(a)); // -> 42
