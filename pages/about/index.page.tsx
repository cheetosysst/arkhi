import React from "react";
import { Adder } from "./Component";
import DocSorter from "./DocSorter";
import "./code.css";
import { usePreload } from "#/arkhi/client/preload";

export { Page };

function Page() {
	usePreload([
		{ path: "/island.jpg", type: "image" },
		{ path: "/style.css", type: "style" },
	]);
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
