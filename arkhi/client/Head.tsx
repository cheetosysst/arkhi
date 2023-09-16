import React from "react";
import { usePageContext } from "../../renderer/usePageContext";
import type { PropsWithChildren } from "react";

/**
 * HOC component for defining `<head>`.
 * @returns Empty react fragment
 */
function Head({ children }: PropsWithChildren) {
	if (typeof window !== "undefined") return <></>;
	const pageContext = usePageContext();
	if (pageContext.Head === undefined) pageContext.Head = [];
	pageContext.Head.push(children);
	return <></>;
}

export { Head };
