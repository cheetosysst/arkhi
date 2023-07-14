import { Plugin } from 'vite';
import { transformSync } from 'esbuild';
import path from 'path';
import fs from 'fs';

// 清除冗贅程式
export default function vitePluginCleanDevCode(): Plugin {
    let cacheDir = path.resolve(process.cwd(), './node_modules/.vite'); // 緩存目錄的路徑
    let importedFunctionsMap = new Map<string, Set<string>>(); // 保存每個文件中的 import 語句 使用的函式和文件名

    // 清空缓存目錄
    function clearCacheDir() {
        if (fs.existsSync(cacheDir)) { // 如果緩存目錄存在
            console.log('clean chache')
            fs.rmSync(cacheDir, { recursive: true, force: true }); // 刪除緩存目錄
        }
        fs.mkdirSync(cacheDir, { recursive: true }); // 創建緩存目錄
    }

    return {
        name: 'vite-plugin-clean-dev-code',
        configResolved(resolvedConfig) {
            if (resolvedConfig.command === 'serve') {
                clearCacheDir(); // 清空緩存目錄
            }
        },
        async load(id) {
            if (id.endsWith('index.page.tsx')) {// 檢查每個 index.page.tsx
                const filePath = new URL(id).pathname; // 獲取模塊的文件路徑
                const originalCode = fs.readFileSync(filePath, 'utf-8'); // 讀取模塊的原始內容
                const importRegex = /import\s+({\s*(.+?)\s*})\s*from\s+['"](.+?)['"];/g;
                let match;
                // 檢查程式內的import內容
                while ((match = importRegex.exec(originalCode)) !== null) {
                    let [fullMatch, importStatement, importedFunctions, fileName] = match;

                    // 將 import 語句中的函式名稱切分為陣列
                    let functions = importedFunctions ? importedFunctions.split(',') : [];
                    if (fileName.startsWith('./')) {
                        let idPath = path.dirname(id);
                        fileName = path.join(idPath, fileName.replace("./", "")).replace(/.*\\pages\\/, '').replace(/\\/g, '/');

                        // 將 fileName 添加到 importedFunctionsMap
                        if (importedFunctionsMap.has(fileName)) {
                            // 如果 importedFunctionsMap 已经包含 fileName，將函式添加到已存在的 Set 中
                            let existingFunctions = importedFunctionsMap.get(fileName)!;

                            if (functions.length >= 1) {
                                // 如果 import 語句中包含多個函式名稱，則添加所有函式到 Set 中
                                functions.forEach(func => existingFunctions.add(func));
                            }
                        } else {
                            // 如果 importedFunctionsMap 不包含 fileName，則創建一個新的 Set 並添加函式
                            importedFunctionsMap.set(fileName, new Set(functions));
                        }
                    }
                }

            }
            else if (id.includes('pages')) { // 對 'pages' 目錄下的非 index.page.tsx 文件進行處理
                const filePath = new URL(id).pathname;
                const pagesPath = path.join(process.cwd(), 'pages');
                let fileName = path.relative(pagesPath, filePath).replace(/\\/g, '/');
                fileName = fileName.substring(0, fileName.lastIndexOf('.'));

                const originalCode = fs.readFileSync(filePath, 'utf-8'); // 讀取模塊的原始內容
                let modifiedCode = originalCode; // 將要返回的代碼初始化為原始代碼

                if (importedFunctionsMap.has(fileName)) { // 如果 importedFunctionsMap 中包含此文件名
                    const exportedNames = importedFunctionsMap.get(fileName)!;
                    const exportedNamesArray = Array.from(exportedNames).map(name => name.trim());

                    // 匹配所有函數名稱
                    const allFunctions = Array.from(originalCode.matchAll(/function (\w+)_\(/g)).map(match => match[1]);
                    allFunctions.forEach(functionName => {
                        if (!exportedNamesArray.includes(functionName)) { // 如果函數名稱不存在於 exportedNamesArray
                            modifiedCode = modifiedCode.replace(new RegExp(`function ${functionName}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${functionName} = Island\\(${functionName}_\\);`, 'g'), '');
                        }
                    });
                }
                return modifiedCode;
            }
        },
        // 對 .ts/.tsx 文件進行轉換
        transform(code, id) {
            if (!/\.[jt]sx?$/.test(id)) {
                return;
            }
            const result = transformSync(code, {
                loader: 'tsx',
                target: 'esnext',
                charset: 'utf8',
                minify: false,
                legalComments: 'none',
            });

            let transformedCode = result.code;

            return {
                code: transformedCode,
                map: result.map || { mappings: '' }// 返回空的來源映射
            };
        },
    }
}
