# 安裝

在本章節，我們將簡單了解如何安裝 Arkhi 框架。

- Arkhi 核心：https://www.npmjs.com/package/arkhi
- 安裝工具：https://www.npmjs.com/package/create-arkhi

## 自動安裝

### 初始化專案

```bash
npm create arkhi@latest my-project
# 或是
pnpm create arkhi@latest my-project
```

> **Note**  
> 由於 [Bun](https://bun.sh) 目前在解析版本上有些問題，我們無法 100% 驗證安裝工具在 bun 的執行狀況。

### 安裝套件

```bash
cd my-project

npm install
# 或是
pnpm install
```

🎉 **恭喜！** 你成功建立了第一個 Arkhi 專案！

下一步: [Getting Started](./getting_started.md)

## 手動安裝

Arkhi 底層使用 [Vike](https://vike.dev) 和 [Vite](https://vitejs.dev/) 負責處理框架事務，Arkhi 核心負責在此基礎上提供島嶼架構和相關輔助設施。理論上你能夠使用 Vike 建立專案，再自行將 Arkhi 的 API 串接上。

