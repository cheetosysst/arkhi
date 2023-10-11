import React from "react";
import type { PropsWithChildren } from "react";
import { HeadProvider } from "./Head.js";

export * from "./router.js";
export * from "./island.js";
export * from "./client.js";

export { Head } from "./Head.js";
export function ArkhiProvider({ children }: PropsWithChildren) {
	return <HeadProvider>{children}</HeadProvider>;
}
