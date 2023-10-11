import react from "@vitejs/plugin-react";
import ssr from "vike/plugin";
import { arkhiPlugin } from "arkhi/plugins";
import { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [react(), ssr(), arkhiPlugin()],
	resolve: {
		alias: [
			{
				find: "#",
				replacement: __dirname,
			},
		],
	},
};

export default config;
