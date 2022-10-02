# [Day17] - HTML 加 attr 後需要的 transformer

昨天的 HTML 分析出的 Tokenizer，可以改良 [Day14] 的 Parser 轉換成以下的 AST

> 改良方式 : token.type === 'tagStart' / 'tagSelfClose' ，建立 node 時多取得 token.attrStr 資訊即可

```javascript
 const old_node = {type: token.name , children: []}; // 原先沒有 attrStr 的 node
 const new_node = {type: token.name, attrStr: token.attrStr, children: []}; // 新的有 attrStr 的 node
```

#### 轉換出來的 AST

```javascript
const ast = {
    "type": "root",
    "children": [
        {
            "type": "div",
            "attrStr": "id=\"app\"",
            "children": [
                {
                    "type": "p",
                    "attrStr": "class=\"text-red\"",
                    "children": [
                        {
                            "type": "text"
                        },
                        {
                            "type": "p",
                            "children": [
                                {
                                    "type": "input",
                                    "attrStr": "type=\"text\" id=\"username\" placeholder=\"請輸入姓名\" disabled"
                                },
                                {
                                    "type": "img",
                                    "attrStr": "src=\"https://ithelp.ithome.com.tw/storage/image/fight.svg\"\r\n         alt='\"圖片\"'"
                                },
                                {
                                    "type": "p",
                                    "attrStr": "style=\"margin-top: 3px\"",
                                    "children": [
                                        {
                                            "type": "text"
                                        },
                                        {
                                            "type": "p",
                                            "children": [
                                                {
                                                    "type": "div",
                                                    "children": []
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```

那 attrStr 的部分，看起來就像是沒分析完的樣子，那我們下面來分析一下 attrStr 的內容，並轉換成我們想要的格式。

#### attrStr 的內容

```javascript
```

#### 轉換成我們想要的格式

```javascript
```

---

我們到目前為止，說明了 only TAG 的 HTML 字串要如何分析成 AST ，之後展現了追加 html attr 要如何在舊有的 tokenizer 跟 parser 做調整。

不過我們分析的案例都不是完整了案例，因此如果要做成完整的 HTML Parser ，可以有兩個方向

- 參考 [HTML SPEC 網站](https://html.spec.whatwg.org/)，完整的按照上面的規範實作 HTML Parser
- 使用別人已經寫好的 HTML Parser ，例如 [htmlparser2](https://www.npmjs.com/package/htmlparser2)

---

明天我們來細部說明一下，[HTML SPEC 網站](https://html.spec.whatwg.org/) 要如何觀看 & 實作上面規範的流程。

### 參考資料

- [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)
