export class ClientRouter {
	private prefetched: Set<String> = new Set<String>();
	private observer: IntersectionObserver;
	private render: Function;

	constructor(opt: { render: Function }) {
		this.render = opt.render;
		if (window?.history) {
			window.addEventListener("popstate", (e) => this.onPop(e));
			this.prefetchVisible();
		}
	}

	private createLink: any = (url: string): void => {
		//create link for prefatch
		const linkElement = document.createElement("link");
		linkElement.rel = "prefetch";
		linkElement.href = url;
		linkElement.as = "document";

		linkElement.onerror = (err) =>
			console.error("prefetched error", url, err);

		document.head.appendChild(linkElement);

		const href = new URL(url, location.origin).href;
		this.prefetched.add(href);
	};

	private prefetchVisible(): void {
		if ("IntersectionObserver" in window) {
			// cant use Logical OR assignment ||=, make the error [vite] Error when evaluating SSR
			this.observer ||
				(this.observer = new IntersectionObserver(
					(entries, observer) => {
						entries.forEach((entry) => {
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
	}

	/**
	 * modify html <a> tag behavior
	 */
	private handleClientLinkBehavior(): void {
		document.querySelectorAll("a").forEach((element) => {
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

			let parser = new DOMParser();
			let html = parser.parseFromString(htmlString, "text/html");
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
	public beforeRender() {
		this.handleClientLinkBehavior();
		this.prefetchVisible();
	}
}

export { Link };

function Link({ ...props }) {
	// const className = [props.className, pageContext.urlPathname === props.href && 'is-active'].filter(Boolean).join(' ')
	return <a {...props} />;
}
