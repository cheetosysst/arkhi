import { Plugin } from "vite";
import arkhiCMS from "./cms";
import optimizeBuildSettings from "./build-config";

export function arkhiPlugin(): Plugin[] {
	return [arkhiCMS(), optimizeBuildSettings()];
}
