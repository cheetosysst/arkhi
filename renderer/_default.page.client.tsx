// import { renderIslands, ClientRouter } from "../arkhi/index";
import { renderIslands, ClientRouter } from "@/arkhi/client";

declare global {
	interface Window {
		clientRouter: ClientRouter | undefined;
	}
}

window.clientRouter ||= new ClientRouter(render, { mode: "visible" });

function render() {
	const clientRouter = window.clientRouter;
	if (clientRouter !== undefined) clientRouter.beforeRender();
	renderIslands(document.body);
}

export { render };
