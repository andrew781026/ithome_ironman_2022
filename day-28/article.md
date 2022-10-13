# [Day28] - Lezer.js - 利用 Grammar 定義我們的語言

## 前言

在 [Day-22] 中，我們討論了 CodeMirror 可以利用它來做 語法的 Highlight，但是 CodeMirror 並不支援 SCSS 語法的高亮。

這時我們就需要自定義一個語法的 Highlight，這時就需要用到 Lezer.js 了。

下面我們就來說說 Lezer.js，如何利用昨天說到的 Grammar 來定義語法。

#### 第一步，安裝 @lezer/generator 跟 rollup

- [lezer](https://lezer.codemirror.net/docs/guide/#writing-a-grammar)

```shell
# init package.json
npm init -y
# The lezer packages used in our script
npm i -s @lezer/generator
# Rollup 
npm i -D rollup 
```

```shell
lezer-generator src/lang.grammar -o dist/lang.js
```

### 參考資料

- [@lezer/generator](https://github.com/lezer-parser/generator)
