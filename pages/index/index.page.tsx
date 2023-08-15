import React, { FC } from "react";
import Counter from "./Counter";
import Accumulator from "./Accumulator";
import { Island } from "@/arkhi/client";

export { Page };
export const PrefetchSetting = { mode: 'hover' };

const IslandCounter = Island("index", Counter);
const IslandAccumulator = Island("index", Accumulator);

function Page() {
	return (
		<>
			<h1>Welcome</h1>
			{/* <ColorChanger /> */}
			This page is:
			<ul>
				<li>Rendered to HTML.</li>
				<li>
					Non-Interactive. <IslandCounter />
					<br />
					Interactive. <IslandCounter />
					<br />
					Interactive. <IslandCounter />
					<br />
				</li>
				<li>
					Non-Interactive. <IslandCounter />
					<br />
					Interactive. <IslandCounter />
					<br />
					Interactive. <IslandCounter />
					<br />
				</li>
				<li>
					Non-Interactive. <IslandAccumulator />
					<br />
					Interactive. <IslandAccumulator />
					<br />
					Interactive. <IslandAccumulator />
					<br />
				</li>
				<li>
					Non-Interactive. <IslandAccumulator />
					<br />
					<div>
						Interactive. <IslandAccumulator />
						<br />
					</div>
					Interactive. <IslandAccumulator />
					<br />
					Interactive. <IslandAccumulator />
					<br />
				</li>
			</ul>
		</>
	);
}
