const { newNode, newBinaryTree, print } = require("../binary_search_tree");

const rebuild = (inOrder, preOrder) => {
	if (!inOrder.length) {
		return newBinaryTree();
	}

	const root = preOrder[0];
	const rootIndex = inOrder.indexOf(root);
	const leftPreOrder = [];
	const rightPreOrder = [];
	for (const n of preOrder.slice(1)) {
		const idx = inOrder.indexOf(n);
		if (idx < rootIndex) {
			leftPreOrder.push(n);
		}
		else {
			rightPreOrder.push(n);
		}
	}
	const left = rebuild(inOrder.slice(0, rootIndex), leftPreOrder);
	const right = rebuild(inOrder.slice(rootIndex + 1), rightPreOrder);
	return newNode(root, left, right);
}

let example = rebuild([], []);
print(example); // (empty)

example = rebuild([1], [1]);
print(example); // 1

example = rebuild([1, 2], [2, 1]);
print(example); // 2\n L: 1

example = rebuild([1, 2], [1, 2]);
print(example); // 1\n R: 2

example = rebuild([4, 9, 10, 11, 12, 22, 23, 24, 56, 60],
	[22, 9, 4, 11, 10, 12, 60, 24, 23, 56]);
print(example);
