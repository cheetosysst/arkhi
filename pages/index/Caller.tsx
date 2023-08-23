import { Island } from "@/arkhi/client";
import { api } from "@/arkhi/client/api";
import React from "react";
import { PropsWithChildren } from "react";

function Caller({ ...props }: PropsWithChildren) {
	const handler = () => {
		console.log("clicked");
		api.hello.hello.query("Matt").then((data) => console.log(data.message));
	};
	return (
		<button onClick={handler} {...props}>
			call
		</button>
	);
}

const CallerIsland = Island("Caller", Caller);

export default CallerIsland;
