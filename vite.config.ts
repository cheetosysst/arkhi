import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { arkhiCMS } from "./arkhi/plugins";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vite";
import CleanUnusedExportsPlugin from "./clean-code";
const config: UserConfig = {
	plugins: [react(), ssr(), tsconfigPaths(), arkhiCMS(),
	CleanUnusedExportsPlugin('index.page'),
	],
};

export default config;
