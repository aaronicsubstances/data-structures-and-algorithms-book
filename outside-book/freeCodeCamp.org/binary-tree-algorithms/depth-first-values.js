// https://www.youtube.com/watch?v=fAAZixBzIAI&t=859s

const { Node } = require("./node-class");

const depthFirstValues = (root) => {
    if (root === null) return [];

    const values = [];
    const stack = [ root ];

    while (stack.length > 0) {
        const current = stack.pop();
        values.push(current.val);

        if (current.right !== null) {
            stack.push(current.right);
        }
        if (current.left !== null) {
            stack.push(current.left);
        }
    }

    return values;
};

const depthFirstValuesRecursive = (root) => {
    if (root === null) return [];
    const leftValues = depthFirstValuesRecursive(root.left);
    const rightValues = depthFirstValuesRecursive(root.right);
    return [ root.val, ...leftValues, ...rightValues ];
};

let a = new Node('a');
(function() {
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    const e = new Node('e');
    const f = new Node('f');

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

console.log(depthFirstValues(a));
//    -> ['a', 'b', 'd', 'e', 'c', 'f']

console.log(depthFirstValuesRecursive(a));
//    -> ['a', 'b', 'd', 'e', 'c', 'f']

a = new Node('a');
(function() {
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    const e = new Node('e');
    const f = new Node('f');
    const g = new Node('g');

    a.left = b;
    a.right = c;
    b.left = d;
    b.right = e;
    c.right = f;
    e.left = g;

    //      a
    //    /   \
    //   b     c
    //  / \     \
    // d   e     f
    //    /
    //   g
})();

console.log(depthFirstValues(a));
//    -> ['a', 'b', 'd', 'e', 'g', 'c', 'f']

a = new Node('a');
//      a
console.log(depthFirstValues(a));
//    -> ['a']

a = new Node('a');
(function() {
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    const e = new Node('e');

    a.right = b;
    b.left = c;
    c.right = d;
    d.right = e;

    //      a
    //       \
    //        b
    //       /
    //      c
    //       \
    //        d
    //         \
    //          e
})();

console.log(depthFirstValues(a)); 
//    -> ['a', 'b', 'c', 'd', 'e']

console.log(depthFirstValues(null));
//    -> []
