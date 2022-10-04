# [Day17] - attrStr 的 tokenizer

昨天的 HTML 分析出的 Tokenizer，可以改良 [Day14] 的 Parser 轉換成以下的 AST

> 改良方式 : token.type === 'tagStart' / 'tagSelfClose' ，建立 node 時多取得 token.attrStr 資訊即可

```javascript
// 原先沒有 attrStr 的 node
const old_node = {type: token.name , children: []};

// 新的有 attrStr 的 node
const new_node = {type: token.name, attrStr: token.attrStr, children: []}; 
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
                        }
                    ]
                },
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
                        }
                    ]
                }
            ]
        }
    ]
}
```
 
attrStr 的區塊，看起來就像是沒分析完的樣子，我們下面來分析一下 attrStr 的內容，並轉換成我們想要的格式。

比如說 attrStr 的內容 = `type="text" id="username" placeholder="請輸入姓名" disabled`

我們期望轉換成 : 

```javascript
const attrs = [
    {name: 'type', value: 'text'},
    {name: 'id', value: 'username'},
    {name: 'placeholder', value: '請輸入姓名'},
    {name: 'disabled', value: true}
]
```

---

複習一下，Tokenizer 要如何分析 ? 

1. 確認有哪些規則
2. 找出關鍵的字元
3. 找出關鍵的狀態
4. 狀態轉換的條件
5. 狀態圖
6. 根據上面的分析，可以簡單的實作出來

下面我們就來重複上述的 6 個步驟，來分析 attrStr 的 tokenizer。

----

### HTML 的 attr 有哪些規則

- 屬性名稱(attrName) : 不會被 "" 包起來，且不會有空白分開 (ex: type="text" => type)
- 屬性值(attrValue) : 接在 = 之後，可以被 "" 包起來，也可以不用 (ex: type="text" => "text")
- 屬性名稱沒有 = 接在後面，則屬性值為 true (ex: disabled => true)

### 關鍵的字元

- 空白 ( ) : 當屬性值(attrValue) 沒有被 " 或 ' 包住時可視為結束的位置
- 雙引號 " : 屬性值(attrValue) 會被 " 包住時，而且 " " 成對出現 ( 第二個 " 出現前遇到 ' 視為單純的文字 )
- 單引號 ' : 屬性值(attrValue) 會被 ' 包住時，而且 ' ' 成對出現 ( 第二個 ' 出現前遇到 " 視為單純的文字 )
- 等號 = : 右側的文字視為屬性值(attrValue)

### 關鍵的狀態

- INITIAL : 初始狀態
- IN_ATTR_NAME : 當前的 attr 名稱 (type . id . placeholder . disabled)
- IN_ATTR_VALUE : 當前的 attr 值 (text . username . 請輸入姓名 . true)
- IN_SINGLE_QUOTATION : 成對 ' ' 之間的文字，可收集當前的 attr 值
- IN_DOUBLE_QUOTATION : 成對 " " 之間的文字，可收集當前的 attr 值

### 狀態轉換的條件

1. INITIAL 狀態下遇到 `英文字母` ，切換狀態為 IN_ATTR_NAME
2. IN_ATTR_NAME 狀態下遇到 `=` 會將 collected 變數中的內容當作 attrName，切換狀態成 IN_ATTR_VALUE
3. IN_ATTR_NAME 狀態下遇到 ` ` or 最後一個字 會將 collected 變數中的內容當作 attrName，切換狀態成 INITIAL ( 例： disabled )
4. IN_ATTR_VALUE 狀態下遇到 `'` ，切換狀態為 IN_SINGLE_QUOTATION
5. IN_ATTR_VALUE 狀態下遇到 `"` ，切換狀態為 IN_DOUBLE_QUOTATION
6. IN_ATTR_VALUE 狀態下遇到 ` ` or 最後一個字 會將 collected 變數中的內容當作 attrValue，切換狀態成 INITIAL ( 例： type=text )
7. IN_SINGLE_QUOTATION 狀態下遇到 `'` ，切換狀態為 INITIAL，並將 collected 變數中的內容當作 attrValue
8. IN_DOUBLE_QUOTATION 狀態下遇到空格 `"` ，切換狀態為 INITIAL，並將 collected 變數中的內容當作 attrValue

### 狀態圖

![狀態圖](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-17/attrStr-status-map.png)

### 程式碼

[完整程式碼 attrStr-tokenizer.js 請到 github 上查看](https://github.com/andrew781026/ithome_ironman_2022/tree/main/day-18/attrStr-tokenizer.js)

---

我們有了 attrStr-tokenizer.js 之後，我們還需要走訪 ( traverse ) 每個 AST 的節點，並將每個節點的 attrStr 轉換成 attrs。

有個專業術語叫做 transform，那個意思就是當我們走訪 ( traverse )  每個 AST 的節點，對每個節點做一些加工。

複習一下，我們分析的步驟

- tokenize
- parse
- transform

也就是下圖所示的那樣：

![new_flow](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-17/new-flow.png)

---

我們到目前為止，說明了 only TAG 的 HTML 字串要如何分析成 AST ，之後展現了追加 html attr 要如何在舊有的 tokenizer 跟 parser 做調整。

不過我們分析的案例都不是完整 HTML 的情況，因此如果要做成完整的 HTML Parser ，可以有兩個方向

- 參考 [HTML SPEC 網站](https://html.spec.whatwg.org/)，完整的按照上面的規範實作 HTML Parser
- 使用別人已經寫好的 HTML Parser ，例如 [htmlparser2](https://www.npmjs.com/package/htmlparser2)

---

明天我們來細部說明一下，[HTML SPEC 網站](https://html.spec.whatwg.org/) 要如何觀看 & 實作上面規範的流程。

### 參考資料

- [the-super-tiny-compiler](https://github.com/jamiebuilds/the-super-tiny-compiler/blob/master/the-super-tiny-compiler.js)
