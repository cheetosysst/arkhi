import React, { MouseEvent, PropsWithChildren } from "react";
import { Island } from "./island.js";

declare global {
	interface Window {
		clientRouter: ClientRouter;
	}
}

type PrefetchMode = "hover" | "visible" | "page" | "nested";
type PrefetchSetting = { mode?: PrefetchMode };
export class ClientRouter {
	private prefetched: Set<string> = new Set<string>();

	public pageSettingMap: Map<string, PrefetchSetting> = new Map<
		string,
		PrefetchSetting
	>();
	public setting: PrefetchSetting = { mode: "visible" };
	private observer: IntersectionObserver = new IntersectionObserver(
		(
			entries: IntersectionObserverEntry[],
			observer: IntersectionObserver
		) => this.observerCallback(entries, observer)
	);
	private render: Function;

	constructor(render: Function, setting: PrefetchSetting) {
		this.render = render;
		setting && (this.setting = setting);
		this.vitePrefetch.bind(this);

		if (window?.history) {
			window.addEventListener("popstate", (e) => this.onPop(e));
			this.prefetchVisible();
		}
	}

	private _prefetch:
		| ((url: string) => Promise<void | ((url: string) => Promise<void>)>)
		| undefined = undefined;
	get vitePrefetch() {
		if (this._prefetch === undefined) {
			const prefetch = import("vike/client/router");
			this._prefetch = (url: string) =>
				prefetch.then((mods) => mods.prefetch(url));
		}
		return this._prefetch;
	}

	public getPath(url: string | null | undefined) {
		return new URL(url || "", location.origin).pathname;
	}

	private observerCallback(
		entries: IntersectionObserverEntry[],
		observer: IntersectionObserver
	): void {
		const clientRouter =
			typeof window === "undefined" ? this : window.clientRouter;
		entries.forEach(async (entry: IntersectionObserverEntry) => {
			const path = clientRouter.getPath(
				entry.target.getAttribute("href")
			);

			if (clientRouter.prefetched.has(path)) {
				observer.unobserve(entry.target);
				return;
			}

			if (entry.isIntersecting) {
				clientRouter.prefetched.add(path);
				this.vitePrefetch(path);
				observer.unobserve(entry.target);
			}
		});
	}

	public async prefetchHover(element: HTMLAnchorElement): Promise<Boolean> {
		const path = this.getPath(element.getAttribute("href"));

		if (this.prefetched.has(path)) {
			return true;
		}

		this.prefetched.add(path);
		this.vitePrefetch(path);
		return true;
	}

	private prefetchVisible(): void {
		const pageSetting =
			this.pageSettingMap.get(this.getPath(window.location.href)) ||
			this.setting;
		if (pageSetting.mode !== "visible") return;

		if ("IntersectionObserver" in window === false) return;
		this.observer ||
			(this.observer = new IntersectionObserver(
				(
					entries: IntersectionObserverEntry[],
					observer: IntersectionObserver
				) => this.observerCallback(entries, observer)
			));

		Array.from(document.querySelectorAll("a"))
			.filter(
				(element) =>
					this.prefetched.has(this.getPath(element.href)) === false
			)
			.forEach((element) => this.observer.observe(element));
	}

	private prefetchPage(): void {
		const pageSetting =
			this.pageSettingMap.get(this.getPath(window.location.href)) ||
			this.setting;
		if (pageSetting.mode !== "page") return;

		document.querySelectorAll("a").forEach(async (element) => {
			const path = this.getPath(element.getAttribute("href"));

			if (this.prefetched.has(path)) {
				return;
			}

			this.prefetched.add(path);
			this.vitePrefetch(path);
		});
	}

