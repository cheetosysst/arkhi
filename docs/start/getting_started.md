# 開始

## 介紹
**arkhi**，在希臘語中的涵意是「領袖」。當與海(pelagos)的概念結合，可以得到「群島」—— *archipelago* (*αρχιπέλαγος*)

這正是**arkhi**的理念來源。通過「群島架構」(Islands Architecture)和自定義的render方法，可以極大提升前端的開發體驗

在[基本文檔](../basic/)中，可以查看arkhi是如何建構群島架構的；而在[指南](../guides/)中，可以了解arkhi所提供的APIs

## 支持
**arkhi**與`vike`一樣，默認支持能運行`ESM`的網頁瀏覽器，並且透過`Node.js`執行

除此之外，還有以下特性：
* 通過`tRPC`，簡化客戶端與伺服器端的通訊過程，自動處理資料的序列化和反序列化以及通訊協定等底層細節
* 利用`ts-node`將`TypeScript`轉換成`JavaScript`，能夠直接在`Node.js`環境下運行`TypeScript`，無需預先編譯

## 命令介面
安装 **arkhi** 後，可以使用 `npm run server` 執行文件，或者直接使用 `ts-node server.ts` 執行。
以下是 **arkhi** 中默認的 npm scripts：
```json
"scripts": {
    "dev": "npm run server",// 啟動 dev 伺服器
    "prod": "npm run build && npm run " // 建構並啟動生產模式伺服器
    "build": "vite build", // 針對生產模式環境進行建構
    "build:arkhi": "npm run build -w ./arkhi",// 在arkhi工作區執行建構
    "server": "ts-node server.ts",// 使用 ts-node 啟動伺服器
    "server:prod": "cross-env NODE_ENV=production ts-node server.ts"// 在生產模式下使用 ts-node 啟動伺服器
}
```
查看[設置](../config/alisas.md)了解更多命令和配置
