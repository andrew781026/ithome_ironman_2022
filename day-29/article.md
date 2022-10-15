# [Day29] - Lezer.js - 將自定義的 Grammar 拿到 CodeMirror 中做使用 

## 前言

在 [Day-28] 中，昨天我們用 Lezer.js 定義了一個語法讓 `(a+1)` . `(100-(2+4))` 這類的字串可以被解析。

我們來將定義好的東東拿到 CodeMirror 中使用，讓其可以被 Highlight 吧！

#### 第零步，複習一下 editor.js 如何引用語法包

```javascript
import {EditorView, basicSetup} from "codemirror"
import {html} from "@codemirror/lang-html"

let editor = new EditorView({
  doc: "The document\nis\nshared",
  extensions: [
    basicSetup,
    html(),
  ],
  parent: document.body
})
```

在 [day-22] 中我們用 `import {html} from "@codemirror/lang-html"` 引入 html 的語法包

那就是說今天生成的語法包，也可以使用 `import {myLang} from "../myLang.js"` 的方式來引入。

#### 第一步，拿出昨天我們設定的 lang.grammar

```
@top Program { expression }

expression {
  Name |
  Number |
  BinaryExpression
}

@skip { space | Comment }

BinaryExpression { "(" expression ("+" | "-") expression ")" }

@tokens {
  space { @whitespace+ }
  Comment { "//" ![\n]* }
  Name { @asciiLetter+ }
  Number { @digit+ }
}
```

#### 第二步，建立 grammar.js 定義語法包 & 高亮設定

引入 `@lezer/highlight` 並設定要高亮的 token 類型

- indentNodeProp - 設定 ( ) 的配對高亮
- foldNodeProp - 代表語法是否可以摺疊
- styleTags - 需要高亮的語法(定義在 .grammar 的 token 之中)

```javascript
import {parser} from "./lang.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const MyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Program: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Program: foldInside
      }),
      styleTags({
        Number: t.number,
        "( )": t.paren
      })
    ]
  })
})

export function MyLang() {
  return new LanguageSupport(MyLanguage)
}
```

#### 第三步，rollup 建立語法包

利用下方的 rollup-grammar.config.js 來建立語法包，並執行 `rollup src/grammar.js -c rollup-grammar.config.js` 來建立語法包。

```javascript
import {lezer} from "@lezer/generator/rollup"

export default {
  input: "src/index.js",
  external: id => id != "tslib" && !/^(\.?\/|\w:)/.test(id),
  output: [
    {file: "./dist/myLang.js", format: "es"}
  ],
  plugins: [lezer()]
}
```

#### 第四步，建立 editor.js 引用產生的語法包

```javascript
import {EditorView,basicSetup} from "codemirror"
import {MyLang} from "../dist/myLang.js"

let editor = new EditorView({
  doc: "(((8+9)+10)-20)", 
  extensions: [
    basicSetup,
    MyLang(),
  ],
  parent: document.body
})
```

#### 第五步，rollup 打包 editor.js 讓其可以在 html 中引用

利用下方的 rollup-editor.config.js 來建立語法包，並執行 `rollup src/editor.js -c rollup-editor.config.js` 來建立語法包。

```javascript
import {nodeResolve} from "@rollup/plugin-node-resolve"
export default {
  input: "./src/editor.js",
  output: {
    file: "./output/editor.bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve()]
}
```

#### 第六步，當然是在 html 中引用了

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CodeMirror</title>
  <link rel="shortcut icon" href="code.ico" />
</head>
<body>
<h1>CodeMirror!</h1>
<script src="editor.bundle.js"></script>
</body>
</html>
```

![custom-lang](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-29/custom-lang.png)

### 參考資料

- [codemirror - 自定義語法高亮](https://codemirror.net/examples/lang-package/)
