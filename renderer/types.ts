export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };

import type { ReactNode } from "react";
import type {
	PageContextBuiltInServer,
	PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
} from "vike/types";

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = {};

export type PageContextCustom = {
	Page: Page;
	pageProps?: PageProps;
	urlPathname: string;
	exports: {
		documentProps?: {};
		PrefetchSetting?: {
			mode?: string;
		};
	};
	Head: ReactNode[] | undefined;
};

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom;
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

type PageContext = PageContextClient | PageContextServer;
