// https://www.youtube.com/watch?v=tWVWeAqZ0WU&t=5043s
const shortestPath = (edges, nodeA, nodeB) => {
    const graph = buildGraph(edges);
    const visited = new Set([ nodeA ]);
    const queue = [ [nodeA, 0] ];

    while (queue.length > 0) {
        const [node, distance] = queue.shift();

        if (node === nodeB) return distance;

        for (let neighbor of graph[node]) {
            if (visited.has(neighbor)) continue;
            visited.add(neighbor);
            queue.push([neighbor, distance + 1]);
        }
    }

    return -1;
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
  ['w', 'x'],
  ['x', 'y'],
  ['z', 'y'],
  ['z', 'v'],
  ['w', 'v']
];

console.log(shortestPath(edges, 'w', 'z')); // -> 2
console.log(shortestPath(edges, 'y', 'x')); // -> 1
console.log(shortestPath(edges, 'y', 'x')); // -> 1

edges = [
  ['a', 'c'],
  ['a', 'b'],
  ['c', 'b'],
  ['c', 'd'],
  ['b', 'd'],
  ['e', 'd'],
  ['g', 'f']
];

console.log(shortestPath(edges, 'a', 'e')); // -> 3
console.log(shortestPath(edges, 'e', 'c')); // -> 2
console.log(shortestPath(edges, 'b', 'g')); // -> -1

edges = [
  ['c', 'n'],
  ['c', 'e'],
  ['c', 's'],
  ['c', 'w'],
  ['w', 'e'],
];

console.log(shortestPath(edges, 'w', 'e')); // -> 1
console.log(shortestPath(edges, 'n', 'e')); // -> 2

edges = [
  ['m', 'n'],
  ['n', 'o'],
  ['o', 'p'],
  ['p', 'q'],
  ['t', 'o'],
  ['r', 'q'],
  ['r', 's']
];

console.log(shortestPath(edges, 'm', 's')); // -> 6