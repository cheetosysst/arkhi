import { Plugin } from "vite";
import path from "path";
import ts from "typescript";

function arkhiCleanExports(): Plugin {
	const moduleToExportNames = new Map<string, Set<string>>();
	const specifiers: string[] = [];
	const functionDeclarationRegex = /function (\w+)_\(/g;

	// Island function 的正則表達式
	const createRemovalRegex = (name: string) =>
		new RegExp(
			`function ${name}_\\([\\s\\S]*?\\) \\{[\\s\\S]*?\\}[\\s\\S]*?export const ${name} = Island\\(${name}_\\);`,
			"g"
		);

	return {
		name: "clean-unused-exports-plugin",
		apply: "build",
		resolveDynamicImport(specifier) {
			// 檢查導入的頁面模組是否由renderer導入
			if (
				typeof specifier === "string" &&
				!specifier.includes("/renderer/")
			) {
				specifiers.push(specifier);
			}
		},
		transform(code, id, options) {
			if (options?.ssr != true) return;
			const specifier = specifiers.find((spec) => id.includes(spec));
			if (specifier) {
				const sourceFile = ts.createSourceFile(
					specifier,
					code,
					ts.ScriptTarget.ESNext,
					true
				);
				// 遍歷源文件的每一個節點，尋找導入聲明並更新 moduleToExportNames
				ts.forEachChild(sourceFile, (node) => {
					if (!ts.isImportDeclaration(node)) return;
					const moduleSpecifier = node.moduleSpecifier
						.getText(sourceFile)
						.slice(1, -1);
					// 如果引入模塊相對路徑不是以'./'或'../'開頭 (本地引入)則返回
					if (
						!moduleSpecifier.startsWith("./") &&
						!moduleSpecifier.startsWith("../")
					)
						return;
					const absoluteModuleSpecifier =
						path
							.resolve(path.dirname(id), moduleSpecifier)
							.replace(/\\/g, "/") + path.extname(id);
					if (node.importClause) {
						const { name, namedBindings } = node.importClause;
						const exportedNamesSet =
							moduleToExportNames.get(absoluteModuleSpecifier) ||
							new Set();
						if (
							namedBindings &&
							ts.isNamespaceImport(namedBindings)
						) {
							exportedNamesSet.add("*");
						} else if (name) {
							exportedNamesSet.add(name.getText(sourceFile));
						} else if (
							namedBindings &&
							ts.isNamedImports(namedBindings)
						) {
							namedBindings.elements.forEach((element) => {
								exportedNamesSet.add(
									(
										element.propertyName || element.name
									).getText(sourceFile)
								);
							});
						}
						moduleToExportNames.set(
							absoluteModuleSpecifier,
							exportedNamesSet
						);
					}
				});
			}
			if (moduleToExportNames.has(id)) {
				const exportedNamesSet = moduleToExportNames.get(id)!;
				if (exportedNamesSet.has("*")) return;
				let modifiedCode = code;
				for (const functionName of code.matchAll(
					functionDeclarationRegex
				)) {
					const funcName = functionName[1];
					// 只在 export 函數名不在 exportedNamesSet 中時替換
					if (exportedNamesSet.has(funcName.trim())) continue;
					modifiedCode = modifiedCode.replace(
						createRemovalRegex(funcName),
						""
					);
				}
				return { code: modifiedCode };
			}
		},
	};
}
export { arkhiCleanExports };
