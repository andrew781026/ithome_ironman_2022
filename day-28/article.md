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

#### 第二步，定義 lang.grammar

先來定義簡單的 grammar，用於解析 (100-(2+4)) 或 (a+1) 這種算式。

- @top - 代表這個 grammar 的開頭
- @skip - 代表產生 AST 時會跳過這些類型，不將其收錄在輸出的 tree 中
- @tokens - 在此定義字元的類型
- expression - 自定義類型，將 tokens 中定義的類型，都算成 expression 類型
- BinaryExpression - 自定義類型，也可組合類型將 `( 1 + 2 )` 當作 BinaryExpression 類型

```
@top Program { expression }

expression { Name | Number | BinaryExpression }

@skip { space | Comment }

BinaryExpression { "(" expression ("+" | "-") expression ")" }

@tokens {
  space { @whitespace+ }
  Comment { "//" ![\n]* }
  Name { @asciiLetter+ }
  Number { @digit+ }
}
```

#### 第三步，產生 dist/lang.js

```shell
lezer-generator src/lang.grammar -o dist/lang.js
```

#### 第四步，利用產生的 dist/lang.js 來 Parse 定義的語法並 Travel Tree Nodes

利用 `parser.parse('(a+1)')` 跟 `tree.iterate` 確認我們的語法解析是否正確。

```javascript
import {parser} from '../dist/lang.js';

const tree = parser.parse('(a+1)');

// 利用 iterate 走訪 tree 的每個節點，並輸出節點對應資訊
tree.iterate({
  enter(node) {
    const originStr = str.substring(node.from, node.to);
    console.log('type=',node.name,' \t (from,to) =',`(${node.from},${node.to})`,' \t對應字串 =',originStr);
  },
});
/*
type= Program    (from,to) = (0,5)      對應字串 = (a+1)
type= BinaryExpression           (from,to) = (0,5)      對應字串 = (a+1)
type= Name       (from,to) = (1,2)      對應字串 = a
type= Number     (from,to) = (3,4)      對應字串 = 1
*/
```

### 參考資料

- [@lezer/generator](https://github.com/lezer-parser/generator)
- [@lezer - writing-a-grammar](https://lezer.codemirror.net/docs/guide/#writing-a-grammar)
