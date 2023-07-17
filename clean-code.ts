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
    // 從代码中获取导入
    function getImportsFromCode(code: string): Set<string> {
        const importRegex = /import\s+(?:([a-zA-Z0-9_]+),\s*)?{?\s*(.+?)\s*}?\s*from\s+['"].\/(.+?)['"];/g;

        let match;
        let imports = new Set<string>();
        while ((match = importRegex.exec(code)) !== null) {
            let [fullMatch, defaultImport, importedFunctions, fileName] = match;
            let functions = [];
            if (defaultImport) functions.push(defaultImport);
            if (importedFunctions) functions = functions.concat(importedFunctions.split(',').map(func => func.trim()).filter(Boolean));
            functions.forEach(func => imports.add(`${func} from ${fileName}`));
        }
        return imports;
    }
    return {
        name: 'vite-plugin-clean-dev-code',
        configResolved(resolvedConfig) {
            if (resolvedConfig.command === 'serve') {
                clearCacheDir(); // 清空緩存目錄
            }
        },
        resolveId(id) {
            console.log('resolveId ' + id)
        },
        load(id) {
            //console.log('load' + id)
            if (id.endsWith('index.page.tsx')) {

                const filePath = new URL(id).pathname;
                const originalCode = fs.readFileSync(filePath, 'utf-8');
                const importRegex = /import\s+(?:([a-zA-Z0-9_]+),\s*)?{?\s*(.+?)\s*}?\s*from\s+['"](.+?)['"];/g;

                let match;
                const imports = getImportsFromCode(originalCode);
                while ((match = importRegex.exec(originalCode)) !== null) {
                    let [fullMatch, defaultImport, importedFunctions, fileName] = match;
                    let functions = [];
                    if (defaultImport) functions.push(defaultImport);
                    if (importedFunctions) functions = functions.concat(importedFunctions.split(',').map(func => func.trim()).filter(Boolean));

                    if (fileName.startsWith('./')) {
                        let idPath = path.dirname(id);
                        fileName = path.join(idPath, fileName.replace("./", "")).replace(/.*\\pages\\/, '').replace(/\\/g, '/');

                        if (importedFunctionsMap.has(fileName)) {
                            //console.log(fileName)
                            let existingFunctions = importedFunctionsMap.get(fileName)!;
                            if (functions.length >= 1) {
                                functions.forEach(func => existingFunctions.add(func));
                            }
                        } else {
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
        handleHotUpdate({ server, file }) {
            if (server) {
                const { moduleGraph } = server;

                if (moduleGraph) {
                    const targetPath = 'D:/arkhi/pages';

                    for (let [id, module] of moduleGraph.idToModuleMap) {
                        if (id.includes(targetPath) || (module.file && module.file.includes(targetPath))) {
                            console.log(`Invalidating module: ${module.id}`);
                            moduleGraph.invalidateModule(module);
                            //console.log(`Module file: ${module.file}`);
                            //console.log(module);
                        }
                    }
                }
            }
        },
    }
}