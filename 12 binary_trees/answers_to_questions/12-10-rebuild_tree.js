const rebuild = (inOrder, preOrder) => {

	const root = preOrder[0]
	const rootIndex = inOrder.findIndex(root)
	const leftPreOrder = []
	const rightPreOrder = []
	for (const n of preOrder.slice(1)) {
		const idx = inOrder.findIndex(n)
		if (idx < rootIndex) {
			leftPreOrder.push(n)
		}
		else {
			rightPreOrder.push(n)
		}
	}
	const left = rebuild(inOrder.slice(0, rootIndex), leftPreOrder)
	const right = rebuild(inOrder.slice(rootIndex + 1), rightPreOrder)
	return newNode(root, left, right)
}