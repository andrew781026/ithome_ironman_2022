# [Day07] - 逐字分析的行前準備(二) - .env 的狀態圖

### 前情提要

在 day-03 我們建立了一個 .env-sample 的檔案，今天我們要用 `狀態機` 的方式來解析這個檔案。

### 第一步，回顧 .env-sample 的檔案

```properties
# .env-sample file
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
#### 5678
-----END RSA PRIVATE KEY-----"
``` 

### 第二步，整理出關鍵的字元

在之前的規則分析中，我們可以直觀的知道 3 個關鍵字元

1. `=` 切分 key 和 value
2. `#` 設定註解
3. `"` 多行處理

其實還有第四個關鍵字元，換行 `\n`，當單行處理時，換行就是 value 的結束點。

### 第三步，整理出關鍵的狀態

1. NORMAL - 一般狀態
2. IN_QUOTATION - 遇到 '"' 可能需要收集多行的 value
3. IN_COMMENT - 遇到 '#' 正在收集註解的文字
4. AFTER_EQUAL - 遇到 '=' 將收集的文字當作 key，後面收集的當 value

### 第四步，整理狀態轉換的條件

1. 所有狀態遇到非關鍵字元，如 a . b . @ . 空格 ...時，不改變狀態，將字元收集起來到 collected 變數中
2. NORMAL 狀態時遇到 `=` ，切換狀態為 AFTER_EQUAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字
3. NORMAL 狀態時遇到 `#` ，切換狀態為 IN_COMMENT，如果 collected 變數有文字 ( ex: `KEY#01=GG` )，則抱錯 ( KEY01 中不能有 # )
4. NORMAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION，如果 collected 變數有文字 ( ex: `KEY"01=GG` )，則抱錯 ( KEY01 中不能有 " )
5. NORMAL 狀態時遇到 `\n` ，不做處理，收集下個字元
6. ------------------
7. IN_QUOTATION 狀態時遇到 `=` ，不做處理，收集下個字元
8. IN_QUOTATION 狀態時遇到 `#` ，不做處理，收集下個字元
9. IN_QUOTATION 狀態時遇到 `"` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
10. IN_QUOTATION 狀態時遇到 `\n` ，不做處理，收集下個字元
11. ------------------
12. IN_COMMENT 狀態時遇到 `=` ，不做處理，收集下個字元
13. IN_COMMENT 狀態時遇到 `#` ，不做處理，收集下個字元
14. IN_COMMENT 狀態時遇到 `"` ，不做處理，收集下個字元
15. IN_COMMENT 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
16. ------------------
17. AFTER_EQUAL 狀態時遇到 `=` ， ( ex: `KEY==GG` ) 抱錯 ( 一行不能有兩個 = )
18. AFTER_EQUAL 狀態時遇到 `#` ，切換狀態為 NORMAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字，如果 collected 變數沒有文字 ( ex: `KEY01=#GG` )，則抱錯 ( KEY01 沒有對應的 value )
19. AFTER_EQUAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION，如果 collected 變數有文字 ( ex: `KEY01=GG"GG` )，則抱錯 ( = 後面的 " 之間不能有文字 )
20. AFTER_EQUAL 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字

### 第五步，畫出狀態圖

[圖片繪製中...]

明天我們就根據今天的狀態圖來實作逐字分析的程式 ( •̀ ω •́ )✧

---

今天有邦友問我，整個系列，只有看到文字分析，搞不太懂這有什麼用處 ?

這邊我放一張 Vue 是如何將 <template> 中的 HTML 字串轉換成 HTML DOM 的圖，也許可以讓邦友更了解這個系列的用途。

![vue-parse-flow](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-07/vue-parse-flow.png)

也要跟邦友們說明，這個系列就是圍繞在 `文字解析` 上面，所以邦友們可能會看到 30 天的文字解析。

當然，我們的目標做出 Vue Parser，所以後面的文章當然會說明 HTML . CSS . JS 該如何做 簡單的文字解析。

> 附註：30 天不太可能說明完整的解析，特別是 JS 的解析，因為 JS 的規則會不斷地添加，所以我們只是說個概念，讓邦友們知道如何起頭。

![](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-01/goal.png)

另外在這也推薦一下 [Stanford 的開放課程 - Compilers](https://learning.edx.org/course/course-v1:StanfordOnline+SOE.YCSCS1+3T2020/home)，你會了解更多文字解析在 `計算機領域` 中的更多應用。

### 參考資料

- [[譯]Vue.js內部原理淺析](https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/713771/)
