# [Day05] - Tokenizer - 逐字分析 ( Word By Word Tokenizer )

昨天的例子中，

第二步的 `#` 在解析實作時，需要修改到前面 `=` 的解析，這樣在擴展的時候會變得很麻煩。

而且換一個解析規則，可能就需要大幅修改程式碼。這樣的解析方式相信 `邦友` 也不會滿意。

那我們要怎麼辦呢 ? 

這時我們可以`逐字分析` ，將 `.env` 的內容轉換成 `Tokens`，這個過程也被稱之為 `Tokenizer`。

下面先來給一個 `Tokenizer` 的範例：

以昨天檔案 `.env-sample` 為例

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

經過 `Tokenizer` 處理後，會變成下面的 `Tokens`：

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

---

剛剛發現 龍哥今年的主題是 [自製程式語言](https://ithelp.ithome.com.tw/articles/10293360) ，本文應該會有部分主題與之相同的，  
如果本文有解釋不清的部分，可以看龍哥的文章 （；´д｀）ゞ

### 參考資料

- [龍哥 - 自製程式語言 Day 03 - Tokenizer](https://ithelp.ithome.com.tw/articles/10293360)
