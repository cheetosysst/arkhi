import React, { useState } from "react";

export default function Accumulator({ ...props }) {
	const [count, setCount] = useState(0);
	console.log(props);
	return (
		<button
			type="button"
			{...props}
			onClick={() => setCount((count) => count + 1)}
		>
			Accumulator {count}
		</button>
	);
}
