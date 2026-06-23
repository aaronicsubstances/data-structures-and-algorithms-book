const rebuild = (inOrder, postOrder) => {

	const root = postOrder[postOrder.length -1]
	const rootIndex = inOrder.findIndex(root)
	const leftPostOrder = []
	const rightPostOrder = []
	for (const n of postOrder.slice(0, postOrder.length - 1)) {
		const idx = inOrder.findIndex(n)
		if (idx < rootIndex) {
			leftPostOrder.push(n)
		}
		else {
			rightPostOrder.push(n)
		}
	}
	const left = rebuild(inOrder.slice(0, rootIndex), leftPostOrder)
	const right = rebuild(inOrder.slice(rootIndex + 1), rightPostOrder)
	return newNode(root, left, right)
}