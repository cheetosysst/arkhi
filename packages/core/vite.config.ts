import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dts()],
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "core",
			fileName: (format, entryName) =>
				format === "cjs" ? `${entryName}.${format}` : `${entryName}.js`,
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			input: {
				index: path.resolve(__dirname, "src/index.ts"),
			},
			external: ["react", "react-dom", "react-dom/client"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
