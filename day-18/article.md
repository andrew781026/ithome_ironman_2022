# [Day18] - HTML 的規範 - HTML SPEC 

## HTML SPEC 是什麼 ?

> From Wiki
```
網頁超文字應用技術工作小組（英語：Web Hypertext Application Technology Working Group，縮寫：WHATWG），是一個以推動網路HTML標準為目的而成立的組織。在2004年，由Apple公司、Mozilla基金會和Opera軟體公司所組成。

而 HTML SPEC 文件是將 網頁超文字應用技術工作小組（縮寫：WHATWG）定義的 HTML 規範整理成一份線上文件，讓開發者可以參考使用的 LIVE DOC。
```

跟我們系列文章 htmlStr -> AST 有相關的章節是 [HTML SPEC 的第 13 章節 - HTML syntax](https://html.spec.whatwg.org/multipage/syntax.html#syntax)

---

### 複習一下，Tokenizer 要如何分析 ?

1. 確認有哪些規則
2. 找出關鍵的字元
3. 找出關鍵的狀態
4. 狀態轉換的條件
5. 狀態圖

----

下面我們就來找找看，HTML SPEC 的第 13 章節 - HTML syntax 上面與分析步驟對應的位置。

![找找看](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-18/find.png)

#### HTML 規則 & 關鍵的字元 <=> [13.2.2.1 Start tags](https://html.spec.whatwg.org/multipage/syntax.html#start-tags)

在 13.2.2.X 中會記載關鍵的字元與其相關的規則說明。

以 [13.2.2.1 Start tags](https://html.spec.whatwg.org/multipage/syntax.html#start-tags) 為例

![start-tags](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-18/start-tags.png)

1. 第一個 char 是 <
2. 下一個 char 必須是 tagName
...
7. Start tags 最後一個 char 必須是 >

#### 關鍵狀態 <=> [13.2.4.1 The insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-insertion-mode)

insertion mode 就是我們之前所說的 `狀態`

13.2.4.1 中就有紀載許多的狀態

- initial
- before html
- before head
- in head
- in caption ...etc.

#### 狀態轉換的條件 <=> [13.2.5.6 Tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state)

在 13.2.5.X 中會記載特定的 insertion mode 跟其遇到哪個 char 會轉換到哪個狀態

以 [13.2.5.6 Tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state) 為例

![tag-open-state](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-18/tag-open-state.png)

遇到 SOLIDUS ( / ) 就會轉換到 [end tag open state.](https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state)

### Parser <=> [13.2.6.4 The rules for parsing tokens in HTML content](https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhtml)

13.2.6.X 會記載在不同的 insertion mode 如何將 token 轉換成 AST

以 [13.2.6.4.2 The "before html" insertion mode](https://html.spec.whatwg.org/multipage/parsing.html#the-before-html-insertion-mode) 為例

![before-html-parse](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-18/before-html-parse.png)

- 遇到 DOCTYPE token 就會報錯，並忽視這個 token
- 遇到 comment token 就會插入一個 comment node 到 Document 物件上
- 遇到 start tag token <html> 就會建立一個 html node 到 Document 物件上，當作 root node ...等

--- 

我們近期討論的範圍 htmlStr to ast 就在第 13 章中

其他章節的內容，會描述其他的事情，例如 [第 15 章 - Rendering](https://html.spec.whatwg.org/multipage/#toc-rendering) 就是描述 ast 如何 render 成 HTML DOM 的過程

### 參考資料

- [html.spec - parsing](https://html.spec.whatwg.org/multipage/parsing.html)
