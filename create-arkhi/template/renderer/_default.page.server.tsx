import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "./types";
import { IslandProps } from "arkhi/client";
import SuperJSON from "superjson";

import { PageHeads } from "arkhi/client";
import { generatePreloadTags, clearAssetSet } from "arkhi/client";

export { render };
// See https://vike.dev/data-fetching
export const passToClient = ["pageProps", "urlPathname"];

async function render(pageContext: PageContextServer) {
	const { Page, pageProps } = pageContext;
	const pageHtml = ReactDOMServer.renderToString(
		<PageShell pageContext={pageContext}>
			<Page {...pageProps} />
		</PageShell>
	);

	const preloadTags = generatePreloadTags();
	const headHtml = ReactDOMServer.renderToString(
		<>
			{PageHeads}
			{preloadTags}
		</>
	);

	const { PrefetchSetting } = pageContext.exports;
	const propString = SuperJSON.stringify(Object.fromEntries(IslandProps));
	IslandProps.clear();
	clearAssetSet();
	const documentHtml = escapeInject`<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		${dangerouslySkipEscape(headHtml)}
	</head>

	<body>
	<div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
	<div id="prefetch-setting" data-setting = ${JSON.stringify(
		PrefetchSetting || ""
	)}></div>
	<script>
		var prefetchSetting = '${dangerouslySkipEscape(
			JSON.stringify(PrefetchSetting || "")
		)}'
		var propString = '${dangerouslySkipEscape(propString || "")}'
	</script>
	</body>
</html>`;
	PageHeads.splice(0, PageHeads.length);

	return {
		documentHtml,
		pageContext: {
			// We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
		},
	};
}
