# 如何製作 PUG 的 parser ?

1. 逐行處理，抓出這行跟開頭有幾個空格，然後跟上方比對算出，是否為子階層，如果是就當作子階層 append 到上方中
2. 多行設定的部分需要特別處理
3. tag . className . attr 的附加處理
4. 變數的處理
5. if . else . each 多處理的部分

