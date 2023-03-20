import React, { useState } from "react";

export default function Counter({ ...props }) {
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
