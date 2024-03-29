import React from "react";
import type { PropsWithChildren } from "react";
import { HeadProvider } from "./Head.js";
import { PreloadProvider } from "./preload.js";

export * from "./router.js";
export * from "./island.js";
export * from "./client.js";
export { generatePreloadTags, clearAssetSet } from "./preload.js";
export * from "./useShare.js";

export { Head, PageHeads } from "./Head.js";
export function ArkhiProvider({ children }: PropsWithChildren) {
	return (
		<HeadProvider>
			<PreloadProvider>{children}</PreloadProvider>
		</HeadProvider>
	);
}
