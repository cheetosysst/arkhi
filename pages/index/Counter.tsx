import { Island } from "@arkhi/core";
import React, { useState } from "react";

function Counter_({ temp, ...props }: { temp?: string }) {
	const [count, setCount] = useState(0);
	return (
		<button
			type="button"
			{...props}
			onClick={() => setCount((count) => count + 1)}
		>
			Counter {count}
		</button>
	);
}

const Counter = Island(Counter_);

export default Counter;
