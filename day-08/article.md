# [Day08] - 逐字分析的實做 - myDotEnvTokenizer.js

昨天我們分析了狀態變更的規則 & 狀態圖，今天我們來將昨天的分析實做出來。

### 第零步，讀取檔案 & 轉換成字元陣列

```JS
// 讀取檔案內容 
const fs = require('fs');
const str = fs.readFileSync('.env-sample', 'utf8');

// 切分成字元陣列
const charList = str.split('');
``` 

### 第一步，逐字將字元取出，將字元收集起來到 collected 變數中

```JS
let collected = '';

while (charList.length > 0) {

    const current = charList.shift();
    
    /*
    * 在這裡處理特殊字元對應要做什麼事
    */

    // 如果沒遇到特殊字元 , 就將 char 收集起來
    if(current !== '\r') collected += current;
}
``` 

### 第二步，定義關鍵的狀態

```JS
const STATUS = {
    NORMAL: 0,
    IN_QUOTATION: 1,
    IN_COMMENT: 2,
    AFTER_EQUAL: 3,
}
``` 

### 第三步，準備 tokens 陣列，用來收集 token & 清空 collected 的函式

```JS
const tokens = [];
const resetCollect = () => collected = '';
``` 

### 第四步，實作昨天分析的狀態變化規則

> 4.1 - NORMAL 的狀態變化

```JS
const handle_NORMAL = current => {

    // NORMAL 狀態時遇到 `#` ，切換狀態為 IN_COMMENT
    if (current === '#') {
        CURR_STATUS = STATUS.IN_COMMENT;
    }
    
    // NORMAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION
    if (current === '"') {
        CURR_STATUS = STATUS.IN_QUOTATION;
    }
    
    // NORMAL 狀態時遇到 `=` ，切換狀態為 AFTER_EQUAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字
    if (current === '=') {
        CURR_STATUS = STATUS.AFTER_EQUAL; // change to after equal status ( collect value )
        tokens.push({type: 'key', value: collected}); // the collected is key
        resetCollect();
    }
    
    // NORMAL 狀態時遇到 `\n` ，不做處理，收集下個字元
    if (current === '\n') {
        // do nothing
    }
}
``` 

> 4.2 - IN_QUOTATION 的狀態變化

```JS
const handle_IN_QUOTATION = current => {

    // IN_QUOTATION 狀態時遇到 `=` . `\n` . `#` ，不做處理，收集下個字元
    if (current === '\n' || current === '=' || current === '#') {
        // do nothing
    }

    // IN_QUOTATION 狀態時遇到 `"` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '"') {
        CURR_STATUS = 0;
        tokens.push({type: 'value', value: collected});
        resetCollect();
    }
}
``` 

> 4.3 - IN_COMMENT 的狀態變化

```JS
const handle_IN_COMMENT = current => {

    // IN_COMMENT 狀態時遇到 `=` . `"` . `#` ，不做處理，收集下個字元
    if (current === '"' || current === '=' || current === '#') {
        // do nothing
    }

    // IN_COMMENT 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '\n') {
        CURR_STATUS = STATUS.NORMAL;
        tokens.push({type: 'comment', value:'#'+ collected});
        resetCollect();
    }
}
``` 

> 4.4 - AFTER_EQUAL 的狀態變化

```JS
const handle_AFTER_EQUAL = current => {

    // AFTER_EQUAL 狀態時遇到 `=` . `"` . `#` ，不做處理，收集下個字元
    if ( current === '=' || current === '#') {
        // do nothing
    }

    // AFTER_EQUAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION
    if (current === '"') {
        CURR_STATUS = STATUS.IN_QUOTATION;
    }

    // AFTER_EQUAL 狀態時遇到 `#` ，切換狀態為 NORMAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字
    if (current === '#') {
        CURR_STATUS = STATUS.IN_COMMENT;
        tokens.push({type: 'value', value: collected});
        resetCollect();
    }

    // AFTER_EQUAL 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '\n') {
        CURR_STATUS = STATUS.NORMAL;
        tokens.push({type: 'value', value: collected});
    }
}
``` 

### 完整程式碼

將上面的區塊做整合，就可以得到 完整程式碼 `myDotEnvTokenizer.js`

```
// 讀取檔案內容 
const fs = require('fs');
const str = fs.readFileSync('.env-sample', 'utf8');

// 切分成字元陣列
const charList = str.split('');

// 狀態列表
const STATUS = {
    NORMAL: 0,
    IN_QUOTATION: 1,
    IN_COMMENT: 2,
    AFTER_EQUAL: 3,
}

// 收集資訊的變數
let collected = '';
let CURR_STATUS = STATUS.NORMAL;

// tokens 陣列
const tokens = [];

// 清空 collected 函式
const resetCollect = () => collected = '';

while (charList.length > 0) {

    const current = charList.shift();

    if(CURR_STATUS === STATUS.NORMAL) handle_NORMAL(current);
    if(CURR_STATUS === STATUS.IN_QUOTATION) handle_IN_QUOTATION(current);
    if(CURR_STATUS === STATUS.IN_COMMENT) handle_IN_COMMENT(current);
    if(CURR_STATUS === STATUS.AFTER_EQUAL) handle_AFTER_EQUAL(current);

    // 如果沒遇到特殊字元 , 就將 char 收集起來
    if(current !== '\r') collected += current;
}
```

另外想看追加例外處理的部分[可到 GITHUB 查看](https://github.com/andrew781026/ithome_ironman_2022/blob/main/day-08/myDotEnvTokenizer.js)

---

今天我們花了幾天的時間，終於實做出 env 的 Tokenizer，相信邦友們一定沒有忘記，我們期望設定給 `process.env` 的是 AST ，而不是今天的 Tokens。

> AST

```JS
const AST = {
    SECRET_KEY: 'YOURSECRETKEYGOESHERE',
    SECRET_HASH: 'something-with-a-#-hash' ,
    PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\n...\nKh9NV...\n...\n#### 5678\n-----END DSA PRIVATE KEY-----' ,
}

``` 

> Tokens

```JS
const tokens = [
    { "type": "comment", "value": "# .env-sample file" },
    { "type": "comment", "value": "# This is a comment" },
    { "type": "key", "value": "SECRET_KEY" },
    { "type": "value", "value": "YOURSECRETKEYGOESHERE" },
    { "type": "comment", "value": "# comment" },
    { "type": "key", "value": "SECRET_HASH" },
    { "type": "value", "value": "something-with-a-#-hash" },
    { "type": "key", "value": "PRIVATE_KEY" },
    { "type": "value", "value": "-----BEGIN RSA PRIVATE KEY-----\n...\nKh9NV...\n...\n#### 5678\n-----END DSA PRIVATE KEY-----" }
]
``` 

明天我們就來說明 Tokens 要如何轉換成 AST 吧 ~

---

### 參考資料

- [dotenv](https://github.com/motdotla/dotenv/blob/v15.0.0/lib/main.js) - dotenv 原始碼
