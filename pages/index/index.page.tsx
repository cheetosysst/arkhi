import React from "react";
import Counter from "./Counter";
import Accumulator from "./Accumulator";

export { Page };

function Page() {
	return (
		<>
			<h1>Welcome</h1>
			This page is:
			<ul>
				<li>Rendered to HTML.</li>
				<li>
					Non-Interactive. <Counter />
					<br />
					Interactive. <Counter _island_id="Counter:1" />
					<br />
					Interactive. <Counter _island_id="Counter:2" />
					<br />
				</li>
				<li>
					Non-Interactive. <Counter />
					<br />
					Interactive. <Counter _island_id="Counter:3" />
					<br />
					Interactive. <Counter _island_id="Counter:4" />
					<br />
				</li>
				<li>
					Non-Interactive. <Accumulator />
					<br />
					Interactive. <Accumulator _island_id="Accumulator:1" />
					<br />
					Interactive. <Accumulator _island_id="Accumulator:2" />
					<br />
				</li>
				<li>
					Non-Interactive. <Accumulator />
					<br />
					<div>
						Interactive. <Accumulator _island_id="Accumulator:1" />
						<br />
					</div>
					Interactive. <Accumulator _island_id="Accumulator:1" />
					<br />
					Interactive. <Accumulator _island_id="Accumulator:2" />
					<br />
				</li>
			</ul>
		</>
	);
}
