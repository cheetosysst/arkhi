import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { arkhiPlugin } from "./arkhi/plugins";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [react(), ssr(), tsconfigPaths(), arkhiPlugin()],
	resolve: {
		alias: {
			"@": __dirname,
		},
	}
};

export default config;