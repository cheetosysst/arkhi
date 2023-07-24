import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

export default function CleanUnusedExportsPlugin(entryFileName: string): Plugin {

    const moduleToExportNames = new Map();// 儲存模組及其對應的輸出函式名稱的Map
    const pageToDependency = new Map();// 儲存頁面與其依賴的Map
    const modifiedCodeMap = new Map();// 儲存已修改程式碼的Map

    // 匹配函數聲明的正則表達式
    const functionDeclarationRegex = /function (\w+)_\(/g;
    // 匹配import語句的正則表達式
    const importStatementRegex = /import\s+(?:([a-zA-Z0-9_]+),\s*)?{?\s*(.+?)\s*}?\s*from\s+['"](.+?)['"];/g;
    // 移除函數內容的正則表達式
    const createRemovalRegex = (funcName: any) => new RegExp(`function ${funcName}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${funcName} = Island\\(${funcName}_\\);`, 'g');

    // 從檔案讀取程式碼的函數
    function readCodeFromFile(fileId: string) {
        const filePath = new URL(fileId).pathname;  // 獲取檔案路徑
        const fileContent = fs.readFileSync(filePath, 'utf-8');  // 讀取檔案內容
        return fileContent;  // 回傳檔案內容
    }

    return {
        name: 'clean-unused-exports-plugin',
        load(fileId) {
            // 如果檔案不是 .js(x) 或 .ts(x) 結尾，則不處理
            if (!/\.[jt]sx?$/.test(fileId)) {
                return;
            }
            // 如果已經有處理過的程式碼，直接回傳
            if (modifiedCodeMap.has(fileId)) {
                return modifiedCodeMap.get(fileId)
            }
            // 如果檔案不在pageToDependency中，並且檔案包含entryFileName
            if (!pageToDependency.has(fileId)) {
                if (fileId.includes(entryFileName)) {
                    const fileContent = readCodeFromFile(fileId);  // 讀取檔案內容
                    for (const match of fileContent.matchAll(importStatementRegex)) {  // 匹配import語句
                        if (match[3].startsWith('./')) {  // 如果開頭為 './' 
                            const modulePath = path.resolve(path.dirname(fileId), match[3]).replace(/\\/g, '/') + path.extname(fileId);  // entryFile裡模組的路徑
                            const exportedNamesSet = moduleToExportNames.get(modulePath) || new Set();  // 獲取或創建該模組的輸出名稱集合
                            const importedNames = [...(match[1] ? [match[1]] : []), ...match[2].split(',').map(func => func.trim())];  // 獲取import的名稱
                            importedNames.forEach(name => exportedNamesSet.add(name));  // 添加到輸出名稱集合
                            moduleToExportNames.set(modulePath, exportedNamesSet);  // 紀錄模組路徑和模組被使用的輸出函式名到moduleToExportNames
                            pageToDependency.set(fileId, modulePath)  // 紀錄目前entryFile所import的文件路徑到pageToDependency
                        }
                    }
                    return fileContent;
                }
            }
            // 如果模組在moduleToExportNames中
            if (moduleToExportNames.has(fileId)) {
                const originalCode = readCodeFromFile(fileId);  // 讀取原始程式碼
                const exportedNamesSet = moduleToExportNames.get(fileId)!;  // 獲取輸出名稱集合
                const exportedNamesArray = Array.from(exportedNamesSet).map(name => (name as string).trim());  // 轉換為陣列

                // 尋找在文件中所有function
                const declaredFunctionNames = Array.from(originalCode.matchAll(functionDeclarationRegex)).map(match => ((match as RegExpMatchArray)[1]));

                // 移除未使用的export const程式碼
                const modifiedCode = declaredFunctionNames.reduce((acc, functionName) => {
                    if (!exportedNamesArray.includes(functionName)) {
                        return acc.replace(createRemovalRegex(functionName), '');
                    }
                    return acc;
                }, originalCode);

                // 將已修改的程式碼儲存到modifiedCodeMap中
                modifiedCodeMap.set(fileId, modifiedCode)
                return modifiedCode;
            }
        },

        // 熱更新時
        handleHotUpdate({ server, file }) {
            if (pageToDependency.has(file)) {  // 如果該檔案在pageToDependency中
                const { moduleGraph } = server;  // 獲取模組圖
                if (moduleGraph) {
                    const modulePath = pageToDependency.get(file);  // 獲取模組path
                    for (const [id, module] of moduleGraph.idToModuleMap) {
                        if (id.startsWith(modulePath)) {  // 如果id以模組path開頭
                            moduleGraph.invalidateModule(module);  // 無效化該模組，使模組path指向的文件reload
                        }
                    }
                    // 從Map中刪除該資訊
                    modifiedCodeMap.delete(modulePath)
                    pageToDependency.delete(file)
                }
            }
        },

        // 構建結束
        buildEnd() {
            // 清理所有的Map
            moduleToExportNames.clear();
            pageToDependency.clear();
            modifiedCodeMap.clear();
        },
    };
}
