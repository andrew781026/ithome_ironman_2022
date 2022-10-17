# [Day13] - 簡易 HTML 的 Parse 實作示意圖

如何將 HTML 的 Tokens 轉換成目標 AST 呢？

今天我們來說明一下

### 第零步，確定輸入 & 輸出

> 預期輸出 - Tokens

```js
const tokens = [
    {"type": "tagStart", "name": "div"},
    {"type": "tagStart", "name": "p"},
    {"type": "text", "content": "Vue"},
    {"type": "tagEnd", "name": "p"},
    {"type": "tagSelfClose", "name": "input"},
    {"type": "tagStart", "name": "p"},
    {"type": "text", "content": "Template"},
    {"type": "tagEnd", "name": "p"},
    {"type": "tagEnd", "name": "div"},
]
```

> 預計輸出 - AST

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
                {"type": "input"},
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

### 第一步，藉由 elementStack 來記錄目前的父子關係，建構 AST

依照以下規則來建立 AST

1. 如果是 tagStart，則建立一個新的 node A，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
2. 如果是 tagEnd，則 pop elementStack 的最後一個元素
3. 如果是 tagSelfClose 或 Text，則建立一個新的 node A，node A 當作 elementStack 的最後一個元素的 children

![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/one.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/two.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/three.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/four.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/five.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/six.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/seven.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/eight.png)
![html-tokens-parser](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-12/nine.png)

----

明天就根據上面的圖實作 Tokens 轉換成 AST 的 Parser 吧 ( •̀ ω •́ )✧

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
