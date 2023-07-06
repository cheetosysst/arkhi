import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { arkhiCMS } from "./packages/core/src/cms";
import { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [react(), ssr(), arkhiCMS()],
};

export default config;
