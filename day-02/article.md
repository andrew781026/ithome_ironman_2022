# [Day02] - Parser 是什麼，可以吃嗎？

昨天說了很多次 Parser，但是那到底是是什麼呢？

其實 Parser 就是將文字做解析的並將其轉換成 抽象語法樹（Abstract Syntax Tree，AST）的黑盒子函式。

打個比方，有個套件叫做 `dotenv`

他可以自動將 `.env` 檔案中的環境變數載入到 `process.env` 中。

使用如下 :

當我們有個 `.env` 檔案

```properties
# .env
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

我們就會取到下述的資訊

```js
require('dotenv').config();
console.log(process.env);
// { S3_BUCKET: 'YOURS3BUCKET', SECRET_KEY: 'YOURSECRETKEYGOESHERE' }
```

其實 `require('dotenv').config()` 內部執行了 3 個動作

1. 讀取 .env 檔案
2. 將 .env 檔案內容轉換成 AST ( Parser )
3. 將 AST 資訊放入 process.env 中

拆開來大概如下的感覺 ,

```js
const dotenv = require('dotenv');
const fs = require('fs');

// 1. 讀取 .env 檔案
const properties = fs.readFileSync('.env').toString();

// 2. 將 .env 檔案內容轉換成 AST ( Parser )
const parsed = dotenv.parse(properties);

// 3. 將 AST 資訊放入 process.env 中
Object.keys(parsed).forEach(key => process.env[key] = parsed[key]);

// 4. 檢查 process.env 是否有 .env 的資料
console.log('process.env=', process.env);
```

第二步 , 就是所謂的 Parser ,

也就是說 , 下方的文字經過 Parser 後 , 就會變成一個 Object ( 我們大多稱之為 AST )

![](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-02/parse-schematic.png)

明天我們就來更進一步的了解 dotenv 是如何將 `.env` 檔案轉換成 AST 的。
