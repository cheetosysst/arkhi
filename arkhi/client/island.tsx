import React, { FunctionComponent } from "react";
import { ComponentType } from "react";

export type IslandProps = { _island_id?: string };

export const IslandMap = new Map<string, ComponentType<any>>();
export const IslandProps = new Map<string, Object>();

export function Island<T extends object>(
	namespace: string,
	Component: FunctionComponent<T & IslandProps> | FunctionComponent<T>
): FunctionComponent<T & IslandProps> | FunctionComponent<T> {
	const islandID = hash(`${namespace}${Component.name}`);
	IslandMap.set(islandID, Component);

	const NewComponent: ComponentType<T & IslandProps> = (props: T) => {
		const propsID = hash(`${islandID}${JSON.stringify(props)}`);
		IslandProps.set(propsID, props);
		// TODO create prop map
		return <Component {...props} _island_id={`${islandID}:${propsID}`} />;
	};

	return NewComponent;
}

function hash(str: string): string {
	let p = 5381;
	for (const item of str) p = (p * 33) ^ item.charCodeAt(0);
	return (p >>> 0).toString(16);
}
