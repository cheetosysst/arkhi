import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell.js";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "./types.js";
import { IslandProps } from "arkhi/client";
import SuperJSON from "superjson";

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
	const headHtml = ReactDOMServer.renderToString(<>{pageContext.Head}</>);

	const { PrefetchSetting } = pageContext.exports;
	const propString = SuperJSON.stringify(Object.fromEntries(IslandProps));
	IslandProps.clear();

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
          var propString = '${dangerouslySkipEscape(propString || "")}'
        </script>
      </body>
    </html>`;

	return {
		documentHtml,
		pageContext: {
			// We can add some `pageContext` here, which is useful if we want to do page redirection https://vike.dev/page-redirection
		},
	};
}
