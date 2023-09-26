import React from "react";
import type { PropsWithChildren } from "react";
import { HeadProvider } from "./Head";

export * from "./router";
export * from "./island";
export * from "./client";

export { Head } from "./Head";
export function ArkhiProvider({ children }: PropsWithChildren) {
	return <HeadProvider>{children}</HeadProvider>;
}
