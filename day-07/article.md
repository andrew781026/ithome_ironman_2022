# [Day07] - 逐字分析的行前準備(二) - .env 的狀態圖

### 前情提要

在 day-03 我們建立了一個 .env-sample 的檔案，今天我們要用 `狀態機` 的方式來解析這個檔案。

### 第一步，回顧 .env-sample 的檔案

```properties
# .env-sample file
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
#### 5678
-----END RSA PRIVATE KEY-----"
``` 

### 第二步，整理出關鍵的字元

在之前的規則分析中，我們可以直觀的知道 3 個關鍵字元

1. `=` 切分 key 和 value
2. `#` 設定註解
3. `"` 多行處理

其實還有第四個關鍵字元，換行 `\n`，當單行處理時，換行就是 value 的結束點。

### 第三步，整理出關鍵的條件

我們先用文字跟條列的方式來整理一下，遇到特殊字元時，可能需要什麼改變，來確立有哪些狀態。

1. 遇到非關鍵字元，如 a . b . c . d ...時



### 參考資料

- [Day 21：什麼是「有限狀態機」？](https://ithelp.ithome.com.tw/articles/10225343)
- [Day08 - 實作一個狀態機 - 1](https://ithelp.ithome.com.tw/articles/10270230)
- [台部落 - 用python模擬電梯程序](https://www.twblogs.net/a/5bafa38b2b7177781a0f391a)
- [WIKI - 有限狀態機](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)
