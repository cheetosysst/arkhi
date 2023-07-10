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
		children: [] as unknown as ContentNode,
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
				children: [] as unknown as ContentNode,
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

function compileMetadata(): Content {
	const contentDirectory = path.join(process.cwd(), "/content");
	const contentSystem = parseContents(contentDirectory);
	return contentSystem;
}

function arkhiCMS(): Plugin {
	contents;
	return {
		name: "vite-plugin-arkhi-cms",
		buildStart() {
			contents.root = compileMetadata();
		},
		enforce: "pre",
		configureServer({ watcher }) {
			watcher.add(`${process.cwd}/content/**`);
			watcher.on("change", (filePath) => {
				// TODO 在更新檔案時，更新該位置的樹
				contents.root = compileMetadata();
			});
		},
	};
}

const contents = {
	root: {
		children: [] as unknown as ContentNode,
		name: "",
		path: "",
		type: "",
		assets: [],
		config: undefined,
	} as Content,
};

export { arkhiCMS, contents };
export type { Content, ContentNode, ArticleConfig };
