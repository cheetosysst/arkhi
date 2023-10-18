import { createRoot } from "react-dom/client";
import React from "react";
import { IslandMap } from "./island.js";
import superjson from "superjson";
import { Link } from "./router.js";

declare global {
	interface Window {
		propString: string;
	}
}

const ISLAND_ATTRIBUTE_ID = "_island_id";

let propsMap: { [id: string]: unknown } = {};

const populate = (parent: Element, component: JSX.Element) => {
	requestIdleCallback(() => {
		const root = createRoot(parent);
		root.render(component);
	});
};

const kebabToCamel = (str: string) => {
	return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const stringToStyle = (styleString: string): Record<string, string> => {
	const styleArray = styleString.split(";").filter(Boolean); // Split the string by semicolon and remove empty elements
	const styleObject = new Map<string, any>();

	for (const style of styleArray) {
		const [property, value] = style.split(":").map((str) => str.trim()); // Split each property-value pair
		styleObject.set(kebabToCamel(property), value); // Use type assertion as any
	}

	return Object.fromEntries(styleObject);
};

const attributesMap = (attributes: NamedNodeMap) => {
	const map = new Map<string, any>();
	for (const item of attributes) {
		let name: string = item.name;
		let value: any = item.value;
		if (name === "style") {
			value = stringToStyle(item.value);
		}
		if (name === "class") {
			name = "className";
		}
		map.set(name, value);
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

		const attributes = attributesMap((currentNode as Element).attributes);
		const islandString = attributes.get(ISLAND_ATTRIBUTE_ID);

		if (islandString) {
			const [islandID, propsID] = islandString.split(":");
			const Component = IslandMap.get(islandID)!;
			const props = propsMap[propsID];

			if (islandID === 'Link_') {
				const childTree = explore(currentNode);
				siblings.push(<Link
					href={(currentNode as HTMLAnchorElement).href}
					{...attributes}
				>
					{childTree.props.children ? childTree : undefined}
				</Link>);
				currentNode = currentNode.nextSibling as Node;
				continue;
			}

			// @ts-ignore
			siblings.push(<Component {...attributes} {...props} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		const childTree = explore(currentNode);

		if (currentNode.nodeName === "BR") {
			siblings.push(<br {...Object.fromEntries(attributes)} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		if (currentNode.nodeName === "IMG") {
			siblings.push(<img {...Object.fromEntries(attributes)} />);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		if (currentNode.nodeName === "A") {
			siblings.push(
				<Link
					href={(currentNode as HTMLAnchorElement).href}
					{...attributes}
				>
					{childTree.props.children ? childTree : undefined}
				</Link>
			);
			currentNode = currentNode.nextSibling as Node;
			continue;
		}

		const component = childTree.props.children
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
	propsMap = superjson.parse(window.propString || "{}");
	walk(node);
}
