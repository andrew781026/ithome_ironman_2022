# [Day22] - CodeMirror 在網頁中編輯你的 HTML 文字 & 高亮之 

前面的 20 天我們介紹了 tokenizer . parser . transformer . renderer

- tokenizer : 將文字轉成 token
- parser : 將 token 轉成 AST
- transformer : 將 AST 進一步處理變成新的 AST (例如說 attrStr -> attrs)
- renderer : 將 AST 轉成 HTML DOM

那如果我們希望能夠在網頁上編輯 HTML 文字，我們該怎麼做呢？

直接給一個 Textarea 來編輯 HTML 文字嗎？

這樣編輯 HTML 文字，也太花眼力去比對 PAIR TAG 了！

一不小心就會打出 `<div><p></div></p>` 這種 TAG 沒有對應到的錯誤！

因此我們會希望 HTML 文字能夠有高亮顯示，方便我們查看 TAG 的配對。

![html-highlight](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-22/html-highlight.gif)

下面我們要介紹的是 [CodeMirror 6](https://codemirror.net/) 

> CodeMirror 是一個編輯器的函式庫，它可以讓你在網頁中編輯你的 HTML 文字，並且可以高亮你的程式碼。

### 嘗鮮一下

跟著 [CodeMirror 的教學](https://codemirror.net/examples/bundle/) ，建立一個編輯器。

#### 第一步，安裝 CodeMirror 跟 rollup

- [codemirror](https://codemirror.net/)

```shell
# The CodeMirror packages used in our script
npm i codemirror @codemirror/lang-javascript
# Rollup and its plugin
npm i rollup @rollup/plugin-node-resolve
```

#### 第二步，建立 editor.js 

```javascript
import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"

let editor = new EditorView({
  extensions: [basicSetup, javascript()],
  parent: document.body
})
```

#### 第三步，利用 rollup 打包 editor.js 建立 editor.bundle.js

```shell
rollup editor.js -f iife -o editor.bundle.js -p @rollup/plugin-node-resolve
```

> 我們有高亮 JS 代碼的區塊了 ~~

![html-editor](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-22/js-editor.gif)

### 第四步，回頭看一下 editor.js

![codemirror-lang-javascript.png](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-22/codemirror-lang-javascript.png)

原來他是用 `extensions: [javascript()]` 來讓 JS 可以高亮阿 \(￣︶￣*\))

那我們安裝 `@codemirror/lang-html` 套件，來讓 HTML 也可以高亮吧！

```shell
# The CodeMirror packages used in our script
npm i -s @codemirror/lang-html
```

修改一下 editor.js

```diff
import {EditorView, basicSetup} from "codemirror"
- import {javascript} from "@codemirror/lang-javascript"
+ import {html} from "@codemirror/lang-html"

let editor = new EditorView({
  extensions: [
    basicSetup, 
-   javascript()
+    html()
  ],
  parent: document.body
})
```

> 我們有高亮 HTML 代碼的區塊了 ~~

![html-editor](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-22/html-editor.gif)

---

### 其他有趣的事 ( •̀ .̫ •́ )✧

IT幫幫忙，其實也使用 CodeMirror 來編輯高亮 Markdown 文字 (☞ﾟヮﾟ)☞

![ithome-codemirror](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-22/ithome-codemirror.png)

---

### 參考資料

- [CodeMirror](https://codemirror.net/)
- [rollupjs](https://rollupjs.org)
