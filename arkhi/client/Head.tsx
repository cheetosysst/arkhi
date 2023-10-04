import React, { createContext, useContext } from "react";
import type { PropsWithChildren, ReactNode } from "react";

const HeadContext = createContext<Array<ReactNode>>([]);
const heads: Array<ReactNode> = [];

/**
 * Context provider for head tags. Only runs on server-side.
 */
function HeadProvider({ children }: PropsWithChildren) {
	if (typeof window !== undefined) <></>;
	return (
		<HeadContext.Provider value={heads}>{children}</HeadContext.Provider>
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
