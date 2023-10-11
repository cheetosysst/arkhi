interface MDXMetadata {
	filePath: string;
	fileName: string;
	title: string;
	author: string;
	tags: string[];
	description: string;
	readTime: number;
	status: string;
	atime: Date;
	mtime: Date;
	ctime: Date;
	createdAt: Date;
}
type MDXFile = {
	component: (props: PropsWithChildren<any>) => JSX.Element;
	metadata: MDXMetadata;
};

declare module "*.mdx" {
	let MDXComponent: (props: PropsWithChildren<any>) => JSX.Element;
	export const metadata: MDXMetadata;
	export const allFiles: MDXFile;
	export default MDXComponent;
}

declare module "*.md" {
	let MDXComponent: (props: PropsWithChildren<any>) => JSX.Element;
	export const metadata: MDXMetadata;
	export const allFiles: MDXFile[];
	export default MDXComponent;
}

declare module "*.markdown" {
	let MDXComponent: (props: PropsWithChildren<any>) => JSX.Element;
	export const metadata: MDXMetadata;
	export const allFiles: MDXFile[];
	export default MDXComponent;
}
