import React, { FC } from "react";
import Counter from "./Counter";
import Accumulator from "./Accumulator";
import Greet from "./Greetings";

export { Page };

function Page() {
	return (
		<>
			<h1>Welcome</h1>
			This page is:
			<ul>
				<li>Rendered to HTML.</li>
				<Greet />
				<li>
					Non-Interactive. <Counter />
					<br />
					Interactive. <Counter />
					<br />
					Interactive. <Counter />
					<br />
				</li>
				<li>
					Non-Interactive. <Counter />
					<br />
					Interactive. <Counter />
					<br />
					Interactive. <Counter />
					<br />
				</li>
				<li>
					Non-Interactive. <Accumulator />
					<br />
					Interactive. <Accumulator />
					<br />
					Interactive. <Accumulator />
					<br />
				</li>
				<li>
					Non-Interactive. <Accumulator />
					<br />
					<div>
						Interactive. <Accumulator />
						<br />
					</div>
					Interactive. <Accumulator />
					<br />
					Interactive. <Accumulator />
					<br />
				</li>
			</ul>
		</>
	);
}
