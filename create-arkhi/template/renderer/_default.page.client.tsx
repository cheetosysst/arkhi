import { renderIslands, ClientRouter } from "arkhi/client";

//@ts-ignore
window.clientRouter ||= new ClientRouter(render, { mode: "visible" });
//@ts-ignore
const clientRouter = window.clientRouter;
function render() {
	clientRouter.beforeRender();
	renderIslands(document.body);
}

export { render };
