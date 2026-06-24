const { newNode, newBinaryTree, print } = require("../binary_search_tree");

const rebuild = (inOrder, postOrder) => {
	if (!inOrder.length) {
		return newBinaryTree();
	}

	const root = postOrder[postOrder.length - 1];
	const rootIndex = inOrder.indexOf(root);
	const leftPostOrder = [];
	const rightPostOrder = [];
	for (const n of postOrder.slice(0, postOrder.length - 1)) {
		const idx = inOrder.indexOf(n);
		if (idx < rootIndex) {
			leftPostOrder.push(n);
		}
		else {
			rightPostOrder.push(n);
		}
	}
	const left = rebuild(inOrder.slice(0, rootIndex), leftPostOrder);
	const right = rebuild(inOrder.slice(rootIndex + 1), rightPostOrder);
	return newNode(root, left, right);
}

let example = rebuild([], []);
print(example); // (empty)

example = rebuild([1], [1]);
print(example); // 1

example = rebuild([1, 2], [2, 1]);
print(example); // 1\n R: 2

example = rebuild([1, 2], [1, 2]);
print(example); // 2\n L: 1

example = rebuild([4, 9, 10, 11, 12, 22, 23, 24, 56, 60],
	[4, 10, 12, 11, 9, 23, 56, 24, 60, 22]);
print(example);