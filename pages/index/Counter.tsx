import React, { useState } from "react";

function Counter({ temp, ...props }: { temp?: string }) {
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

export default Counter;
