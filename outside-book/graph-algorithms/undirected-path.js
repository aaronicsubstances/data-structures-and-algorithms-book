// https://www.youtube.com/watch?v=tWVWeAqZ0WU&t=2531s
const undirectedPath = (edges, nodeA, nodeB) => {
    const graph = buildGraph(edges);
    return hasPath(graph, nodeA, nodeB, new Set());
};

const hasPath = (graph, src, dst, visited) =>  {
    if (src === dst) return true;
    if (visited.has(src)) return false;

    visited.add(src);

    for (let neighbor of graph[src]) {
        if (hasPath(graph, neighbor, dst, visited)) {
            return true;
        }
    }

    return false;
};

const buildGraph = (edges) => {
    const graph = {};

    for (let edge of edges) {
        const [ a, b ] = edge;
        if (!(a in graph)) graph[a] = [];
        if (!(b in graph)) graph[b] = [];
        graph[a].push(b);
        graph[b].push(a);
    }

    return graph;
};

let edges = [
  ['i', 'j'],
  ['k', 'i'],
  ['m', 'k'],
  ['k', 'l'],
  ['o', 'n']
];

console.log(undirectedPath(edges, 'j', 'm')); // -> true
console.log(undirectedPath(edges, 'm', 'j')); // -> true
console.log(undirectedPath(edges, 'l', 'j')); // -> true
console.log(undirectedPath(edges, 'k', 'o')); // -> false
console.log(undirectedPath(edges, 'i', 'o')); // -> false


edges = [
  ['b', 'a'],
  ['c', 'a'],
  ['b', 'c'],
  ['q', 'r'],
  ['q', 's'],
  ['q', 'u'],
  ['q', 't'],
];

console.log(undirectedPath(edges, 'a', 'b')); // -> true
console.log(undirectedPath(edges, 'a', 'c')); // -> true
console.log(undirectedPath(edges, 'r', 't')); // -> true
console.log(undirectedPath(edges, 'r', 'b')); // -> false

edges = [
  ['s', 'r'],
  ['t', 'q'],
  ['q', 'r'],
];

console.log(undirectedPath(edges, 'r', 't')); // -> true