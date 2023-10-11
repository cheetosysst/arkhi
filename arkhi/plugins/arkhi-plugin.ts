import { Plugin } from "vite";
import arkhiCMS from "./cms.js";
import optimizeBuildSettings from "./build-config.js";

export function arkhiPlugin(): Plugin[] {
	// Weird type error
	// @ts-ignore
	return [arkhiCMS(), optimizeBuildSettings()];
}
