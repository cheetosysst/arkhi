import { Island } from "@/arkhi/client";
import { trpc } from "@/arkhi/client/trpcProxy";
import React from "react";
import { useState, PropsWithChildren } from "react";

function Greet_({ ...props }: PropsWithChildren) {
	const [text, setText] = useState("greet");
	const handler = async () => {
		const data = await trpc.example.hello.query({ text: "John" });
		setText(data.greeting);
	};

	return (
		<li {...props}>
			<button type="button" onClick={handler}>
				Call
			</button>
			<span>{text}</span>
		</li>
	);
}

const Greet = Island(Greet_);
export default Greet;
