import { Island } from "@arkhi/core";
import React, { useState } from "react";

function Accumulator_({ ...props }) {
	const [count, setCount] = useState(0);
	return (
		<button
			type="button"
			onClick={() => setCount((count) => count + 1)}
			{...props}
		>
			Accumulator {count}
		</button>
	);
}

const Accumulator = Island(Accumulator_);
export default Accumulator;
