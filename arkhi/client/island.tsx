import React from "react";
import { ComponentType } from "react";

export type IslandProps = { _island_id: string };

export const IslandMap = new Map<string, ComponentType<any>>();

export function Island<T extends object>(
	Component: ComponentType<T & IslandProps>
) {
	const name = Component.name;
	IslandMap.set(name, Component);
	const NewComponent: ComponentType<T> = (props: T) => {
		const additionalProp: IslandProps = { _island_id: name };
		return <Component {...props} {...additionalProp} />;
	};

	return NewComponent;
}
