type AssetType = 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'worker' | 'video';
type declareAsset = { path: string, type: AssetType };
type AssetPath = string | Array<string> | Array<declareAsset>;

const AllPageAssets = new Set<declareAsset>();
const SpecificPageAssets = new Map<string, Set<declareAsset>>();


export function preloadAsset(
    paths: AssetPath,
    page: string = 'allpages',
    assetType?: AssetType,
) {
    const assetsSet = page === 'allpages' ? AllPageAssets : getPageAssetSet(page);

    if (assetType && typeof paths === 'string') {
        if (!assetExists(paths, assetsSet)) {
            assetsSet.add({ path: paths, type: assetType });
        }
    } else if (assetType && typeof paths[0] === 'string') {
        (paths as string[]).forEach(path => {
            if (!assetExists(path, assetsSet)) {
                assetsSet.add({ path, type: assetType });
            }
        });
    } else {
        (paths as Array<declareAsset>).forEach(asset => {
            if (!assetExists(asset.path, assetsSet)) {
                assetsSet.add(asset);
            }
        });
    }
}

function assetExists(path: string, assetsSet: Set<declareAsset>): boolean {
    for (const asset of assetsSet) {
        if (asset.path === path) {
            return true;
        }
    }
    return false;
}


function getPageAssetSet(page: string): Set<declareAsset> {
    if (!SpecificPageAssets.has(page)) {
        SpecificPageAssets.set(page, new Set());
    }
    return SpecificPageAssets.get(page)!;
}

export function generatePreloadTags(page: string): string {
    const pageAssets = [...(SpecificPageAssets.get(page) || [])];
    const allAssets = [...AllPageAssets, ...pageAssets];

    return allAssets
        .map(asset => `<link rel="preload" href="${asset.path}" as="${asset.type}" />`).join('\n');
}
