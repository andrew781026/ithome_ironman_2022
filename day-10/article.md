# [Day10] - HTML 解析前說明

接下來我們根據之前的步驟來分析 HTML ，想辦法生成它的 Tokenizer 跟 Parser 吧 ~

1. 歸納出 `狀態圖`
2. 利用狀態圖實做出 Tokenizer
3. 產生 Parser 將 Tokens 轉換成 AST

與 .env-sample 分析時相同，我們先來看看 HTML 的輸入文字 & 預期的輸出 Tokens . AST 吧 ~

#### 輸入的文字

```HTML
<div>
    <p>Vue</p>
    <p>Template</p>
</div>
```

#### 預期的輸出 Tokens

```JS
const tokens = [
    { "type": "tagStart", "name": "div" },
    { "type": "tagStart", "name": "p" },
    { "type": "text", "content": "Vue" },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagStart", "name": "p" },
    { "type": "text", "content": "Template" },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagEnd", "name": "div" },
]
```

#### 預期的輸出 AST

```JS
const AST = {
    type: 'root',
    children: [
        {
            "type": "div",
            "children": [
                {
                    "type": "p",
                    "children": [
                        {
                            "type": "text",
                            "content": "Vue"
                        }
                    ]
                },
                {
                    "type": "p",
                    "children": [
                        {
                            "type": "text",
                            "content": "Template"
                        }
                    ]
                }
            ]
        }
    ]
}
``` 

也就是再次分析 HTML 並且製造出 Tokenizer 跟 Parser

1. Tokenizer - 由 HTML 產生 Tokens
2. Parser - 由 Tokens 產生 AST

![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-10/html-tokens-parser.png)

明天我們來分析 HTML 的狀態圖，之後利於我們建立 Tokenizer q(≧▽≦q)

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
