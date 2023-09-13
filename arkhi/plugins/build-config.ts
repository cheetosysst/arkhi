import { Plugin } from 'vite';
export default function optimizeBuildSettings(): Plugin {
    return {
        name: 'arkhi-build-settings',
        config(config) {
            if (!config.build) {
                config.build = {};
            }
            if (!config.esbuild) {
                config.esbuild = {};
            }
            if (!config.build.rollupOptions) {
                config.build.rollupOptions = {};
            }
            config.build.emptyOutDir = true;
            config.build.copyPublicDir = true;
            config.build.modulePreload = true;
            config.build.minify = 'esbuild';
            config.build.manifest = true;
            config.build.ssr = true;
            config.build.ssrManifest = true;
            config.build.ssrEmitAssets = true;

            config.esbuild.minifyIdentifiers = true;
            config.esbuild.keepNames = true;

            config.build.rollupOptions.preserveEntrySignatures = 'strict'

            config.build.rollupOptions.output = {
                compact: true,
            };
            config.build.rollupOptions.output.generatedCode = {
                constBindings: true,
                objectShorthand: true,
            };
            return config;
        },
    }
}
