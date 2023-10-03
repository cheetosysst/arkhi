import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vike/server";
import type { PageContextServer } from "./types";
import { IslandProps } from "#/arkhi/client";
import SuperJSON from "superjson";
import { getPreloadTags, preloadAsset } from './preloadAssets'

const images = ['/artificial-island.jpg', '/vike-vertical.svg'];
images.forEach(imagePath => {
	preloadAsset('/', [{ path: imagePath, type: 'image', hint: true }], false);
});
//照順序分別填入分頁位置，Asset位置，asset 的 type ，是否全局(全局指無論甚麼頁面都默認會載入)
//preloadAsset('/about', [{ path: '/vike-vertical.svg', type: 'image', hint: true }], false);

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

	const preloadTags = getPreloadTags(pageContext.urlPathname);
	// const preloadTags = getPreloadAssets(pageContext.urlPathname)
	const headHtml = ReactDOMServer.renderToString(
		<>
			{pageContext.Head}
			{preloadTags && <div dangerouslySetInnerHTML={{ __html: preloadTags }} />}
		</>
	);

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
