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

let propsMap: Record<string, object> = {};

const populate = (parent: Element, component: JSX.Element) =>
	requestIdleCallback(() => createRoot(parent).render(component));

const kebabToCamel = (str: string) =>
	str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const stringToStyle = (styleString: string): Record<string, string> => {
	const styleArray = styleString.split(";").filter(Boolean); // Split the string by semicolon and remove empty elements
	const styleObject = new Map<string, string>();

	for (const style of styleArray) {
		const [property, value] = style.split(":").map((str) => str.trim()); // Split each property-value pair
		styleObject.set(kebabToCamel(property), value); // Use type assertion as any
	}

	return Object.fromEntries(styleObject);
};

const convertionTable: Record<string, string> = {
	class: "className",
	for: "htmlFor",
	"stroke-width": "strokeWidth",
	"stroke-dasharray": "strokeDasharray",
	"stroke-dashoffset": "strokeDashoffset",
	"stroke-linecap": "strokeLinecap",
	"stroke-linejoin": "strokeLinejoin",
	"stop-color": "stopColor",
	"text-anchor": "textAnchor",
	"clip-path": "clipPath",
	"xlink:href": "xlinkHref",
	"xmlns:xlink": "xmlnsXlink",
};

const attributesMap = (attributes: NamedNodeMap) => {
	const attrs = new Map<string, string | Record<string, string>>();
	for (const item of attributes) {
		const name: string = convertionTable[item.name] || item.name;
		const value = name !== "style" ? item.value : stringToStyle(item.value);
		attrs.set(name, value);
	}
	return attrs;
};

const explore = (parentNode: Node) => {
	const siblings: JSX.Element[] = [];
	let currentNode = parentNode.firstChild;

	while (currentNode) {
		if (currentNode === null || currentNode.nodeType === Node.COMMENT_NODE)
			break;

		if (currentNode.nodeType === Node.TEXT_NODE) {
			siblings.push(<>{currentNode.nodeValue}</>);
			currentNode = currentNode.nextSibling;
			continue;
		}

		const attributes = attributesMap((currentNode as Element).attributes);
		const islandString = attributes.get(ISLAND_ATTRIBUTE_ID);

		if (islandString) {
			const [islandID, propsID] = (islandString as string).split(":");
			const Component = IslandMap.get(islandID)!;
			const props = propsMap[propsID];

			if (islandID === "Link_") {
				const childTree = explore(currentNode);
				siblings.push(
					<Link
						href={(currentNode as HTMLAnchorElement).href}
						{...Object.fromEntries(attributes)}
					>
						{childTree.props.children ? childTree : undefined}
					</Link>
				);
				currentNode = currentNode.nextSibling;
				continue;
			}

			siblings.push(
				<Component {...Object.fromEntries(attributes)} {...props} />
			);
			currentNode = currentNode.nextSibling;
			continue;
		}

		const childTree = explore(currentNode);

		if (currentNode.nodeName === "BR") {
			siblings.push(<br {...Object.fromEntries(attributes)} />);
			currentNode = currentNode.nextSibling;
			continue;
		}

		if (currentNode.nodeName === "IMG") {
			siblings.push(<img {...Object.fromEntries(attributes)} />);
			currentNode = currentNode.nextSibling;
			continue;
		}

		if (currentNode.nodeName === "A") {
			siblings.push(
				<Link
					href={(currentNode as HTMLAnchorElement).href}
					{...Object.fromEntries(attributes)}
				>
					{childTree.props.children ? childTree : undefined}
				</Link>
			);
			currentNode = currentNode.nextSibling;
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
		currentNode = currentNode.nextSibling;
	}
	return <>{...siblings}</>;
};

/**
 * Walk through the whole DOM from `node`, until every level 1 islands are found.
 * @param node Current node
 */
const walk = (node: Node | null) => {
	if (!node) return;
	if (node.nodeType !== Node.TEXT_NODE && (node as Element).attributes) {
		const attributes = (node as Element).attributes;
		const isIsland = attributes.getNamedItem(ISLAND_ATTRIBUTE_ID);

		if (isIsland) {
			const islandMap = explore(node.parentNode!);
			populate(node.parentElement!, islandMap);
			return;
		}
	}

	const nextSibling = node.nextSibling;
	const firstChild = node.firstChild;

	if (nextSibling) walk(nextSibling);
	if (firstChild) walk(firstChild);
};

/**
 * Starts rendering process for islands.
 * @param node Starting point of render
 */
export function renderIslands(node: Node) {
	propsMap = superjson.parse(window.propString || "{}");
	walk(node);
}
