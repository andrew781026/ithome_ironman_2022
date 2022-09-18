# [Day03] - .env 規則說明與解析準備

在 .env 我們可能會遇到下述的規則

## 1. 參數 ( = 前面是變數名稱 , 後面是值 )

```properties

```properties
S3_BUCKET="YOURS3BUCKET"
SECRET_KEY="YOURSECRETKEYGOESHERE"
```

## 2. 多行 ( 用 "" 包住多行文字 , 當作值是多行內容 )

```properties

```properties
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END DSA PRIVATE KEY-----"
```

## 3. 註解 ( = 前面是變數名稱 , 後面是值 )

```properties
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
``` 

---

我們分析上方 3 條規則發現可以整理成以下的規律

1. 以 `=` 作為分隔符號 , 前面當變數 , 後面當值
2. 遇到 `#` 後面就全是註解 , 後面不用解析 , 直接換下一行做解析
3. `"` 是一對的 , 當前面遇到
4. 在 `"` 裡面的 `#` 不會被當作註解 , 而是當作一般的字元

---

根據上面整理的 4 個規則 ,  下面我們來手做一個 Parser 吧 ~

首先 , 將我們要測試的 sample .env 檔案 , 拿出來吧 ![haha](https://ithelp.ithome.com.tw/images/emoticon/emoticon07.gif)

```properties
# .env-sample file 
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END DSA PRIVATE KEY-----"
```

接下來 , 我們開始動工吧 （￣︶￣）↗　
    
```javascript
// myDotEnvParser.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串
const fs = require('fs');
const str = fs.readFileSync('./.env-sample', 'utf8');

// 第二步 - 定義特定字元
const EQUAL = '=';
const COMMENT = '#';
const QUOTATION = '"';

// 第三步 - 逐字讀取 , 遇到特定字元( # . " . = )做特別處理
const charList = str.split('');
for (let i = 0; i < charList.length; i++) {
    
}
```
