# [Day15] - HTML 加 attr 的狀態圖分析

先複習一下， [[Day-11]](https://ithelp.ithome.com.tw/articles/10299091) 我們是如何分析狀態圖的 ?

- 第一步，確認 `輸入的文字` & `預期的輸出 Tokens`
- 第二步，整理出關鍵的字元
- 第三步，整理出關鍵的狀態
- 第四步，整理狀態轉換的條件
- 第五步，畫出狀態圖

下面比照之前的步驟，來分析 HTML 加 attr 後的狀態圖 (‾◡◝)

### 第一步，確認輸入文字 & 目標 Tokens

#### 輸入的文字

```HTML
<div id="app">
    <p class="text-red">Vue</p>
    <input type="text" id="username" placeholder="請輸入姓名" disabled />
    <img src="https://ithelp.ithome.com.tw/storage/image/fight.svg"
         alt='"圖片"' />
    <p style="margin-top: 3px">Template</p>
</div>
```

#### 預期的輸出 Tokens

```JS
const tokens = [
    { "type": "tagStart", "name": "div", attrStr:`id="app"` },
    { "type": "tagStart", "name": "p", attrStr:`class="text-red"` },
    { "type": "text", "content": "Vue"  },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagSelfClose", "name": "input", attrStr:`type="text" id="username" placeholder="請輸入姓名" disabled` }, 
    { "type": "tagSelfClose", "name": "img", attrStr:`src="https://ithelp.ithome.com.tw/storage/image/fight.svg" \n alt='"圖片"'` }, 
    { "type": "tagStart", "name": "p", attrStr:`style="margin-top: 3px"` },
    { "type": "text", "content": "Template" },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagEnd", "name": "div" },
]
```

### 第二步，整理出關鍵的字元

1. `<` 代表之後收集標籤名稱 , 直到遇到 `>` 為止
2. `/` 後面收集 tagEnd 的標籤名稱 , 直到遇到 `>` 為止
3. `>` 之前收集的 char 是 tagStart 或 tagEnd 的標籤名稱
4. 空格 ` ` 收集 tagStart 或 tagEnd 的 name 時，遇到空格代表 attr 的開始

### 第三步，整理出關鍵的狀態

1. INITIAL : 代表初始狀態
2. IN_TAG : 代表正在收集標籤名稱 ( `<` 之後 )
3. IN_TAG_END : 代表正在收集標籤名稱 ( `/` 之後 )
4. IN_TAG_NAME : 代表正在收集標籤名稱 ( `>` 之前 )
5. IN_ATTR : 代表正在收集屬性資料 ( ` ` 之後 )

> &#128213; 前 4 個跟之前相同，只是多了一個 IN_ATTR

### 第四步，整理狀態轉換的條件

1. 英文字母 會將字元收集起來到 collected 變數中
2. IN_TAG 狀態下遇到 `>` 會將 collected 變數中的內容當作 tagStart 的標籤名稱，切換狀態成 INITIAL
3. IN_TAG 狀態下遇到 `/` ，切換狀態為 IN_TAG_END
4. IN_TAG_END 狀態下遇到 `>` 會將 collected 變數中的內容當作 tagEnd 的標籤名稱，切換狀態成 INITIAL
5. INITIAL 狀態下遇到 `<` ，切換狀態為 IN_TAG，並將 collected 變數中的內容當作 text content
6. IN_TAG 狀態下遇到空格 ` ` ，切換狀態為 IN_ATTR，並將 collected 變數中的內容當作 tagStart 的標籤名稱
7. IN_ATTR 狀態下遇到 `>` ，切換狀態為 INITIAL，並將 collected 變數中的內容當作 attrStr 的值，對應的 tag 為 tagStart
8. IN_ATTR 狀態下遇到 `/>` ，切換狀態為 INITIAL，並將 collected 變數中的內容當作 attrStr 的值，對應的 tag 為 tagSelfClose

> &#128213; 前 5 個跟之前相同，多了 IN_ATTR 相關的狀態轉換條件

### 第五步，畫出狀態圖

[圖片繪製中]

----

明天我們根據 `狀態圖` 進行 HTML 追加 attr 的 Tokenizer 修改

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
- [html-spec # parse-state](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
