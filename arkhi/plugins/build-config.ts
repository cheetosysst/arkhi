import { Plugin } from "vite";
export default function optimizeBuildSettings(): Plugin {
	return {
		name: "arkhi-build-settings",
		config(config) {
			if (!config.esbuild) {
				config.esbuild = {};
			}

			config.esbuild.minifyIdentifiers = true;
			config.esbuild.keepNames = true;

			return config;
		},
	};
}
