import React, { ReactElement, useEffect, useState } from "react";
import { Island } from "#/arkhi/client";

import MDXContent, { metadata as mdxMetadata } from "../../content/index.md";
import Post02, {
	metadata as post02Metadata,
} from "../../content/article/post02.md";
import Games, { metadata as gamesMetadata } from "../../content/games.mdx";
import Test, { metadata as testMetadata } from "../../content/test.md";

interface ArticleMetadataProps {
	title: string;
	author: string;
	views: number;
	lastAccessed: Date;
}

function ArticleMetadata({
	title,
	author,
	views,
	lastAccessed,
}: ArticleMetadataProps) {
	return (
		<div className="metadata">
			<h4 className="title">{title}</h4>
			<p className="author">By {author}</p>
			<p className="views">{views} Views</p>
			<p className="lastAccessed">
				Last Accessed: {lastAccessed.toLocaleString()}
			</p>
		</div>
	);
}

function renderMarkdownFile(filePath: string | string[]) {
	if (filePath.includes("index.md")) {
		return <MDXContent />;
	} else if (filePath.includes("post02.md")) {
		return <Post02 />;
	} else if (filePath.includes("games.mdx")) {
		return <Games />;
	} else if (filePath.includes("test.md")) {
		return <Test />;
	}
}

function DocSorter_({ ...props }) {
	const metadataArray = [
		mdxMetadata,
		post02Metadata,
		gamesMetadata,
		testMetadata,
	];
	const [isDescending, setIsDescending] = useState(false);
	const [renderedContent, setRenderedContent] = useState<ReactElement[]>([]);

	useEffect(() => {
		updateRenderedContent();
	}, [isDescending]);

	const handleSortToggle = () => {
		setIsDescending(!isDescending);
	};

	function Card({ metadata }: { metadata: any }) {
		const [showContent, setShowContent] = useState(false);
		const handleMouseEnter = () => {
			setShowContent(true);
		};
		const handleMouseLeave = () => {
			setShowContent(false);
		};

		return (
			<div
				className="card"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<ArticleMetadata
					title={metadata.title}
					author={metadata.author}
					views={metadata.views}
					lastAccessed={new Date(metadata.atime)}
				/>
				{showContent && renderMarkdownFile(metadata.filePath)}
			</div>
		);
	}

	function updateRenderedContent() {
		const sortedMetadataArray = [...metadataArray].sort((a, b) =>
			isDescending
				? new Date(b.createdAt).getTime() -
				  new Date(a.createdAt).getTime()
				: new Date(a.createdAt).getTime() -
				  new Date(b.createdAt).getTime()
		);
		const newRenderedContent = sortedMetadataArray.map((metadata) => (
			<Card metadata={metadata} key={metadata.title} />
		));
		setRenderedContent(newRenderedContent);
	}

	return (
		<div>
			<button type="button" onClick={handleSortToggle} {...props}>
				{isDescending ? "Sort Descending" : "Sort Ascending"}
			</button>
			{renderedContent.map((content, index) => (
				<div key={index}>{content}</div>
			))}
		</div>
	);
}

const DocSorter = Island(DocSorter_);
export default DocSorter;
