import { Plugin } from 'vite';
import path from 'path';
import ts from 'typescript';
// 清除未使用導出插件
function CleanUnusedExportsPlugin(): Plugin {
    const moduleToExportNames = new Map(); // 存儲模塊及其對應的輸出函數名稱的Map
    const specifierArray: string[] = []; // 儲存被動態引入的模組

    // 匹配函數聲明的正則表達式
    const functionDeclarationRegex = /function (\w+)_\(/g;

    // 生成移除函數內容的正則表達式
    const createRemovalRegex = (funcName: any) => new RegExp(`function ${funcName}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${funcName} = Island\\(${funcName}_\\);`, 'g');

    return {
        name: 'clean-unused-exports-plugin',
        apply: 'build', // 只在 build 時使用
        resolveDynamicImport(specifier) {
            // 如果導入的模組不是renderer導入，則將其添加到specifierArray
            if (typeof specifier === 'string' && !specifier.includes('/renderer/')) {
                specifierArray.push(specifier); // 將規範符添加到規範陣列
            }
        },
        transform(code, id, options) {
            // 如果不是為服務端渲染(SSR)構建，則返回
            if (options?.ssr != true) {
                return
            }
            // 如果id包含規範陣列中的任何項，則獲取該規範符
            const specifier = specifierArray.find(spec => id.includes(spec));
            if (specifier) {
                // 解析文件路徑並創建 TypeScript 源文件
                const filePath = path.resolve(path.dirname(id), specifier).replace(/\\/g, '/') + path.extname(id);
                const sourceFile = ts.createSourceFile(
                    filePath,
                    code,
                    ts.ScriptTarget.ESNext, // 指定腳本目標為ESNext
                    true
                );
                // 遍歷源文件的每一個節點，尋找導入聲明並更新 moduleToExportNames
                ts.forEachChild(sourceFile, node => {
                    // 如果節點是導入聲明
                    if (ts.isImportDeclaration(node)) {
                        // 獲取模塊規範符
                        const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
                        // 如果模塊規範符以'./'或'../'開頭
                        if (moduleSpecifier.startsWith('./') || moduleSpecifier.startsWith('../')) {
                            // 解析模組的絕對路徑
                            const absoluteModuleSpecifier = path.resolve(path.dirname(id), moduleSpecifier).replace(/\\/g, '/') + path.extname(id);  // entryFile裡模組的路徑
                            const imports = moduleToExportNames.get(absoluteModuleSpecifier); // 獲取導入的模塊
                            // 若已經有全輸出 '*'，則跳過這個模組
                            if (imports && imports.has('*')) {
                                return;
                            }

                            const importClause = node.importClause; // 獲取導入子句
                            if (importClause) {
                                const exportedNamesSet = moduleToExportNames.get(absoluteModuleSpecifier) || new Set();

                                // 若有使用到全部輸出 '*'
                                if (importClause.namedBindings && ts.isNamespaceImport(importClause.namedBindings)) {
                                    exportedNamesSet.clear(); // 清空導出名稱集合
                                    exportedNamesSet.add('*'); // 添加'*'到導出名稱集合
                                }
                                // 若有指定輸出名稱
                                else if (importClause.name) {
                                    exportedNamesSet.add(importClause.name.getText(sourceFile));
                                }
                                // 如果有命名綁定並且是命名導入
                                else if (importClause.namedBindings && ts.isNamedImports(importClause.namedBindings)) {
                                    const namedImports = importClause.namedBindings;
                                    namedImports.elements.forEach(element => {
                                        // 如果元素有屬性名，則添加到導出名稱集合
                                        if (element.propertyName) {
                                            const importName = element.propertyName.getText(sourceFile);
                                            exportedNamesSet.add(importName);
                                        } else { // 否則添加元素名到導出名稱集合
                                            const importName = element.name.getText(sourceFile);
                                            exportedNamesSet.add(importName);
                                        }
                                    });
                                }
                                // 將絕對模塊規範符和導出名稱集合添加到moduleToExportNames
                                moduleToExportNames.set(absoluteModuleSpecifier, exportedNamesSet);
                            }
                        }
                    }
                });
            }
            // 如果模塊在moduleToExportNames中
            if (moduleToExportNames.has(id)) {
                const exportedNamesSet = moduleToExportNames.get(id)!;  // 獲取導出名稱集合
                // 如果導出名稱集合中不包含'*'
                if (!exportedNamesSet.has('*')) {
                    const exportedNamesArray = Array.from(exportedNamesSet).map(name => (name as string).trim());  // 轉換為陣列
                    // 尋找在文件中所有function
                    const declaredFunctionNames = Array.from(code.matchAll(functionDeclarationRegex)).map(match => ((match as RegExpMatchArray)[1]));
                    // 移除未使用的export const程式碼
                    const modifiedCode = declaredFunctionNames.reduce((acc, functionName) => {
                        // 如果導出名稱陣列中不包含函數名，則移除該函數
                        if (!exportedNamesArray.includes(functionName)) {
                            return acc.replace(createRemovalRegex(functionName), '');
                        }
                        return acc;
                    }, code);
                    // 返回修改後的代碼
                    return { code: modifiedCode };
                }
            }
        },
    };
}
export { CleanUnusedExportsPlugin }
