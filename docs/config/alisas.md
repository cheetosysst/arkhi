# package.json
package.json 連接和配置所有的工具和依賴。以下說明可以幫助你理解和最大化利用**arkhi**的配置
##　腳本
透過 `npm` 可以執行腳本

* **dev**:
    * 啟動開發伺服器
* **prod**
    * 首先建構專案，然後使用生產模式啟動伺服器
* **build**
    * 用 Vite 工具進行專案建構，將 TypeScript 代碼編譯為可在瀏覽器中運行的 JavaScript
* **build:arkhi**
    * 在 arkhi 目錄下構建腳本
* **server**
    * 使用 ts-node 啟動伺服器，允許 TypeScript 代碼直接運行，無需事先編譯
* **server:prod**
    * 以生產模式運行伺服器

## 依賴
專案在運行時需要的依賴。包括框架（如 React）、工具庫、API 客戶端等

特別要注意的依賴包括：

* **vike** 和 **vite**： 做為基底的前端開發和構建工具
* **@trpc/client** 和 **@trpc/server**： 用於簡化客戶端與伺服器之間的通訊的工具
* **@types/express** ：提供了 Express 對 TypeScript 型別定義，於開發時建構伺服器使用
* **type**: 模組類型設置為 `module`，表示在程式中使用 `ECMAScript` 模組語法（*import/export*）
* **workspaces**: arkhi 會被指定為一個工作空間


```json
//package.json
{
  "name": "arkhi",
  "description": "Islands architecture based meta framework",
  "scripts": {
    "dev": "npm run server",
    "prod": "npm run build && npm run server:prod",
    "build": "vite build",
    "build:arkhi": "npm run build -w ./arkhi",
    "server": "ts-node server.ts",
    "server:prod": "cross-env NODE_ENV=production ts-node server.ts"
  },
  "dependencies": {
    "@mdx-js/mdx": "^2.3.0",
    "@trpc/client": "^10.37.1",
    "@trpc/server": "^10.37.1",
    "@types/compression": "^1.7.2",
    "@types/node": "^18.11.9",
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.3",
    "@vitejs/plugin-react": "^3.0.0",
    "compression": "^1.7.4",
    "cross-env": "^7.0.3",
    "express": "^4.18.1",
    "gray-matter": "^4.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sirv": "^2.0.2",
    "superjson": "^1.13.1",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.4",
    "vike": "^0.4.92",
    "vite": "^4.0.3",
    "zod": "^3.22.2"
  },
  "license": "MIT",
  "type": "module",
  "devDependencies": {
    "@types/express": "^4.17.18"
  },
  "workspaces": [
    "arkhi"
  ]
}
```