# [Day21] - 一些學習 AST 的工具

經過一段時間的說明，相信邦友們對 AST 躍躍欲試對吧？

下面我介紹一些跟 AST 相關的工具，這些工具輔助我學習 AST，也期望它們幫助邦友們更進一步的學習 AST

### 書籍

- [Vue.js 設計與實踐](https://www.tenlong.com.tw/products/9787115583864)

![vue-book](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/vue-book.png)

看 Parser 系列文章，到今天肯定多次看到我提到 [Vue.js 設計與實踐](https://www.tenlong.com.tw/products/9787115583864) 

這本書的第 15 . 16 章，深入說明 Vue 是如何處理 HTML 的，強烈建議邦友們可以買一本來看看

書本中的範歷程式碼，作者放在 [GitHub 上](https://github.com/HcySunYang/code-for-vue-3-book)

還沒買書的邦友，可以先去看一下 (＠＾０＾)

---

- [dragon book - 編譯原理](https://www-2.dc.uba.ar/staff/becher/dragon.pdf)

![dragon-book](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/dragon-book.png)

經典的 Compiler 書籍，是 EDX - Compilers 課程中教授推薦的書籍

而我們最近說明的 狀態機 . Parser . AST 都是 Compiler 中的概念

如果邦友們對 Compiler 感興趣，可以看看這本書

### 網站

- [AST Explorer](https://astexplorer.net/)

![ast-explorer](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/ast-explorer.png)

AST Explorer 是一個可以讓邦友們在網頁上 Parse 程式碼，並且顯示 AST 的網站

上面有 Markdown . css . javascript . SQL .  PHP ...等，許多程式語言的 Parser，讓邦友們觀察產出的 AST 

另外，上面也會顯示出目前用的 Parser 是甚麼，邦友們還可以到 github 上面研究對應的 Parser 是如何實作的

例如：我想要了解目前的 Javascript Parser 有哪個套件在實作

![ast-explorer-acorn](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/ast-explorer-acorn.png)

可以看到 [acorn 套件](https://github.com/acornjs/acorn) 有做 Javascript Parser ，邦友們就可以在 github 上找 acorn 來研究 Parser 是如何實作的

[![github-search-acorn](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/github-search-acorn.png)](https://github.com/acornjs/acorn)

---

- [jointjs - JAVASCRIPT AST VISUALIZER](https://resources.jointjs.com/demos/javascript-ast)

可以用圖形化的方式看 AST

![jointJS](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/jointJS.png)

### 課程

- [EDX - Compilers](https://learning.edx.org/course/course-v1:StanfordOnline+SOE.YCSCS1+3T2020/home)

[![edx-compiler](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-21/edx-compiler.png)](https://www.edx.org/course/compilers)

史丹佛大學的 Compiler 線上課程，我覺得很不錯，推薦邦友們可以看看

### 其他

- [svelte 在線編譯器](https://svelte.dev/repl/hello-world?version=3.50.1)
- [Babel 在線編譯器](https://babeljs.io/repl)