	private prefetchNested(dom: Document, href: string, layer: number): void {
		const pageSetting =
			this.pageSettingMap.get(this.getPath(href)) || this.setting;
		if (pageSetting.mode !== "nested") return;

		dom.querySelectorAll("a").forEach(async (element) => {
			const path = this.getPath(element.getAttribute("href"));

			if (this.prefetched.has(path)) {
				return;
			}

			this.prefetched.add(path);
			this.vitePrefetch(path);

			try {
				const response = await fetch(path);
				const htmlString = await response.text();
				const parser = new DOMParser();
				const html = parser.parseFromString(htmlString, "text/html");
				const PrefetchSettingJson =
					html
						.getElementById("prefetch-setting")
						?.getAttribute("data-setting") || "";
				const PrefetchSetting = JSON.parse(PrefetchSettingJson);
				PrefetchSetting &&
					this.setPagePrefetchRule(path, PrefetchSetting);

				this.prefetchNested(html, path, layer + 1);
			} catch (error: any) {
				console.error("Fetch Error:", error, error.message);
			}
		});
	}

	private async updatePageContext({
		href,
		mode,
		data,
	}: {
		href: string;
		mode: string;
		data?: {};
	}): Promise<boolean> {
		const path = this.getPath(href);

		try {
			const response = await fetch(path);
			const htmlString = await response.text();

			if (mode === "go") {
				window.history.pushState(
					{ prev: this.getPath(window.location.href) },
					"",
					path
				);
			}

			const parser = new DOMParser();
			const html = parser.parseFromString(htmlString, "text/html");
			const PrefetchSettingJson =
				html
					.getElementById("prefetch-setting")
					?.getAttribute("data-setting") || "";

			//This is hack to script force injection. Ref: https://stackoverflow.com/questions/1197575/can-scripts-be-inserted-with-innerhtml
			var g = document.createElement("script");
			var s = document.getElementsByTagName("script")[0];
			g.text =
				html.body.getElementsByTagName("script")[0].textContent || "";
			s.parentNode?.insertBefore(g, s);

			const PrefetchSetting = JSON.parse(PrefetchSettingJson);
			PrefetchSetting && this.setPagePrefetchRule(path, PrefetchSetting);

			document.body = html.body;

			this.render();
			return true;
		} catch (error: any) {
			console.error("Fetch Error:", error.message);
			return false;
		}
	}

	private onPop(event: PopStateEvent): void {
		this.updatePageContext({
			href: this.getPath(window.location.href),
			mode: "back",
		});
	}

	public go(path: string): Promise<boolean> | undefined {
		if (path.length) {
			const origin = new URL(path, window.location.origin).origin;
			if (window.location.origin !== origin) {
				window.location.href = path;
				return;
			}
		}
		path = this.getPath(path);
		return this.updatePageContext({ href: path, mode: "go" });
	}

	public back(): void {
		window.history.back();
	}

	public forward(): void {
		window.history.forward();
	}

	/**
	 * Should be called in _default.page.client render function.
	 */
	public beforeRender(): void {
		const PrefetchSettingJson =
			document
				.getElementById("prefetch-setting")
				?.getAttribute("data-setting") || "";
		const PrefetchSetting = JSON.parse(PrefetchSettingJson);

		PrefetchSetting &&
			this.setPagePrefetchRule(
				this.getPath(document.location.href),
				PrefetchSetting
			);

		this.prefetchVisible();
		this.prefetchPage();
		this.prefetchNested(document, document.location.href, 0);
	}

	public setPagePrefetchRule(path: string, setting: PrefetchSetting): void {
		path = this.getPath(path);
		this.pageSettingMap.get(path) || this.pageSettingMap.set(path, setting);
	}
}

const Link_ = ({
	children,
	className,
	href,
	...props
}: PropsWithChildren & { className?: string; href: string }) => {
	if (typeof window === "undefined")
		return (
			<a className={className ?? ""} href={href} {...props}>
				{children}
			</a>
		);

	const clientRouter = window.clientRouter;
	const pageSetting =
		clientRouter.pageSettingMap.get(
			clientRouter.getPath(window.location.href)
		) || clientRouter.setting;
	const isSettingHover = pageSetting.mode === "hover";

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const target = event.currentTarget;
		clientRouter.go(target.getAttribute("href") || "");
	};

	const handleMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const target = event.currentTarget;
		clientRouter.prefetchHover(target);
	};

	return (
		<a
			onClick={handleClick}
			onMouseOver={isSettingHover ? handleMouseOver : undefined}
			className={className ?? ""}
			href={href}
			{...props}
		>
			{children}
		</a>
	);
};

// export const Link = Link_;
export const Link = Island(Link_);
