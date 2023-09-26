import React, { FC } from "react";
import Counter from "./Counter";
import Accumulator from "./Accumulator";
import CallerIsland from "./Caller";

import { Island } from "#/arkhi/client";
import { ColorChanger } from "../about/Component";
import { Head } from "#/arkhi/client";

export { Page };
export const PrefetchSetting = { mode: "hover" };

const IslandCounter = Island(Counter);
const IslandAccumulator = Island(Accumulator);

function Page() {
	return (
		<>
			<Head>
				<title>Index Page - Arkhi</title>
			</Head>
			<h1>Welcome</h1>
			<ColorChanger />
			This page is:
			<ul>
				<li>Rendered to HTML.</li>
				<li>
					Non-Interactive. <IslandCounter temp="Candy" />
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
			<CallerIsland />
		</>
	);
}
