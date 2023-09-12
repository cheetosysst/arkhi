import { prefetch as vitePrefech } from "vite-plugin-ssr/client/router";
import { Island } from "./island";
import React, { MouseEvent, PropsWithChildren } from "react";

declare global {
	interface Window {
		clientRouter: ClientRouter;
	}
}

type PrefetchMode = "hover" | "visible" | "page" | "nested";
type PrefetchSetting = { mode?: PrefetchMode };
export class ClientRouter {
	private prefetched: Set<String> = new Set<String>();

	public pageSettingMap: Map<String, PrefetchSetting> = new Map<
		String,
		PrefetchSetting
	>();
	public setting: PrefetchSetting = { mode: "visible" };
	private observer: IntersectionObserver; // TODO fix this type error
	private render: Function;

	constructor(render: Function, setting: PrefetchSetting) {
		this.render = render;
		setting && (this.setting = setting);

		if (window?.history) {
			window.addEventListener("popstate", (e) => this.onPop(e));
			this.prefetchVisible();
		}
	}

	private getPath: any = (url: string | null | undefined): string => {
		return new URL(url || "", location.origin).pathname;
	};

	public async prefetchHover(element: HTMLAnchorElement): Promise<Boolean> {
		const path = this.getPath(element.getAttribute("href"));

		if (this.prefetched.has(path)) {
			return true;
		}

		this.prefetched.add(path);
		await vitePrefech(path);
		return true;
	}

	private prefetchVisible(): void {
		const pageSetting =
			this.pageSettingMap.get(this.getPath(window.location.href)) ||
			this.setting;
		if (pageSetting.mode !== "visible") return;

		if ("IntersectionObserver" in window === false) return;
		this.observer ||
			(this.observer = new IntersectionObserver((entries, observer) => {
				entries.forEach(async (entry) => {
					const path = this.getPath(
						entry.target.getAttribute("href")
					);

					if (this.prefetched.has(path)) {
						observer.unobserve(entry.target);
						return;
					}

					if (entry.isIntersecting) {
						this.prefetched.add(path);
						await vitePrefech(path);
						observer.unobserve(entry.target);
					}
				});
			}));

		Array.from(document.querySelectorAll("a"))
			.filter((element) => {
				const path = this.getPath(element.href);
				return this.prefetched.has(path) === false;
			})
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
			await vitePrefech(path);
		});
	}

	private prefetchNested(dom: Document, layer: number): void {
		const pageSetting =
			this.pageSettingMap.get(this.getPath(dom.location.href)) ||
			this.setting;
		if (pageSetting.mode !== "nested") return;

		dom.querySelectorAll("a").forEach(async (element) => {
			const path = this.getPath(element.getAttribute("href"));

			if (this.prefetched.has(path)) {
				return;
			}

			this.prefetched.add(path);
			await vitePrefech(path);

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
				if (this.prefetched.has(path)) return;
				this.prefetchNested(html, layer + 1);
			} catch (error: any) {
				console.error("Fetch Error:", error, error.message);
			}
		});
	}

	private onPop(event: PopStateEvent): void {
		this.updatePageContext({
			href: this.getPath(window.location.href),
			mode: "back",
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

	public go(path: string): Promise<boolean> {
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
	 *
	 */
	public beforeRender(): void {
		const PrefetchSettingJson =
			document
				.getElementById("prefetch-setting")
				?.getAttribute("data-setting") || "";
		const PrefetchSetting = JSON.parse(PrefetchSettingJson);

		PrefetchSetting &&
			this.setPagePrefetchRule(document.location.href, PrefetchSetting);

		this.prefetchVisible();
		this.prefetchPage();
		this.prefetchNested(document, 0);
	}

	public setPagePrefetchRule(path: String, setting: PrefetchSetting): void {
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
	const clientRouter = import.meta.env.SSR ? null : window.clientRouter;
	const pageSetting =
		clientRouter?.pageSettingMap.get(window.location.href) ||
		clientRouter?.setting;
	const isSettingHover = pageSetting?.mode === "hover";

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const target = event.currentTarget;
		clientRouter && clientRouter.go(target.getAttribute("href") || ""); // Adjust to get the href attribute
	};

	const handleMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const target = event.currentTarget;
		clientRouter && clientRouter.prefetchHover(target);
	};

	return (
		<a
			onClick={clientRouter ? handleClick : undefined}
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
export const Link = Island("Link", Link_);
