import React from "react";
import { ReverseCounter, Adder } from "./Component";
import DocSorter from "./DocSorter";
import "./code.css";
import { usePreload } from "#/arkhi/client/preload";
// import { preloadAsset } from "#/arkhi/client/preload";

// 可以一次指定不同型態的資源


export { Page };

function Page() {
	usePreload(
		[
			{ path: "/island.jpg", type: "image" },
			{ path: "/style.css", type: "style" },
		]
	);
	return (
		<>
			<h1>About</h1>
			<p>
				Example of using <code>vike</code>.
			</p>
			<Adder />
			<br />
			<DocSorter />
		</>
	);
}
