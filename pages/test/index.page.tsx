import React from "react";
import "./code.css";
import { Link } from "@/arkhi/client";

import "./code.css";
export { Page };

function Page() {
	return (
		<>
			<h1 className="text-3xl font-bold underline">Test</h1>
			<p>Test prefetch here.</p>
			<Link href="/">To Home</Link>
		</>
	);
}
