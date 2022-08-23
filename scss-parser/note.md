# 如何製作 SCSS 的 parser ?

1. 槽狀的部分作出子層
2. & 緊黏需要當作同一層
3. & 空格需要當作父層
4. 變數的處理
5. include 其他檔案
6. 函式 . if . else . for . each

利用 babel 定義不同的對應？

// rgba() and hsla() transformer ? 


- [css-tree](https://www.npmjs.com/package/css-tree) - Svelte 有用他
- [peg.js](https://pegjs.org/) - Parser Generator for JavaScript

