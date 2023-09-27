# Islands

Arkhi 框架的核心建立於[島嶼架構（Islnads Architecture）](https://jasonformat.com/islands-architecture/)之上。在需要獲得互動性的元件上，我們需要主動標記其為島嶼。此類元件在前端獨立被 Hydrate，而同頁面中未標記的部份。

```tsx
import "arkhi/client";
const IslandComponent = Island(Component);
```

## 範例

```tsx

```

## 原理
