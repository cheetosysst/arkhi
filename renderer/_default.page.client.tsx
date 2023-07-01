import type { FunctionComponent } from "react";
import { renderIslands, tempIslandInsert, ClientRouter } from "@arkhi/core";

// Imported for mock purpose
import Counter from "../pages/index/Counter";
import Accumulator from "../pages/index/Accumulator";
const islandsComponents = new Map<string, FunctionComponent>();

//@ts-ignore
window.clientRouter ||=  new ClientRouter({"render": render});
//@ts-ignore
const clientRouter = window.clientRouter;


const mockPluginBehaviour = () => {
	islandsComponents.set("Counter", Counter);
	islandsComponents.set("Accumulator", Accumulator);
};

function render() {
	mockPluginBehaviour();
	tempIslandInsert(islandsComponents);

	clientRouter.beforeRender();



	renderIslands(document.body);
}

export { render };