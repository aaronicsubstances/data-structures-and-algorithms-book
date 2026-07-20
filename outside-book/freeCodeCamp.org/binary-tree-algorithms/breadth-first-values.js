// https://www.youtube.com/watch?v=fAAZixBzIAI&t=2160s

const { Node } = require("./node-class");

const breadthFirstValues = (root) => {
    if (root === null) return [];
    
    const values = [];
    const queue = [ root ];

    while (queue.length > 0) {
        const current = queue.shift();
        values.push(current.val);

        if (current.left) {
            queue.push(current.left);
        }
        if (current.right) {
            queue.push(current.right);
        }
    }

    return values;
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

console.log(breadthFirstValues(a));
//    -> ['a', 'b', 'c', 'd', 'e', 'f']

a = new Node('a');
(function() {
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    const e = new Node('e');
    const f = new Node('f');
    const g = new Node('g');
    const h = new Node('h');

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

console.log(breadthFirstValues(a));
//    -> ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

a = new Node('a');
//      a
console.log(breadthFirstValues(a));
//    -> ['a']

a = new Node('a');
(function() {
    const b = new Node('b');
    const c = new Node('c');
    const d = new Node('d');
    const e = new Node('e');
    const x = new Node('x');

    a.right = b;
    b.left = c;
    c.left = x;
    c.right = d;
    d.right = e;

    //      a
    //       \
    //        b
    //       /
    //      c
    //     / \
    //    x   d
    //         \
    //          e
})();

console.log(breadthFirstValues(a)); 
//    -> ['a', 'b', 'c', 'x', 'd', 'e']

console.log(breadthFirstValues(null));
//    -> []
