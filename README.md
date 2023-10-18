# Arkhi.js - 基於島嶼架構的前端框架

「Arkhi」一詞源自群島（Archipelagos）語源「Arhki」（意味 Chief）和「pelagos」（意味 Sea）。我們利用[島嶼架構](https://www.patterns.dev/posts/islands-architecture)的設計，協助開發者們規劃出一個個「互動性的小島」，輕鬆建立輕量、快速的網站。

Demo: (WIP)

## 安裝 Installation

```bash
npx create-arkhi@latest my-app

cd my-app

npm i # pnpm, yarn, bun 
```

## 支援功能

- 🔷 **TypeScript 優先**  
    Arkhi 重視型別安全在開發時帶來的優勢以及更高的開發者體驗（UX），Arkhi 除了使用 TypeScript 開發，也預設提供 tRPC 以方便確保前後端的型別安全。
- ✏️ **Markdown 支援**  
    支援並整合 Markdown 和 MDX 格式至框架中，方便撰寫具備互動性的文檔網站，或是其他靜態內容為主的應用。
- ⚡ **Vite**  
    使用 Vite 以獲得更佳的冷啟動速度、編譯時間、以及整體的開發體驗。

## Getting Started

更詳細的介紹請見 [Getting Started](./docs/start/getting_started.md)。

### 建立島嶼

```tsx
import { useState } from "react";
import { Island } from "arkhi/client";

const Counter = ({...props}) => {
	const [state, setState] = useState();
	return (
		<button onClick={()=>setState(state+1)} {...props}>
			{state}
		</button>
	);
}
const CounterIsland = Island(Counter);

export default function Page() {
	return (
		<>
			<div>
				靜態： <Counter /> 
			</div>
			<div>
				動態： <CounterIsland />
			</div>
		</>
	);
}
```

透過島嶼 HOC 包裹住，我們將範例中第二個 Counter 標記為島嶼，在客戶端載入時渲染。而第一個 Counter 因為沒有包裹住，所以在客戶端會保持靜態。

須注意一定要加上 `{...props}`，Island 才能夠標記島嶼。

### 分享狀態

```tsx
import { Share, useShare } from "arkhi/client";

export data = new Share<string>("init data");

export function Foo() {
	const share = useShare(data);
	return (
		<button onClick={() => data.data+=1 }>
			Click { share }
		</button>
	);
} 
```
由於在不同的島嶼之間無法共享狀態，我們使用 Share API 解決這個問題。`useShare()` 會在資料更新時自動提醒所有訂閱資料的島嶼重新選染，達到跨島嶼共享狀態。

## 島嶼架構

島嶼架構指的是在客戶端針對需要互動性的地方進行渲染，以降低載入時間與提高運作效率的設計。對比渲染整個頁面，在島嶼架構珠我們只會針對性的對需要互動性的部份進行 hydration，並且讓多數的界面保持靜止。

了解更多：[Islands Architecture - patterns.dev](https://www.patterns.dev/posts/islands-architecture)

