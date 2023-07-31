import { Plugin } from 'vite';
import path from 'path';
import ts from 'typescript';
function arkhiCleanExports(): Plugin {
    const moduleToExportNames = new Map<string, Set<string>>();
    const specifierArray: string[] = [];
    const functionDeclarationRegex = /function (\w+)_\(/g;

    // Island fuction 的正則表達式
    const createRemovalRegex = (funcName: string) => new RegExp(`function ${funcName}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${funcName} = Island\\(${funcName}_\\);`, 'g');

    return {
        name: 'clean-unused-exports-plugin',
        apply: 'build',
        resolveDynamicImport(specifier) {
            // 檢查導入的頁面模組是否由renderer導入
            if (typeof specifier === 'string' && !specifier.includes('/renderer/')) {
                specifierArray.push(specifier);
            }
        },
        transform(code, id, options) {
            // 如果不是服務端渲染(SSR)構建則返回
            if (options?.ssr != true) return;
            const specifier = specifierArray.find(spec => id.includes(spec));
            if (specifier) {
                const sourceFile = ts.createSourceFile(specifier, code, ts.ScriptTarget.ESNext, true);
                // 遍歷源文件的每一個節點，尋找導入聲明並更新 moduleToExportNames
                ts.forEachChild(sourceFile, node => {
                    if (!ts.isImportDeclaration(node)) return;
                    const moduleSpecifier = node.moduleSpecifier.getText(sourceFile).slice(1, -1);
                    // 如果引入模塊相對路徑不是以'./'或'../'開頭 (本地引入)則返回
                    if (!moduleSpecifier.startsWith('./') && !moduleSpecifier.startsWith('../')) return;
                    const absoluteModuleSpecifier = path.resolve(path.dirname(id), moduleSpecifier).replace(/\\/g, '/') + path.extname(id);
                    if (node.importClause) {
                        const { name, namedBindings } = node.importClause;
                        const exportedNamesSet = moduleToExportNames.get(absoluteModuleSpecifier) || new Set();
                        if (namedBindings && ts.isNamespaceImport(namedBindings)) {
                            exportedNamesSet.add('*');
                        } else if (name) {
                            exportedNamesSet.add(name.getText(sourceFile));
                        } else if (namedBindings && ts.isNamedImports(namedBindings)) {
                            namedBindings.elements.forEach(element => {
                                exportedNamesSet.add((element.propertyName || element.name).getText(sourceFile));
                            });
                        }
                        moduleToExportNames.set(absoluteModuleSpecifier, exportedNamesSet);
                    }
                });
            }
            if (moduleToExportNames.has(id)) {
                const exportedNamesSet = moduleToExportNames.get(id)!;
                if (exportedNamesSet.has('*')) return;
                let modifiedCode = code;
                for (const functionName of code.matchAll(functionDeclarationRegex)) {
                    const funcName = functionName[1];
                    // 只在export函數名不在exportedNamesSet中時替換
                    if (!exportedNamesSet.has(funcName.trim())) {
                        modifiedCode = modifiedCode.replace(createRemovalRegex(funcName), '');
                    }
                }
                return { code: modifiedCode };
            }
        },
    };
}
export { arkhiCleanExports }