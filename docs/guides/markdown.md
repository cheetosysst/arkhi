# CMS

arkhi CMS 是為 arkhi 所設計的插件，主要是為了讓開發者能更方便地載入和處理 .md 和 .mdx 文件。以下是主要功能：
1. 掃描指定目錄下的 .md 和 .mdx 文件
2. 將 Markdown 內容轉換為 JSX
3. 解析 Markdown 文件的 front matter 並生成 metadata
5. 生成一個 virtual module，可以讀取指定目錄下所有文件且導出文件內容和metadata
###### 使用[@mdx-js/mdx](https://github.com/mdx-js/mdx)和[gray-matter](https://github.com/jonschlinkert/gray-matter)輔助完成

## 範例
使用時，建議將所有文件的相關操作放至另外的元件中，最後再於頁面檔案引入該元件使用，可以避免metadata提取錯誤

*另開元件*
```tsx
// pages/index/Compents.tsx
import React from 'react';
import { Island } from "#/arkhi/client";
import { allFiles } from '../../content/*';
import ExampleMD, { metadata } from '../../content/games.mdx';

function ExampleComponent_({ ...props }) {
    return (
        <div {...props}>
        //使用單一文件
            <p>{metadata.author}</p>
            <ExampleMD />
        //使用指定資料夾下的所有文件
            {allFiles.map((file, index) => (
                <div key={index}>
                    <h6>{file.metadata.filePath}</h6>
                    <h6>{file.metadata.fileName}</h6>
                    <file.component />
                </div>
            ))}
        </div>
    );
};

const ExampleComponent = Island(ExampleComponent_);
export default ExampleComponent;
```

*在頁面直接使用元件*
```tsx
// pages/index/index.page.tsx
...
import ExampleComponent from "./Compents";
...
function Page() {
	return (
		<>
                    < ExampleComponent />
		</>
	);
}
```
指定資料夾文件時可以用檔案格式篩選
```tsx
import { allFiles } from '../../content/*';
import { allMDFiles } from '../../content/*.md';
import { allMDXFiles } from '../../content/*.mdx';
```
<br/>
可使用的`metadata`如下所列
#####　可自訂：
* `title`: 文件標題
* `author`: 文件的作者名 
* `tags`: 字符串陣列，可用於對內容進行分類
* `description`: 文件的描述或摘要
* `status`: 文件的狀態（例如：```草稿```或```已發佈```）。

#####　自動生成：
* `filePath`: 文件的完整路徑
* `fileName`: 文件名稱（包含格式）
* `readTime`: 預估的閱讀時間（單位：秒）
* `atime`: 文件的上次訪問時間
* `mtime`: 文件的上次修改時間
* `ctime`: 文件的創建時間或metadata的最後修改時間
* `createdAt`: 文件的實際創建時間

只要在文件開頭用以下方法就能自訂部分metadata，若沒有內容則默認為空
```
---markdown
title: 
author:
tags:
description:
status:
---
```
## 原理
CMS主要靠在 arkhi/plugins 檔案夾裡的 cms.ts 和 virtual.d.ts 兩份程式完成功能。

### arkhi/plugins/cms.ts

##### getFilesInDir(dirPath: string, ext: string[]): Promise<string[]>

>getFilesInDir 讀取 dirPath 下的所有文件檔案，並遞歸地找到所有具有指定擴展名(ext)的文件的絕對路徑。最後返回一個包含所有匹配文件絕對路徑的陣列

##### generateModuleContent(id: string, fileTypes: string[], virtualId: string)

>generateModuleContent基於指定的 id 和 fileTypes 生成虛擬模塊的內容。它使用 getFilesInDir 函數來找到所有匹配的文件，然後生成這些文件的導入語句和一個將它們做為組件和metadata array 的導出

##### transformMarkdownContent(id: string, code: string)
>transformMarkdownContent 轉換單個 Markdown 文件的內容。使用 matter 解析文件的 front matter 和內容，分析生成一些額外的metadata，然後使用 @mdx-js/mdx 將文件內容轉換為 JSX。最後，它返回轉換後的 JSX 和一個導出 metadata

##### arkhiCMS(): Plugin
作為插件的核心，用 `resolveId` 解析導入語句的 ID，並轉換它們以指向虛擬模塊、用 `load` 基於 ID 使用generateModuleContent 函數加載虛擬模塊的內容、用`transform` 使用 transformMarkdownContent 函數轉換 .md 或 .mdx 文件的內容

### virtual.d.ts:
為了使 TypeScript 能夠識別和理解如何處理特定的文件類型的宣告文件，告訴 TypeScript 這些文件會導出什麼組件和metadata

* 定義 .md 和 .mdx 文件的metadata結構
* 定義 .md 和 .mdx 文件的組件和metadata結構
* 設定如何導入 .mdx、.md 和其他文件
