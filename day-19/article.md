# [Day19] - AST 的遍歷 (Traverse)

[day-17] 時我們提及了 AST 需要做遍歷，才能。

---

### 複習一下，Tokenizer 要如何分析 ?

1. 確認有哪些規則
2. 找出關鍵的字元
3. 找出關鍵的狀態
4. 狀態轉換的條件
5. 狀態圖

----

![找找看](./find.png)

下面我們就來找找看，HTML SPEC 的第 13 章節 - HTML syntax 上面與分析步驟對應的位置。

#### 13.1 - 說明各式 HTML syntax 上的各種規則

#### 關鍵的字元 <=> [13.2.2.1 Start tags](https://html.spec.whatwg.org/multipage/syntax.html#start-tags)

在 13.2.2.X 中會記載關鍵的字元與其相關的說明。

以 [13.2.2.1 Start tags](https://html.spec.whatwg.org/multipage/syntax.html#start-tags) 為例

![start-tag](./start-tag.png)

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

![tag-open-state](./tag-open-state.png)

### 參考資料

- [html.spec - parsing](https://html.spec.whatwg.org/multipage/parsing.html)
