# Islands

Arkhi 框架的核心建立於[島嶼架構（Islnads Architecture）](https://jasonformat.com/islands-architecture/)之上。在需要獲得互動性的元件上，我們需要主動標記其為島嶼。此類元件在前端獨立被 Hydrate，而同頁面中未標記的部份。

```tsx
import "arkhi/client";
const IslandComponent = Island(Component);
```

## 範例

```tsx
import React, { useState } from "react"
import { Island } from "vite/client";
import type { PropsWithChildren } from "vite/client";

// 元件：客戶端不具備互動性
function Counter({ ..props }: PropsWithChildren) {
	const [count, setCount] = useState(0);
	const increment = () => setCount((count) => count + 1)
	return (
		<button onClick={increment} {...props}>
			counter {count}
		</button>
	);
}

// 島嶼元件：客戶端具備互動性
const CounterIsland = Island(Counter);
```

> **Note**  
> `{...props}` 負責於 SSR 時將每個 island 的獨特 id 填入，對要作為 island 使用的元件是必要的。如果在將任何元件島嶼化時遇到問題，建議優先檢查這個部份。

### Props

因為需要在前端重新染島嶼，所有的 Props 都會需要是可以被序列化的內容。為了增加可以被序列化的資料種類，我們使用了 [superjson](https://github.com/blitz-js/superjson) (詳細可使用的資料類別請參見 superjson 說明)。

```tsx
// ❌ 錯誤範例 ❌
import type { PropsWithChildren } from "react";

export default function Component({ children }:PropsWithChildren) {
	return (
		<div className="w-10 bg-black flex">
			{ children }
		</div>
	)
}
```

以上的範例中我們在傳入的 Children 外包上一層 `div` 後加上了一些 styling，雖然這是相當常見的 Pattern，但這在我們的環境中回遇上一些問題。

島嶼在前端渲染時仰賴將事先序列化的資料作為他的 props，這代表無法被序列化的資料（像是複雜的元件）就會遇上選染錯誤。

> **Note**  
> [superjson](https://github.com/blitz-js/superjson#parse) 所支援的資料型別

就像大海中一個真的小島，外部的能提供的資源補給有限，多半的時候會需要自給自足。若是島嶼有需要外部的其他元件作為其 children，可以改為透過 props 選用預先設定好的元件。

```tsx
import type { PropsWithChildren } from "react";
import { Foo, Bar } from "./Components.tsx";

const options = {
	foo: <Foo />,
	bar: <Bar />,
} as const;

export default function Component({ child, ...props }: { child: keyof typeof options }) {
	return (
		<div className="w-10 bg-black flex">
			{ options[child] }
		</div>
	)
}
```

> **Pitfull**  
> 為了更好的發揮島嶼的特性，請參閱 [管理島嶼](/docs/guides/manage_islands.md)。

## 原理

在大部份的框架中，會在 HTML body 中放置一個 `<div id="root"></div>`，於客戶端讓 React-DOM 對此 Element 進行 Hydrate。

在島嶼架構中，我們只對於需要互動性的區塊進行 Hydrate，行程一個一個具備互動性的區塊，一個個「島嶼」。