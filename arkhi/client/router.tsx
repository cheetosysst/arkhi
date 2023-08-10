import { prefetch as vitePrefech } from 'vite-plugin-ssr/client/router'

type PrefetchMode = 'hover' | 'visible' | 'page' | 'nested';
type PrefetchSetting = { mode?: PrefetchMode };
export class ClientRouter {
	private prefetched: Set<String> = new Set<String>();

	private pageSettingMap: Map<String, PrefetchSetting> = new Map<String, PrefetchSetting>();
	private setting: PrefetchSetting = { mode: "visible" }
	private observer: IntersectionObserver;
	private render: Function;

	constructor(render: Function, setting: PrefetchSetting) {

		this.render = render;
		setting && (this.setting = setting);

		if (window?.history) {
			window.addEventListener("popstate", (e) => this.onPop(e));
			this.prefetchVisible();
		}
	}

	private createLink: any = (url: string): void => {
		// //create link for prefatch
		// const linkElement = document.createElement("link");
		// linkElement.rel = "prefetch";
		// linkElement.href = url;
		// linkElement.as = "document";

		// linkElement.onerror = (err) =>
		// 	console.error("prefetched error", url, err);

		// document.head.appendChild(linkElement);

		const href = new URL(url, location.origin).href;
		this.prefetched.add(href);
	};

	private async prefetchHover(element: HTMLTextAreaElement): Promise<Boolean> {
		const href: string = new URL(
			element.getAttribute('href') || "",
			location.origin
		).href;

		if (this.prefetched.has(href)) {
			return true;
		}
		this.createLink(href);

		await vitePrefech(element.getAttribute('href') || "");
		// console.log(`${href} be prefectched`)
		return true;
	}

	private prefetchVisible(): void {
		// console.log("visible", window.location.href);
		const pageSetting = this.pageSettingMap.get(window.location.href);
		if (pageSetting?.mode ? pageSetting?.mode !== 'visible' : this.setting.mode !== 'visible') return;
		if ("IntersectionObserver" in window === false) return;
		// cant use Logical OR assignment ||=, make the error [vite] Error when evaluating SSR
		this.observer ||
			(this.observer = new IntersectionObserver(
				(entries, observer) => {
					entries.forEach(async (entry) => {
						const href: string = new URL(
							entry.target.getAttribute("href") || "",
							location.origin
						).href;

						if (this.prefetched.has(href)) {
							observer.unobserve(entry.target);
							return;
						}

						if (entry.isIntersecting) {
							this.createLink(href);
							await vitePrefech(entry.target.getAttribute("href") || "");
							// console.log(`${href} be prefectched`)
							observer.unobserve(entry.target);
						}
					});
				}
			));

		Array.from(document.querySelectorAll("a"))
			.filter((element) => {
				return this.prefetched.has(element.href) === false;
			})
			.forEach((element) => this.observer.observe(element));
	}
	private prefetchPage(): void {
		// console.log("page", window.location.href);
		const pageSetting = this.pageSettingMap.get(window.location.href);
		if (pageSetting?.mode ? pageSetting?.mode !== 'page' : this.setting.mode !== 'page') return;
		document.querySelectorAll("a").forEach(async (element) => {
			const href: string = new URL(
				element.getAttribute('href') || "",
				location.origin
			).href;

			if (this.prefetched.has(href)) {
				return;
			}
			this.createLink(href);
			await vitePrefech(element.getAttribute('href') || "");
			// console.log(`${href} be prefectched`)
		})
	}

	private prefetchNested(dom: Document, layer: number): void {
		const pageSetting = this.pageSettingMap.get(dom.location.href);
		if (pageSetting?.mode ? pageSetting?.mode !== 'nested' :this.setting.mode !== 'nested') return;
		dom.querySelectorAll('a').forEach(async (element) => {
			const href: string = new URL(
				element.getAttribute('href') || "",
				location.origin
			).href;
			if (this.prefetched.has(href)) {
				return;
			}

			this.createLink(href);
			await vitePrefech(element.getAttribute('href') || "");
			// console.log(`${href} be prefectched`, layer);
			try {
				const response = await fetch(href);
				const htmlString = await response.text();
				const parser = new DOMParser();
				const html = parser.parseFromString(htmlString, "text/html");
				const PrefetchSettingJson =  html.getElementById("prefetch-setting")?.getAttribute('data-setting') || "";
				const PrefetchSetting = JSON.parse(PrefetchSettingJson);
				PrefetchSetting && this.setPagePrefetchRule(href, PrefetchSetting);
				if(this.prefetched.has(href))return;
				this.prefetchNested(html, layer + 1);

			} catch (error: any) {
				console.error("Fetch Error:", error, error.message);
			}
		})
	}

	/**
	 * modify html <a> tag behavior
	 */
	private handleClientLinkBehavior(): void {
		// console.log("handle link", window.location.href);
		const pageSetting = this.pageSettingMap.get(window.location.href);
		document.querySelectorAll("a").forEach((element) => {
			//hover mode
			if (pageSetting?.mode ? pageSetting?.mode === 'hover' : this.setting.mode === 'hover') {
				element.addEventListener('mouseover', (event: MouseEvent) => {
					event.preventDefault();
					const target = event.target as HTMLTextAreaElement;
					this.prefetchHover(target);
				});
			}

			element.addEventListener("click", (event: MouseEvent) => {
				event.preventDefault();
				const target = event.target as HTMLTextAreaElement;
				this.updatePageContext({
					href: target.getAttribute("href") || "",
					mode: "go",
				});
			});



		});
	}

	private onPop(event: PopStateEvent): void {
		this.updatePageContext({ href: window.location.href, mode: "back" });
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
		try {
			const response = await fetch(href);
			const htmlString = await response.text();

			if (mode === "go") {
				window.history.pushState(
					{ prev: window.location.href },
					"",
					href
				);
			}

			const parser = new DOMParser();
			const html = parser.parseFromString(htmlString, "text/html");
			const PrefetchSettingJson =  html.getElementById("prefetch-setting")?.getAttribute('data-setting') || "";
			const PrefetchSetting = JSON.parse(PrefetchSettingJson);
			PrefetchSetting && this.setPagePrefetchRule(href, PrefetchSetting);

			document.body = html.body;

			this.render();
			return true;
		} catch (error: any) {
			console.error("Fetch Error:", error.message);
			return false;
		}
	}

	public go(path: string): Promise<boolean> {
		const href = new URL(path, location.origin).href;
		return this.updatePageContext({ href, mode: "go" });
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
		this.handleClientLinkBehavior();
		this.prefetchVisible();
		this.prefetchPage();
		this.prefetchNested(document, 0);
	}

	public setPagePrefetchRule(path: String, setting: PrefetchSetting): void {
		// console.log(path);
		this.pageSettingMap.set(path, setting);
	}
}

export { Link };

function Link({ ...props }) {
	// const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ')
	return <a {...props} />;
}
