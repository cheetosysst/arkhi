# Arkhi.js - 基於島嶼架構的前端框架

「Arkhi」一詞源自群島（Archipelagos）語源「Arhki」（意味 Chief）和「pelagos」（意味 Sea）。我們利用[島嶼架構](https://www.patterns.dev/posts/islands-architecture)的設計，協助開發者們規劃出一個個「互動性的小島」，輕鬆建立輕量、快速的網站。

Demo: (WIP)

## 安裝 Installation

```bash
npx create-arkhi@latest my-app

cd my-app

npm i # pnpm, yarn, bun 
```

## 島嶼架構

島嶼架構指的是在客戶端針對需要互動性的地方進行渲染，以降低載入時間與提高運作效率的設計。對比渲染整個頁面，在島嶼架構珠我們只會針對性的對需要互動性的部份進行 hydration，並且讓多數的界面保持靜止。

了解更多：[Islands Architecture - patterns.dev](https://www.patterns.dev/posts/islands-architecture)

