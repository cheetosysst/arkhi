import { createRoot } from "react-dom/client";
import React from "react";

let islandsComponents: Map<string, React.FunctionComponent>;
const ISLAND_ATTRIBUTE_ID = "_island_id";

const populate = (parent: Element, component: JSX.Element) => {
	requestIdleCallback(() => {
		const root = createRoot(parent);
		root.render(component);
	});
};

const explore = (parentNode: Node) => {
	const siblings: JSX.Element[] = [];
	let currentNode = parentNode.firstChild as Node;

	while (currentNode) {
		if (currentNode === null || currentNode.nodeType === Node.COMMENT_NODE)
			break;

		if (currentNode.nodeType === Node.TEXT_NODE) {
			siblings.push(<>{currentNode.nodeValue}</>);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		if (currentNode.nodeName === "BR") {
			siblings.push(<br />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		const attributes = (currentNode as Element).attributes;
		const islandString =
			attributes.getNamedItem(ISLAND_ATTRIBUTE_ID)?.value;

		if (islandString) {
			const [islandName, islandId] = islandString.split(":");
			const IslandType = islandsComponents.get(islandName);
			//@ts-expect-error
			siblings.push(<IslandType {...attributes} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		const childTree = explore(currentNode);
		const component = React.createElement(
			currentNode.nodeName.toLowerCase(),
			attributes,
			childTree
		);

		siblings.push(component);
		currentNode = currentNode.nextSibling as Node;
	}

	return <>{...siblings}</>;
};

/**
 * Walk through the whole DOM from `node`, until every level 1 islands are found.
 * @param node Current node
 */
const walk = (node: Node | null) => {
	if (node?.nodeType !== Node.TEXT_NODE && (node as Element).attributes) {
		const attributes = (node as Element).attributes;
		const isIsland = attributes.getNamedItem("_island_id")!;

		if (isIsland) {
			// An island is found, no need to dig further down.
			const islandMap = explore(node!.parentNode!);
			populate(node?.parentElement as Element, islandMap);
			return;
		}
	}

	const nextSibling = node!.nextSibling;
	const firstChild = node!.firstChild;

	if (nextSibling) walk(nextSibling);
	if (firstChild) walk(firstChild);
};

export default function render(node: Node) {
	walk(node);
}

export const tempIslandInsert = (map: Map<string, React.FunctionComponent>) => {
	islandsComponents = map;
};
