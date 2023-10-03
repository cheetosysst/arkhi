type AssetType = 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'worker' | 'video';

const globalPreloadAssets = new Set<{ path: string, type: AssetType }>();
const pagePreloadAssets = new Map<string, Set<{ path: string, type: AssetType }>>();

export function preloadAsset(
    page: string,
    paths: Array<{ path: string; hint: boolean; type: AssetType }>,
    global: boolean
) {
    const assetsSet = global ? globalPreloadAssets : getPageAssetsSet(page);
    paths.forEach(asset => {
        assetsSet.add(asset);
    });
}

function getPageAssetsSet(page: string): Set<{ path: string, type: AssetType }> {
    if (!pagePreloadAssets.has(page)) {
        pagePreloadAssets.set(page, new Set());
    }
    return pagePreloadAssets.get(page)!;
}

export function getPreloadTags(page: string): string {
    const pageAssets = [...(pagePreloadAssets.get(page) || [])];
    const allAssets = [...globalPreloadAssets, ...pageAssets];

    return allAssets
        .map(asset => `<link rel="preload" href="${asset.path}" as="${asset.type}" />`).join('\n');
}
