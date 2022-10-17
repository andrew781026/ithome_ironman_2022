# [Day31] - 自製 CodeMirror 的 SCSS 語法包

在 [day-29] 中我們說明了如何自製 CodeMirror 的語法包，今天我們來實作一個 SCSS 語法包。

## 複習

當我們定義完成 lang.grammar 檔案後，建立 grammar.js 檔案，定義 配對的元素(indentNodeProp) 與 可折疊的元素(foldNodeProp) 還有需要特別顏色的 Token 。

再透過 `rollup src/grammar.js -c rollup-grammar.config.js` 生成我們的語法包 `myLang.js`。

之後建立出我們的語法包了 ~~~

如果要建立 editor 的話，可以參考 [day-22] 中的範例用生成的語法包 `myLang.js` 來建立 `editor.bundle.js` 然後在 HTML 中引用。

```

@top Program { expression* }

expression {
  any |
  CommentExpression |
  Application { "{" expression* "}" }
}

@skip { space | Comment }

CommentExpression { "/*" (any)* "*/" }

@tokens {
  any { $[.]+ }
  space { $[ \t\n\r]+ }
  Comment { "//" ![\n]* }
  "{" "}"
}
```

### 參考資料

- [codemirror - 自定義語法高亮](https://codemirror.net/examples/lang-package/)
