# [Day02] - Parser 是什麼，可以吃嗎？

昨天說了很多次 Parser，但是那到底是是什麼呢？

其實 Parser 就是將文字做解析的並將其轉換成 抽象語法樹（Abstract Syntax Tree，AST）的黑盒子函式。

打個比方，有個套件叫做 `dotenv`

他可以自動將 `.env` 檔案中的環境變數載入到 `process.env` 中。

使用如下 :

```js
require('dotenv').config();
console.log(process.env);
// { NODE_ENV: 'development', PORT: '3000' }
```

而 `require('dotenv').config()` 其實執行了的幾個動作

1. 讀取 .env 檔案
2. 將 .env 檔案內容轉換成 AST ( Parser )
3. 將 AST 資訊放入 process.env 中

拆開來大概如下的感覺 , 

```js

```
