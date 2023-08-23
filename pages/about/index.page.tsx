import React from "react";
import { ReverseCounter, Adder } from './Component';
import DocSorter from './DocSorter'
import './code.css'
export { Page };

function Page() {
	return (
		<>
			<h1>About</h1>
			<p>
				Example of using <code>vite-plugin-ssr</code>.
			</p>
			<Adder />
			<br />
			<DocSorter />
		</>
	);
}
