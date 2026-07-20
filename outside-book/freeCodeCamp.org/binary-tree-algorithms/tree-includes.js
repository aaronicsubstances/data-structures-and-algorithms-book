// https://www.youtube.com/watch?v=fAAZixBzIAI&t=2863s

const { Node } = require("./node-class");

/*
// based on breadth first search.
const treeIncludes = (root, target) => {
    if (root === null) return false;
    const queue = [ root ];
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.val === target) {
            return true;
        }
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
    }
    return false;
};*/

// based on depth first search, recursive.
// preferred because recursive nature makes it more elegant
// breadth first search which does not have an elegant recursive
// version.
const treeIncludes = (root, target) => {
  if (root === null) return false;
  if (root.val === target) return true;
  return treeIncludes(root.left, target) || treeIncludes(root.right, target);
};

let a = new Node("a");
(function() {
    const b = new Node("b");
    const c = new Node("c");
    const d = new Node("d");
    const e = new Node("e");
    const f = new Node("f");

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;

    //      a
    //    /   \
    //   b     c
    //  / \     \
    // d   e     f
})();

console.log(treeIncludes(a, "e")); // -> true
console.log(treeIncludes(a, "a")); // -> true
console.log(treeIncludes(a, "n")); // -> false

a = new Node("a");
(function() {
    const b = new Node("b");
    const c = new Node("c");
    const d = new Node("d");
    const e = new Node("e");
    const f = new Node("f");
    const g = new Node("g");
    const h = new Node("h");

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;
    e.left = g;
    f.right = h;

    //      a
    //    /   \
    //   b     c
    //  / \     \
    // d   e     f
    //    /       \
//   g         h
})();

console.log(treeIncludes(a, "f")); // -> true
console.log(treeIncludes(a, "p")); // -> false

console.log(treeIncludes(null, "b")); // -> false