const solveMaze = (fromCell, toCell, maze) => {

	const marked = new Set()
	const solveMazeHelper = (fromCell, path=[]) => {
		if (fromCell === toCell) {
			return path // success!
		}
		// mark fromCell as visited
		marked.add(fromCell)
		const adjacentCells = maze.get(fromCell)
		for (const nextCell of adjacentCells) {
			if (marked.has(nextCell)) continue

			const updatedPath = solveMazeHelper(nextCell, [...path, fromCell])
			if (updatedPath) {
				return updatedPath
			}
		}
		// All adjacent cells were tried, and failed ...
		return null // failure
	}
	return solveMazeHelper(fromCell)
}

const exampleMaze = new Map()
exampleMaze.set("A", ["B", "C"])
exampleMaze.set("B", ["A"])
exampleMaze.set("C", ["A", "D", "E"])
exampleMaze.set("D", ["C"])
exampleMaze.set("E", ["C", "F"])
exampleMaze.set("F", ["E", "G"])
exampleMaze.set("G", ["F"])

console.log(solveMaze('A', 'D', exampleMaze)); // A C
console.log(solveMaze('A', 'G', exampleMaze)); // A C E F