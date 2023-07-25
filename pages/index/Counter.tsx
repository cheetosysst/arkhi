import { Island } from "@/arkhi/client";
import { trpc } from "@/arkhi/client/trpcProxy";
import React, { PropsWithChildren, useEffect, useState } from "react";

function Counter_({ ...props }: PropsWithChildren) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		// console.log();
		trpc.example.hello.query({ text: "John Doe" }).then((data) => {
			console.log(data);
		});
	}, []);
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
