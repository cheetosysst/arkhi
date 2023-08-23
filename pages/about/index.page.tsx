import React from "react";
import { ReverseCounter, Adder } from "./Component";
// import './code.css'

export { Page };

function Page() {
	return (
		<>
			<h1>About</h1>
			<p>
				Example of using <code>vite-plugin-ssr</code>.
			</p>
			<Adder />
		</>
	);
}
