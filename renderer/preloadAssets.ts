type AssetType = 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'worker' | 'video';
type declareAsset = { path: string, type: AssetType };
type AssetPath = string | Array<string> | Array<declareAsset>;


const AssetsMap = new Map<string, Set<declareAsset>>();//儲存頁面與其預加載資源

export function preloadAsset(
    paths: AssetPath,// 資源的路徑，可以是一個字串、字串陣列或者包含資源資訊的物件陣列
    page: string = 'allpages',// 資源相關聯的頁面
    assetType?: AssetType,// 資源的類型（可選）
) {
    const assetsSet = getPageAssetSet(page);// 獲取指定頁面的Set

    // 將資源的路徑存進相應頁面的Set裡
    if (assetType && typeof paths === 'string') {
        assetsSet.add({ path: paths, type: assetType });
    } else if (assetType && Array.isArray(paths)) {
        (paths as string[]).forEach(path => {
            assetsSet.add({ path, type: assetType });
        });
    } else {
        (paths as Array<declareAsset>).forEach(asset => {
            assetsSet.add(asset);
        });
    }
}

// 獲取或創建與指定頁面相關的Set
function getPageAssetSet(page: string): Set<declareAsset> {
    if (!AssetsMap.has(page)) {
        AssetsMap.set(page, new Set());
    }
    return AssetsMap.get(page)!;
}

// 生成preload的 HTML 標籤
export function generatePreloadTags(page: string): string {
    const pageAssets = Array.from(AssetsMap.get(page) || []);
    const allAssets = Array.from(AssetsMap.get('allpages') || []).concat(pageAssets);

    // 回傳將資源轉為預加載HTML標籤的字串
    return allAssets
        .map(asset => `<link rel="preload" href="${asset.path}" as="${asset.type}" />`).join('\n');
}