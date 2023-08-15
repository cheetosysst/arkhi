import { Plugin } from "vite";
import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
const postExtensions = [".md", ".mdx"];

//文章的metadata
type ArticleConfig = {
	title: string;
	created: Date;
	edited: Date;
	author: string;
	tags: string[];
};

type ContentNode = {
	[key: string]: Content;
};

type Content = {
	children: ContentNode;
	path: string; //檔案路徑
	name: string;
	type: string; //檔案類型（副檔名）
	assets: string[]; //檔案相關的資源
	config?: ArticleConfig; //檔案的相關配置（如果有）
};

function parseConfig(directory: string): ArticleConfig | undefined {
	const configPath = path.join(directory, "config.json");
	try {
		const configData = readFileSync(configPath, "utf-8");
		const config = JSON.parse(configData);
		// TODO Use zod to parse config
		return config;
	} catch (e) {
		console.warn("Config not found on", directory);
		return undefined;
	}
}

//讀取資料夾，建立CMS資料內容
function parseContents(directory: string): Content {
	const files = readdirSync(directory);
	const content: Content = {
		children: {},
		name: path.parse(directory).base,
		path: "",
		type: "",
		assets: [],
		config: undefined,
	};

	files.forEach((file) => {
		const filePath = path.join(directory, file);
		const fileStat = statSync(filePath);

		// Check directory first, in case a direcory is named like a file.
		if (fileStat.isDirectory()) {
			content.children[file] = parseContents(filePath);
			return;
		}

		if (file === "config.json") {
			content.config = parseConfig(directory);
			return;
		}

		const pathInfo = path.parse(file);
		const isContent = postExtensions.includes(pathInfo.ext);

		if (pathInfo.name === "index" && isContent) {
			content.name = path.parse(directory).base;
			content.path = filePath;
			content.type = pathInfo.ext;
			return;
		}

		if (isContent) {
			content.children[file] = {
				children: {},
				name: pathInfo.name,
				path: filePath,
				type: pathInfo.ext,
				assets: [],
				config: undefined,
			};
			return;
		}

		content.assets.push(filePath);
	});

	return content;
}

export function compileMetadata(): Content {
	const contentDirectory = path.join(process.cwd(), "/content");
	const contentSystem = parseContents(contentDirectory);
	return contentSystem;
}

function arkhiCMS(): Plugin {
	let contents = {
		root: compileMetadata()
	};
	return {
		name: "vite-plugin-arkhi-cms",

		configureServer(server) {
			// 提供API端點供前端訪問CMS內容
			server.middlewares.use('/contents', (req, res, next) => {
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify(contents.root));
			});
		},
		resolveId(id) {
			if (id === 'virtual:contents') return id;
		},

		load(id) {
			if (id === 'virtual:contents') {
				const jsonString = JSON.stringify(contents.root);
				return `export default ${jsonString}`;
			}
		},
		handleHotUpdate({ file, server }) {
			if (file.includes('/content/')) {
				contents.root = compileMetadata(); // 更新 contents.root
				const mod = server.moduleGraph.getModuleById('virtual:contents');
				if (mod) {
					server.moduleGraph.invalidateModule(mod); // 無效化該模塊，使模塊path指向的文件reload
					mod.importers.forEach((importer) => {
						server.moduleGraph.invalidateModule(importer);
					});
				}
			}
		},
	};
}

export const contents = {
	root: compileMetadata()
};
export { arkhiCMS };
export type { Content, ContentNode, ArticleConfig };
