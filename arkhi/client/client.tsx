import { createRoot } from "react-dom/client";
import React from "react";
import { IslandMap, IslandProps } from "./island";

const ISLAND_ATTRIBUTE_ID = "_island_id";

let propsMap: { [id: string]: unknown } = {};

const populate = (parent: Element, component: JSX.Element) => {
	requestIdleCallback(() => {
		const root = createRoot(parent);
		root.render(component);
	});
};

const attributesMap = (attributes: NamedNodeMap) => {
	const map = new Map<string, string>();
	for (const item of attributes) {
		map.set(item.name, item.value);
	}
	return map;
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

		const attributes = attributesMap((currentNode as Element).attributes);
		const islandString = attributes.get(ISLAND_ATTRIBUTE_ID);

		if (islandString) {
			// TODO Read PropsMap
			const [islandID, propsID] = islandString.split(":");
			const Component = IslandMap.get(islandID)!;
			const props = propsMap[propsID];

			// @ts-ignore
			siblings.push(<Component {...attributes} {...props} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		const childTree = explore(currentNode);
		const component = childTree.props.children.length
			? React.createElement(
					currentNode.nodeName.toLowerCase(),
					Object.fromEntries(attributes),
					childTree
			  )
			: React.createElement(
					currentNode.nodeName.toLowerCase(),
					Object.fromEntries(attributes)
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
	propsMap = JSON.parse(
		document
			.getElementById("arkhiProps")
			?.attributes.getNamedItem("data-setting")?.value || "{}"
	);
	walk(node);
}
