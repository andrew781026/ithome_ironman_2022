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

---

今天有邦友問我，整個系列，只有看到文字分析，搞不太懂這有什麼用處 ?

這邊我放一張 Vue 是如何將 <template> 中的 HTML 字串轉換成 HTML DOM 的圖，可以讓你更了解這個系列的用途。

![vue-parse-flow](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-07/vue-parse-flow.gif)

### 參考資料

- [[譯]Vue.js內部原理淺析](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713771/)
