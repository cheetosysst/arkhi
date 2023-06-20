import type { FunctionComponent } from "react";
import { renderIslands } from "@arkhi/core";

// Imported for mock purpose
import Counter from "../pages/index/Counter";
import Accumulator from "../pages/index/Accumulator";

const islandsComponents = new Map<string, FunctionComponent>();

const mockPluginBehaviour = () => {
	islandsComponents.set("Counter", Counter);
	islandsComponents.set("Accumulator", Accumulator);
};

function render() {
	renderIslands(document.body);
}

export { render };
