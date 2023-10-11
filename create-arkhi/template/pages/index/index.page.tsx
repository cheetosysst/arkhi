import React from "react";
import Counter from "./Counter";

import { Island } from "arkhi/client";
import { Head } from "arkhi/client";

export { Page };
export const PrefetchSetting = { mode: "hover" };

const CounterIsland = Island(Counter);

function Page() {
	return (
		<>
			<Head>
				<title>Index Page - Arkhi</title>
			</Head>
			<h1>Welcome</h1>
			This page is:
			<p>
				Non-Interactive. <Counter temp="Candy" />
			</p>
			<p>
				Interactive. <CounterIsland temp="Candy" />
			</p>
		</>
	);
}
