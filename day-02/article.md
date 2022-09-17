# [Day02] - Parser 是什麼，可以吃嗎？

昨天說了很多次 Parser，但是那到底是是什麼呢？

其實 Parser 就是將文字做解析的並將其轉換成 抽象語法樹（Abstract Syntax Tree，AST）的黑盒子函式。

打個比方，在 windows 中要使用 .env 檔案，就需要使用 dotenv 這個套件

並在使用 process.env 之前引用 `require('dotenv').config()` 

而 `require('dotenv').config()` 其實執行了的幾個動作

1. 讀取 .env 檔案
2. 將 .env 檔案內容轉換成 AST ( Parser )
3. 將 AST 資訊放入 process.env 中
