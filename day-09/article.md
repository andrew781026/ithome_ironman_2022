# [Day09] - 逐字分析最後一哩路 Parser - Tokens to AST 

複習一下，逐字分析會經過兩個步驟 Tokenizer 跟 Parser

![tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-09/tokens-parser.png)

下面我們來說明 & 實作此 Parser 吧 ~

### 第零步，複習一下目標的輸入 & 輸出

> 輸入的 Tokens

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

> 目標輸出的 AST

```JS
const AST = {
    SECRET_KEY: 'YOURSECRETKEYGOESHERE',
    SECRET_HASH: 'something-with-a-#-hash' ,
    PRIVATE_KEY: '-----BEGIN RSA PRIVATE KEY-----\n...\nKh9NV...\n...\n#### 5678\n-----END DSA PRIVATE KEY-----' ,
}
``` 

### 第一步，逐個取出 Token 然後 AST 化

```JS
const parse = (tokens) => {
    const AST = {}
    let key = ''
    
    while (tokens.length) {
        const token = tokens.shift()
        if (token.type === 'key') {
            key = token.value
        } else if (token.type === 'value') {
            AST[key] = token.value
        }
    }
}
``` 

### 總結

經過昨天的 Tokenizer & 今天的 Parser，我們已經可以把 .env 檔案轉換成要塞入 process.env 的物件了 \(￣︶￣*\))

---

明天我們開始分析 HTML 的規則，想辦法生成它的 Tokenizer 跟 Parser 吧 ~

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
