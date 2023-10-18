# 環境
## compilerOptions
這一部分包含了arkhi對 TypeScript 編譯器的多數配置選項

##### 模組和目標設置
將目標ECMAScript版本和模組系統都設置為ES2020，意味程式將支持 ES2020 的所有特性，並且在編譯後仍然保持 ES2020 的格式
```json
"module": "ES2020",
"target": "ES2020"
```

##### 模組解析和lib
使用Node.js的模組解析方法，適用於 CommonJS 的模組系統
同時，包括DOM, DOM.Iterable, 和ESNext這幾個lib
```json
"moduleResolution": "Node",
"lib": ["DOM", "DOM.Iterable", "ESNext"],
```

##### 路徑
將模組解析的基礎URL，定為根目錄
使用`#`作為根路徑的別名，讓我們可以基於項目根目錄進行導入
```json
"baseUrl": ".",
"paths": {
	"#/*": ["./*"]
}
```

## ts-node 設置
ts-node 是喪我們可以不用事先將程式編譯為 JavaScript，
讓我們直接執行 TypeScript 文件的工具

以下是關於配置的說明：
* `"transpileOnly": true`：只轉譯代碼，不進行型別檢查
* `"esm": true`：允許使用ES模組語法
* `"module"`:使用支持ESM的NodeNext模組解析策略
```json
"transpileOnly": true,
"esm": true,
"compilerOptions": {
	"module": "NodeNext",
	"moduleResolution": "NodeNext"
}
```
