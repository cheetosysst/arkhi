import { Plugin } from 'vite';
import { PathLike, promises as fs } from 'fs';
import path from 'path';
import { compile } from '@mdx-js/mdx';
import matter from 'gray-matter';

let contentDirectoryPath: string

export async function getFilesInDir(dirPath: string, ext: string[]): Promise<string[]> {
	const entries = await fs.readdir(dirPath, { withFileTypes: true });
	const files = await Promise.all(entries.map(async (entry) => {
		const fullPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) {
			return getFilesInDir(fullPath, ext);
		} else if (ext.includes(path.extname(entry.name))) {
			return [fullPath];
		}
		return [];
	}));
	return files.flat();
}

async function generateModuleContent(id: string, fileTypes: string[], virtualId: string) {
	const actualPath = id.replace(virtualId, '');
	let absolutePath = path.join(__dirname, actualPath);
	if (actualPath.startsWith('/content/')) {
		absolutePath = contentDirectoryPath;
	} else {
		contentDirectoryPath = absolutePath;
	}
	const mdFiles = await getFilesInDir(absolutePath, fileTypes);
	const imports = mdFiles.map((filePath, index) => {
		const relativePath = path.relative(path.dirname(id), filePath).replace(/\\/g, '/');
		return `import * as File${index} from '${relativePath}';`;
	}).join('\n');
	const fileObjects = mdFiles.map((_, index) => {
		return `{ 
            component: File${index}.default, 
            metadata: File${index}.metadata 
        }`;
	}).join(', ');

	const exports = `export const allFiles = [${fileObjects}];`;
	return `${imports}\n${exports}`;
}

async function transformMarkdownContent(id: PathLike, code: any) {
	const fileStats = await fs.stat(id);
	const { data, content } = matter(code);
	const chineseCharacters = content.match(/[\u4e00-\u9fa5]/g);
	const chineseCharacterCount = chineseCharacters ? chineseCharacters.length : 0;
	const words = content.replace(/\W+/g, '').length;
	const readTime = (words + chineseCharacterCount) * 0.25;
	const metadata = {
		filePath: id,
		fileName: path.basename(id as string),
		title: data.title,
		author: data.author,
		tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
		description: data.description,
		readTime: readTime,
		status: data.status,
		atime: fileStats.atime,
		mtime: fileStats.mtime,
		ctime: fileStats.ctime,
		createdAt: fileStats.birthtime,
	};
	const result = await compile(content, {
		remarkPlugins: [],
		rehypePlugins: [],
		recmaPlugins: [],
		mdExtensions: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd', '.mdwn', '.mkdown', '.ron'],
		mdxExtensions: ['.mdx'],
		format: 'detect',
		outputFormat: 'program',
		jsxRuntime: 'automatic',
		jsxImportSource: 'react',
	});
	const exportMetadata = `export const metadata = ${JSON.stringify(metadata)};`;
	return result + '\n' + exportMetadata;
}

export default function arkhiCMS(): Plugin {
	return {
		name: 'vite-mdx-plugin',
		async resolveId(source) {
			if (source.endsWith('*.md')) {
				const resolvedId = source.replace('*.md', '@virtual-md-files');
				return resolvedId;
			}
			else if (source.endsWith('*.mdx')) {
				const resolvedId = source.replace('*.mdx', '@virtual-mdx-files');
				return resolvedId;
			}
			else if (source.endsWith('*')) {
				const resolvedId = source.replace('*', '@virtual-files');
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