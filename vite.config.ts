import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { arkhiCMS } from "./arkhi/plugins";
import { CleanUnusedExportsPlugin } from "./arkhi/plugins";
import tsconfigPaths from "vite-tsconfig-paths";
import { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [react(), ssr(), tsconfigPaths(), arkhiCMS(), CleanUnusedExportsPlugin(),
	],
};

export default config;