import { Plugin } from "vite";
import arkhiCMS from "./cms";

export function arkhiPlugin(): Plugin[] {
	return [arkhiCMS()];
}
