# Prefetch

Prefetch是一項瀏覽器機制； 該機制會利用瀏覽器閒置時間，預先下載取回使用者稍後可能造訪的網頁資源。 透過在 renderer/_default.page.client.tsx 中建立並調用 ClientRouter 的實體，並設定模式，就能啟用 Prefetch 的功能。


```tsx
//_default.page.client.tsx
import { ClientRouter } from "arkhi/client"; // 需要加#/嗎?

//@ts-ignore
window.clientRouter ||= new ClientRouter(render, { mode: "visible" });
//@ts-ignore
const clientRouter = window.clientRouter;

function render() {
	clientRouter.beforeRender();
}

export { render };

```

Arkhi 中的 Prefetch 主要提供四種模式 "hover", "visible", "page",  "nested"分別對應不同的 Prefetch 策略:

## Hover
```tsx
new ClientRouter(render, { mode: "hover" });
```
Hover 模式會查看鼠標是否經過或停留在預取連結的元素(Anchor)之上，當該該行為發生時，被觸碰或是停留的連結資源便會自動進行 prefetch 的行為。


## Visible
```tsx
new ClientRouter(render, { mode: "visible" });
```
Visible 模式使用了 ObserverIntersection 的 API 來監聽每個預取連結的元素(Anchor)是否出現在可見的視窗範圍中，當該元素出現時，便會自動進行 prefetch 的行為。

## Page
```tsx
new ClientRouter(render, { mode: "page" });
```
Page 模式會在進入一個頁面鐘後搜尋每個預取連結的元素(Anchor)並自動對該頁面中所有預取連結進行 prefetch 的行為。

## Nested
```tsx
new ClientRouter(render, { mode: "nested" });
```
Nested 模式是四個模式中相對複雜、少用的，此模式會在頁面閒暇時刻，巢狀的進行頁面級別的 prefetch，若預取連結的元素(Anchor)的連結指向同一個 origin，則在資源被取回後繼續對取回的頁面進行 prefetch，直到所有頁面資源皆被取回、或是取回的頁面具有獨立的 prefetch 設定，此部分會在後面進行描述。


## 設定單獨頁面的 Prefetch 模式

要單獨設定某個頁面的 prefetch 模式僅須在該頁面建立並 export 一個名為 PrefetchSetting 的 Object，並在其中包含 mode 設定，則該頁面被讀取時，此設定中的模式將會覆蓋 ClientRouter 初始化時設定的模式，也因此巢狀模式的 Prefetch 會在與頁面模式衝突時，優先使用頁面設定。


```tsx
// pages/..../ index.page.tsx
export { Page };
function Page() {
	return (
		<>
			// Page Content
		</>
	);
}

export const PrefetchSetting = { mode: 'hover' };

```



## 原理

Prefetch 的實現，分別透過 ObserverIntersection 與掛載在每個預取連結的元素(Anchor)上的事件函數完成。 

根據設定模式的不同，掛載函數也會依照不同的環境啟用，並依照需求來調用 prefetch 的函數。