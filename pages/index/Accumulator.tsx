import React, { useState } from "react";

function Accumulator({ ...props }) {
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

export default Accumulator;
