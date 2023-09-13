import { Island } from "@/arkhi/client";
import { api } from "@/arkhi/client/api";
import React, { useRef, useState } from "react";
import { PropsWithChildren } from "react";

export function Caller({ ...props }: PropsWithChildren) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [message, setMessage] = useState<string>("<=click to say hello!");
	const handler = () => {
		api.hello.hello
			.query(inputRef.current?.value || "Nobody")
			.then((data) => setMessage(data.message));
		inputRef.current!.value = "";
	};
	return (
		<p {...props}>
			<input ref={inputRef} />
			<button onClick={handler}>call</button>
			<span>{message}</span>
		</p>
	);
}

const CallerIsland = Island(Caller);

export default CallerIsland;
