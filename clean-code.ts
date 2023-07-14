import { Plugin } from 'vite';
import { transformSync } from 'esbuild';
import ts from 'typescript';
import path from 'path';
import fs from 'fs';
// 清除冗贅程式
export default function vitePluginCleanDevCode(): Plugin {
    let cacheDir = path.resolve(process.cwd(), './node_modules/.vite'); // 緩存目錄的路徑
    let importMap = new Map<string, Set<string>>(); // 保存每個文件中的 import 語句 使用的函式和文件名

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
            if (id.endsWith('index.page.tsx')) {
                const filePath = new URL(id).pathname; // 獲取模塊的文件路徑
                const rawCode = fs.readFileSync(filePath, 'utf-8'); // 讀取模塊的原始內容

                // 正則表達式匹配 import 語句
                const importRegex = /import\s+({\s*(.+?)\s*})\s*from\s+['"](.+?)['"];/g;
                let match;
                while ((match = importRegex.exec(rawCode)) !== null) {
                    let [fullMatch, fullImport, functionsInBraces, fileName] = match;

                    let functions = functionsInBraces ? functionsInBraces.split(',') : [];
                    if (fileName.startsWith('./')) {
                        let idPath = path.dirname(id);
                        fileName = path.join(idPath, fileName.replace("./", "")).replace(/.*\\pages\\/, '').replace(/\\/g, '/');
                        console.log('Imported functions:', functions);
                        console.log('From file:', fileName);

                        //檢查functions是否有在文件中使用
                        functions = functions.filter(funcName => {
                            // Matches <ComponentName />, <ComponentName></ComponentName>, <ComponentName prop={value} />, and so on.
                            const jsxRegex = new RegExp(`<\\s*${funcName}(\\s+[^>]*|)>`, 'g');
                            // Matches React.createElement(ComponentName, ...)
                            const createElementRegex = new RegExp(`React\\.createElement\\(\\s*${funcName}`, 'g');

                            if (!jsxRegex.test(rawCode) && !createElementRegex.test(rawCode)) {
                                console.log(`Function ${funcName} is not used in the file.`);
                                return false;
                            }
                            return true;
                        });

                        // 將 fileName 添加到 importMap
                        if (importMap.has(fileName)) {
                            // 如果 importMap 已经包含 fileName，将函数添加到现有集合
                            let existingFunctions = importMap.get(fileName)!;  // 使用非空斷言

                            if (functions.length >= 1) {
                                // 如果 functions 包含多个函数（即命名导出），遍历并添加它们
                                functions.forEach(func => existingFunctions.add(func));
                            }
                        } else {
                            // 如果 importMap 不包含 fileName，创建新的集合并添加函数
                            importMap.set(fileName, new Set(functions));
                        }
                    }
                }

            }
            else if (id.includes('pages')) { // 如果是 pages 下非 index.page.tsx 文件
                console.log(id + '\n' + JSON.stringify([...importMap.entries()].map(([key, value]) => [key, [...value]])));
                const filePath = new URL(id).pathname; // 獲取模塊的文件路徑
                const pagesPath = path.join(process.cwd(), 'pages');
                let fileName = path.relative(pagesPath, filePath).replace(/\\/g, '/');
                fileName = fileName.substring(0, fileName.lastIndexOf('.'));  // remove the file extension

                console.log('fileName ' + fileName)
                const rawCode = fs.readFileSync(filePath, 'utf-8'); // 讀取模塊的原始內容
                let modifiedCode = rawCode; // 初始化要找的代碼為原始代碼

                if (importMap.has(fileName)) { // 如果importMap中有這個文件名
                    const exportedNames = importMap.get(fileName)!; // 獲取這個文件名的 import 語句集合

                    // 匹配所有函數名稱
                    const allFunctions = Array.from(rawCode.matchAll(/function (\w+)_\(/g)).map(match => match[1]);

                    allFunctions.forEach(functionName => {
                        if (!exportedNames || !exportedNames.has(functionName)) { // 如果函數沒被使用
                            // 從modifiedCode中移除這個函數
                            modifiedCode = modifiedCode.replace(new RegExp(`function ${functionName}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${functionName} = Island\\(${functionName}_\\);`, 'g'), '');
                        }
                    });
                }
                return modifiedCode;
            }
        },
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
                map: result.map || { mappings: '' }
            };
        },
    }
}
