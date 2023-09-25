import React from "react";
import type { ComponentType } from "react";

export type IslandProps = { _island_id?: string };
export type IslandComponent<T> = ComponentType<T & IslandProps>;

export const IslandMap = new Map<string, ComponentType<any>>();
export const IslandProps = new Map<string, Object>();

/**
 * Generates an island component that can be hydrated on the frontend.
 * @param Component React Component to convert into a island component.
 * @param prefix Optional prefix in case there is a name conflict
 * @returns Island component
 */
export function Island<T extends object>(
	Component: ComponentType<T & IslandProps>,
	prefix: string = ""
): IslandComponent<T> {
	const islandID = `${prefix}${Component.name}`;
	IslandMap.set(islandID, Component);

	const NewComponent: ComponentType<T & IslandProps> = (props: T) => {
		const propsID = hash(`${islandID}${JSON.stringify(props)}`);
		IslandProps.set(propsID, props);
		return <Component {...props} _island_id={`${islandID}:${propsID}`} />;
	};

	return NewComponent;
}

function hash(str: string): string {
	let p = 5381;
	for (const item of str) p = (p * 33) ^ item.charCodeAt(0);
	return (p >>> 0).toString(16);
}
