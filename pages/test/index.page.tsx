import React from "react";
import "./code.css";
import { Link } from "#/arkhi/client";
import Content from "#/content/index.md";
import "./code.css";
export { Page };
export const PrefetchSetting = { mode: "hover" };

const files = import.meta.glob("../../content/*", { eager: true });

function Page() {
	return (
		<>
			<h1>Test</h1>
			<p>Test prefetch here.</p>
			<Link href="/">To Home</Link>
			<Content />

			{Object.keys(files)
				// @ts-ignore
				.map((key) => files[key]!.default)
				.map((Article, index) => (
					<Article key={`article${index}`} />
				))}
		</>
	);
}
