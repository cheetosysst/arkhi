import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import path from 'path';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';

// 從dirPath指向的檔案夾下獲取所有具有ext擴展名的文檔，返回儲存所有文檔絕對路徑的array
export async function getFilesInDir(dirPath: string, ext: string[]): Promise<string[]> {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	const files = await Promise.all(entries.map(async (entry) => {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			return getFilesInDir(fullPath, ext);
		} else if (ext.includes(path.extname(entry.name))) {
			return fullPath;
		}
		return [];
	}));
	return files.flat();
}

// 生成一個vitural module，該module將導入指定的所有Markdown文件，並將它們導出為一個array內容
async function generateModuleContent(id: string, fileTypes: string[], virtualId: string) {
	const actualPath = id.replace(virtualId, '');
	let absolutePath = path.join(__dirname, actualPath);
	if (__dirname.endsWith('plugins')) {
		const arkhiPluginsPath = ['arkhi', 'plugins'].join(path.sep);
		absolutePath = absolutePath.replace(arkhiPluginsPath, path.sep);
	}
	const mdFiles = await getFilesInDir(absolutePath, fileTypes);
	// 生成文件的import，將文件內容引入
	const imports = mdFiles.map((filePath, index) => {
		const relativePath = path.relative(path.dirname(id), filePath).replace(/\\/g, '/');
		return `import * as File${index} from '${relativePath}';`;
	}).join('\n');
	// 文件內容以及文件metadata
	const fileObjects = mdFiles.map((_, index) => {
		return `{ 
            component: File${index}.default, 
            metadata: File${index}.metadata 
        }`;
	}).join(', ');
	const exports = `export const allFiles = [${fileObjects}];`;// 導出所有fileObject內容
	return `${imports}\n${exports}`;
}

// 將Markdown內容轉換為JSX，並將相應文件的metadata添加到程式導出的內容裡
async function transformMarkdownContent(id: string, code: string) {
	const fileStats = await fs.stat(id);
	const { data, content } = matter(code);// 使用gray-matter庫解析Markdown文件的front matter和content
	// content中的所有中文字處理
	const chineseCharacters = content.match(/[\u4e00-\u9fa5]/g);
	const chineseCharacterCount = chineseCharacters ? chineseCharacters.length : 0;

	// 計算content中的字數和閱讀時間
	const words = content.replace(/\W+/g, '').length;
	const readTime = (words + chineseCharacterCount) * 0.25;

	const metadata = {
		filePath: id,
		fileName: path.basename(id as string),
		title: data.title,
		author: data.author,
		tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
		description: data.description,
		readTime: readTime, // 文件的閱讀時間，單位為秒
		status: data.status,
		atime: fileStats.atime, // 文件的上次訪問時間
		mtime: fileStats.mtime, // 文件的上次修改時間
		ctime: fileStats.ctime, // 文件的創建時間(最後修改metadata時間)
		createdAt: fileStats.birthtime, // 文件本體的實際創建時間
	};
	// 使用@mdx-js/mdx將Markdown content轉為JSX 
	// https://mdxjs.com/packages/mdx/#compilefile-options
	const result = await compile(content, {
		remarkPlugins: [],
		rehypePlugins: [],
		recmaPlugins: [],
		mdExtensions: ['.md'],
		mdxExtensions: ['.mdx'],
		format: 'detect',
		outputFormat: 'program',
		jsxRuntime: 'automatic',
		jsxImportSource: 'react',
	});
	const exportMetadata = `export const metadata = ${JSON.stringify(metadata)};`;
	return result + '\n' + exportMetadata;// 返回轉換後的JSX和導出的metadata
}

export default function arkhiCMS(): Plugin {
	return {
		name: 'vite-mdx-plugin',
		async resolveId(source) {
			// 根據import的方式返回不同的resolvedId，import可以篩選所有來自md或mdx檔案、或找全部內容
			if (source.endsWith('*.md')) {
				const resolvedId = source.replace('*.md', '@virtual-md-files');
				return resolvedId;
			}
			else if (source.endsWith('*.mdx')) {
				const resolvedId = source.replace('*.mdx', '@virtual-mdx-files');
				return resolvedId;
			}
			else if (source.endsWith('*.markdown')) {
				const resolvedId = source.replace('*.markdown', '@virtual-files');
				return resolvedId;
			}
		},
		async load(id) {
			if (id.includes('@virtual-md-files')) {
				return generateModuleContent(id, ['.md'], '@virtual-md-files');
			}
			else if (id.includes('@virtual-mdx-files')) {
				return generateModuleContent(id, ['.mdx'], '@virtual-mdx-files');
			}
			else if (id.includes('@virtual-files')) {
				return generateModuleContent(id, ['.md', '.mdx'], '@virtual-files');
			}
		},
		async transform(code, id) {
			if (id.endsWith('.md') || id.endsWith('.mdx')) {
				return transformMarkdownContent(id, code);
			}
		},
	};
}
