import { createRoot } from "react-dom/client";
import React from "react";
import { IslandMap } from "./island";

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
			const oldAttr = new Map();
			const temp: Record<string, string> = {};
			for (let item of attributes) {
				oldAttr.set(item.name, item.value);
				temp[item.name] = item.value;
			}
			// TODO Read PropsMap
			const [islandID, propsID] = islandString.split(":");
			const Component = IslandMap.get(islandID)!;

			const newAttr = { ...oldAttr };

			// @ts-ignore
			siblings.push(<Component {...newAttr} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		
		const newAttr: { [key: string]: string } = {}; 
		// Iterate through attributes and populate the attributes namedNodeMap
		for (let i = 0; i < attributes.length; i++) {
			const attribute = attributes.item(i);
			if (attribute) {
				const reactAttributeName = attribute.name
					.replace(/[-:]/g, '') // Remove hyphens and colons
					.replace(/class/g, 'className') // Convert 'class' to 'className'
					.replace(/for/g, 'htmlFor'); // Convert 'for' to 'htmlFor'

				newAttr[reactAttributeName] = attribute.value;
			}
		}


		const childTree = explore(currentNode);
		const component = React.createElement(
			currentNode.nodeName.toLowerCase(),
			newAttr,
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
		const isIsland = attributes.getNamedItem(ISLAND_ATTRIBUTE_ID)!;

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

export function renderIslands(node: Node) {
	walk(node);
}
