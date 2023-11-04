import React, { createContext, useContext } from "react";
import type { PropsWithChildren, ReactNode } from "react";

export const PageHeads: Array<ReactNode> = [];
const HeadContext = createContext<Array<ReactNode>>(PageHeads);

/**
 * Context provider for head tags. Only runs on server-side.
 */
function HeadProvider({ children }: PropsWithChildren) {
	if (typeof window !== undefined) <></>;
	return (
		<HeadContext.Provider value={PageHeads}>
			{children}
		</HeadContext.Provider>
	);
}

/**
 * HOC component for defining `<head>`.
 * @returns Empty react fragment
 */
function Head({ children }: PropsWithChildren) {
	if (typeof window !== "undefined") return <></>;
	const headContext = useContext(HeadContext);
	headContext.push(children);
	return <></>;
}

export { Head, HeadProvider };
