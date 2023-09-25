import React from "react";
import "./code.css";
import { Link } from "#/arkhi/client";
import Games from "../../content/games.mdx";
import Index from "../../content/index.md";
import MdxContentRenderer from "./MdxContentRenderer";
import "./code.css";
export { Page };
export const PrefetchSetting = { mode: "hover" };
function Page() {
	return (
		<>
			<h1>Test</h1>
			<p>Test prefetch here.</p>
			<Link href="/">To Home</Link>
			<MdxContentRenderer />
		</>
	);
}
