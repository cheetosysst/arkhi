import React, { useState, useEffect } from "react";
import { Island } from "#/arkhi/client";
import { allFiles as allMdxFiles } from "../../content/*";

function MdxContentRenderer_({ ...props }) {
	const [selectedTag, setSelectedTag] = useState("");
	const [displayFiles, setDisplayFiles] = useState(allMdxFiles);

	const allTags = [
		...new Set(allMdxFiles.flatMap((file) => file.metadata.tags.flat())),
	];

	useEffect(() => {
		const updatedFiles = selectedTag
			? allMdxFiles.filter((file) => {
					const hasTag = file.metadata.tags
						.flat()
						.includes(selectedTag);
					return hasTag;
			  })
			: allMdxFiles;
		setDisplayFiles(updatedFiles);
	}, [selectedTag]);

	return (
		<div {...props}>
			<label>Select Tag: </label>
			<select
				value={selectedTag}
				onChange={(e) => setSelectedTag(e.target.value)}
			>
				{allTags.map((tag) => (
					<option key={tag} value={tag}>
						{tag}
					</option>
				))}
			</select>
			{displayFiles.map((file, index) => (
				<div key={index}>
					<file.component />
					<div className="mdx-metadata"></div>
				</div>
			))}
		</div>
	);
}

const MdxContentRenderer = Island(MdxContentRenderer_);
export default MdxContentRenderer;
