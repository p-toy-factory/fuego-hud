export function append(node: HTMLElement, children: Node[]) {
	node.append(...children);
	return node;
}
