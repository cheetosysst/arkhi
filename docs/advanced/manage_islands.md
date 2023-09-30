# 管理島嶼

<!-- TODO 增加圖表 -->

島嶼架構讓我們能夠更輕易的寫出具備優良使用者體驗的網頁，同時降低記憶體和各項資源的浪費。

但是為了更好的發揮島嶼架構的優勢，以下我們將分為幾項重點探討。在了解我們的框架背後運行的方式，相信你也可以更輕易的撰寫出高效的網站。

## 島嶼的渲染流程

頁面首次載入時，我們並不知道網頁中的島嶼都在哪裡。所以在 Hydration 開始前，我們需要先探勘整個網頁，建立出一個「地圖」。在 Arkhi 中，我們這個流程稱為 **walk & explore**。

從 body 開始走訪整個 DOM tree，當遇到一個島嶼時，我們會退回該元素的母元素，將其 Children，包含一或多個島嶼和其他非島嶼的元素，重建為一個 React Fragment。

這麼做的原因和 ReactDOM 渲染的方式有關，我們無法做到原地 Hydrate。但是強制要求島嶼包覆於其他元素中以利渲染會造成 Styling 上的困難，所以我們採用了於客戶端重建母元素下包含島嶼在內的所有內容為一個新的元件。

### 當你遇上了群島

當我們在撰寫頁面時，我們能夠按照島嶼渲染流程思考頁面中互動性的安排，以獲得更好的島嶼效果。

```tsx
import Subscribe from "./Components.tsx"

const SubscribeIsland = Island(Subscribe);

export default function Page() {
	return (
		<>
			<p>
				<h1>Post title</h1>
			</p>
			<SubscribeIsland />
			<p>
				Et anim pariatur pariatur aliqua deserunt ea ea ea do irure ea....
			</p>
		</>
	);
}
```

在上述範例，我們在一個文章頁面中間插入了一個訂閱按鈕。根據先前提到的選染流程，我們在重建元件時會將標題以及內文都納入其中，導致該元件在重建時花費不必要的記憶體何時間。為了解決這項問題，我們可以更改成：

```tsx
export default function Page() {
	return (
		<>
			<p>
				<h1>Post title</h1>
				<SubscribeIsland />
			</p>
			<p>{/** contents... */}</p>
		</>
	);
}
```

### 島嶼上的資源

以下是一個錯誤的範例

```tsx
import { Foo, Bar } from "./Components.tsx";

const FooIsland = Island(Foo);
const BarIsland = Island(Bar);

export default function Page() {
	return (
		<FooIsland>
			<BarIsland />
		</FooIsland>
	);
};
```

Pass 給島嶼的資料都必須是可以被序列化的型別，而因為 Component 不可被絮裂化，所以我們無法將 `<BarIsland />` 作為子元件傳入。

> **Note**  
> [superjson](https://github.com/blitz-js/superjson#parse) 所支援的資料型別

就像大海中一個真的小島，外部的能提供的資源補給有限，多半的時候會需要自給自足。若是島嶼有需要外部的其他元件作為其 children，可以改為透過 props 選用預先設定好的元件。

為了達到類似的效果，我們可以將島嶼改為

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

並且在使用此島嶼時改用選項的方式

```tsx
export default function Page() {
	return (
		<>
			<Component child="foo" />
		</>
	)
}
```

我們推薦使用 TypeScript 中的 `as const` 語法建立選項，並直接取用對應的子元件。

## 你真的需要 JavaScript 嗎？

React 撰寫時許多的方便性，使得我們經常站在 JavaScript 的角度思考網頁結構。然而這也造成了許多盲點，使得我們浪費 JS 在完成不必要的工作。

舉例來說：

```tsx
function Checker() {
	const [open, setOpen] = useState(true);
	return (
		<>
			<button class="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer" onClick={()=>setOpen(!open)} />
			{ open ?
				<div class="mt-4 flex p-4 bg-gray-200">
					Consequat aliqua dolor adipisicing elit sunt esse ut minim cupidatat incididunt ea aliquip reprehenderit.
				</div>
				: <></>
	 		}
		</>
	)
}
```

可以被改寫成純 HTML 和 CSS 的版本，並達到一樣的效果。

```html
<input type="checkbox" class="hidden peer/toggle" id="toggle" />
<label
	for="toggle"
	class="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
>
	Toggle Content
</label>
<div
	class="hidden mt-4 peer-checked/toggle:flex p-4 bg-gray-200"
	id="content"
>
	Consequat aliqua dolor adipisicing elit sunt esse ut minim cupidatat incididunt ea aliquip reprehenderit.
</div>
```

在判斷是否需要使用島嶼時就很適合思考，究竟有沒有使用 JavaScript 的必要。若是能夠運用 CSS 達到同樣的目的，那我們就能夠節省不少 JavaScript 的工作量，提昇一個網頁的效能。