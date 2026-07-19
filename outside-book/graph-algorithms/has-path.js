// https://www.youtube.com/watch?v=tWVWeAqZ0WU&t=1753s
const hasPath = (graph, src, dst) =>  {
    if (src === dst) return true;

    for (let neighbor of graph[src]) {
        if (hasPath(graph, neighbor, dst)) {
            return true;
        }
    }

    return false;
};

let graph = {
  f: ['g', 'i'],
  g: ['h'],
  h: [],
  i: ['g', 'k'],
  j: ['i'],
  k: []
};

console.log(hasPath(graph, 'f', 'k')); // true
console.log(hasPath(graph, 'f', 'j')); // false
console.log(hasPath(graph, 'i', 'h')); // true

graph = {
  v: ['x', 'w'],
  w: [],
  x: [],
  y: ['z'],
  z: [],  
};
console.log(hasPath(graph, 'v', 'w')); // true
console.log(hasPath(graph, 'v', 'z')); // false