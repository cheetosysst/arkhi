import React, { useState, useEffect } from "react";
import { Island } from "@/arkhi/client";
import { allFiles as allMdxFiles } from '../../content/article/*.md';

function MdxContentRenderer_({ ...props }) {
    const [selectedTag, setSelectedTag] = useState("");
    const [displayFiles, setDisplayFiles] = useState(allMdxFiles);

    const allTags = [...new Set(allMdxFiles.flatMap(file => file.metadata.tags.flat()))];

    useEffect(() => {
        const updatedFiles = selectedTag
            ? allMdxFiles.filter(file => {
                const hasTag = file.metadata.tags.flat().includes(selectedTag);
                return hasTag;
            })
            : allMdxFiles;
        setDisplayFiles(updatedFiles);
    }, [selectedTag]);

    return (
        <div {...props}>
            <label>Select Tag: </label>
            <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
                <option value="">All</option>
                {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>

            {displayFiles.map((file, index) => (
                <div key={index}>
                    <file.component />
                    <div className="mdx-metadata">
                        <p>Author: {file.metadata.author}</p>
                        <p>File Path: {file.metadata.filePath}</p>
                        <p>File Name: {file.metadata.fileName}</p>
                        <p>Tags: {file.metadata.tags.join(', ')}</p>
                        <p>Description: {file.metadata.description}</p>
                        <p>Views: {file.metadata.views}</p>
                        <p>Status: {file.metadata.status}</p>
                        <p>Last Accessed: {new Date(file.metadata.atime).toLocaleDateString()}</p>
                        <p>Last Modified: {new Date(file.metadata.mtime).toLocaleDateString()}</p>
                        <p>Creation Time: {new Date(file.metadata.ctime).toLocaleDateString()}</p>
                        <p>Created At: {new Date(file.metadata.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

const MdxContentRenderer = Island("mdx", MdxContentRenderer_);
export default MdxContentRenderer;
