// https://www.youtube.com/watch?v=fAAZixBzIAI&t=5656s

const { Node } = require("./node-class");

const maxPathSum = (root) => {
  if (root === null) return -Infinity;
  if (root.left === null && root.right === null) return root.val;
  const maxChildPathSum = Math.max(maxPathSum(root.left), maxPathSum(root.right));
  return root.val + maxChildPathSum;
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

console.log(maxPathSum(a)); // -> 18

a = new Node(5);
(function() {
    const b = new Node(11);
    const c = new Node(54);
    const d = new Node(20);
    const e = new Node(15);
    const f = new Node(1);
    const g = new Node(3);

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    e.left = f;
    e.right = g;

    //        5
    //     /    \
    //    11    54
    //  /   \
    // 20   15
    //      / \
    //     1  3
})();

console.log(maxPathSum(a)); // -> 59

a = new Node(-1);
(function() {
    const b = new Node(-6);
    const c = new Node(-5);
    const d = new Node(-3);
    const e = new Node(0);
    const f = new Node(-13);
    const g = new Node(-1);
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
    // -3   0    -13
    //     /       \
    //    -1       -2
})();

console.log(maxPathSum(a)); // -> -8

a = new Node(42);

//        42

console.log(maxPathSum(a)); // -> 42
