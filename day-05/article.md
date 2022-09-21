# [Day05] - Tokenizer - 逐字分析 ( Word By Word Tokenizer )

昨天介紹了逐行解析 , 今天我們來說明另一個解析方法 `逐字解析` 吧 ~ 

### 解析方法二：逐字解析

逐字解析會需要經歷兩個步驟 , 才會變成像昨天一樣的 AST

1. 將字串轉成 token 陣列 ( Tokenizer )
2. 將 token 陣列轉成 AST ( Parser )

![](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-05/word-by-word.png)

那經過 Tokenizer 後的 Token 陣列長什麼樣子呢 ?

先來給一個的舉個例子：

昨天檔案 `.env-sample` 的內容如下：

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
-----END DSA PRIVATE KEY-----"
```

經過 `Tokenizer` 處理後，預計變成下面的 `Tokens`：

```json
[
  { "type": "comment", "value": "# .env-sample file" },
  { "type": "comment", "value": "# This is a comment" },
  { "type": "key", "value": "SECRET_KEY" },
  { "type": "equal", "value": "=" },
  { "type": "value", "value": "YOURSECRETKEYGOESHERE" },
  { "type": "comment", "value": "# comment" },
  { "type": "key", "value": "SECRET_HASH" },
  { "type": "equal", "value": "=" },
  { "type": "value", "value": "something-with-a-#-hash" },
  { "type": "key", "value": "PRIVATE_KEY" },
  { "type": "equal", "value": "=" },
  { "type": "value", "value": "-----BEGIN RSA PRIVATE KEY-----\n...\nKh9NV...\n...\n#### 5678\n-----END DSA PRIVATE KEY-----" }
]
```

也就是 (.env string) --[ Tokenizer ]--> (Tokens)

如下方式意圖所示

![](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-05/tokenizer.png)

明天我們將說明實作 `Tokenizer` 需要用的的工具 `狀態機` 

---

剛剛發現 龍哥今年的主題是 [自製程式語言](https://ithelp.ithome.com.tw/articles/10293360) ，本文應該會有部分主題與之相同的，  
如果本文有解釋不清的部分，可以看龍哥的文章 （；´д｀）ゞ

### 參考資料

- [龍哥 - 自製程式語言 Day 03 - Tokenizer](https://ithelp.ithome.com.tw/articles/10293360)
