import React, { createContext, useContext, PropsWithChildren } from "react";

type AssetType =
	| "audio"
	| "document"
	| "embed"
	| "fetch"
	| "font"
	| "image"
	| "object"
	| "script"
	| "style"
	| "track"
	| "worker"
	| "video";

type Asset = { path: string; type: AssetType };
type AssetPath = string | Array<string> | Array<Asset>;

const assets = new Set<Asset>();
const PreloadContext = createContext(assets);

export function PreloadProvider({ children }: PropsWithChildren) {
	return (
		<PreloadContext.Provider value={assets}>
			{children}
		</PreloadContext.Provider>
	);
}
// 取得資源的路徑和資源的類型（可選）
export function usePreload(paths: AssetPath, assetType?: AssetType) {
	assets.clear(); // 每次使用usePreload就將之前儲存的內容清空
	const contextAssetsSet = useContext(PreloadContext);

	// 將資源的路徑存進AssetsSet裡
	if (assetType === undefined) {
		(paths as Array<Asset>).forEach((asset) => {
			contextAssetsSet.add(asset);
		});
		return;
	}

	if (typeof paths === "string") {
		contextAssetsSet.add({ path: paths, type: assetType });
		return;
	}

	if (Array.isArray(paths)) {
		(paths as string[]).forEach((path) => {
			contextAssetsSet.add({ path, type: assetType });
		});
		return;
	}
}
// 生成preload的 HTML 標籤
export function generatePreloadTags() {
	return Array.from(assets).map((asset, index) => (
		<link
			rel="preload"
			key={`${index}${asset.path}`}
			href={asset.path}
			as={asset.type}
		/>
	));
}
// 清除assetsSet
export function clearAssetSet() {
	assets.clear();
}
