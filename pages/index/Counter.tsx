import { Island } from "@/arkhi/client";
import React, { PropsWithChildren, useState } from "react";

function Counter_({ ...props }: PropsWithChildren) {
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
