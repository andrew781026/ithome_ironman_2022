# [Day11] - HTML 的狀態圖分析

今天我們來分析一下 HTML 的狀態圖 ~

### 第一步，回顧輸入文字 & 目標 Tokens

#### 輸入的文字

```HTML
<div>
    <p>Vue</p>
    <input />
    <p>Template</p>
</div>
```

#### 預期的輸出 Tokens

```JS
const tokens = [
    { "type": "tagStart", "name": "div" },
    { "type": "tagStart", "name": "p" },
    { "type": "text", "content": "Vue" },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagSelfClose", "name": "input" }, // 自關閉標籤 voidElement
    { "type": "tagStart", "name": "p" },
    { "type": "text", "content": "Template" },
    { "type": "tagEnd", "name": "p" },
    { "type": "tagEnd", "name": "div" },
]
```

### 第二步，整理出關鍵的字元

1. `<` 代表之後收集標籤名稱 , 直到遇到 `>` 為止
2. `/` 後面收集 tagEnd 的標籤名稱 , 直到遇到 `>` 為止
3. `>` 之前收集的 char 是 tagStart 或 tagEnd 的標籤名稱

### 第三步，整理出關鍵的狀態

1. INITIAL : 代表初始狀態
2. IN_TAG : 代表正在收集標籤名稱 ( `<` 之後 )
3. IN_TAG_END : 代表正在收集標籤名稱 ( `/` 之後 )

### 第四步，整理狀態轉換的條件

1. 英文字母 會將字元收集起來到 collected 變數中
2. IN_TAG 狀態下遇到 `>` 會將 collected 變數中的內容當作 tagStart 的標籤名稱，切換狀態成 INITIAL
3. IN_TAG 狀態下遇到 `/` ，切換狀態為 IN_TAG_END
4. IN_TAG_END 狀態下遇到 `>` 會將 collected 變數中的內容當作 tagEnd 的標籤名稱，切換狀態成 INITIAL
5. INITIAL 狀態下遇到 `<` ，切換狀態為 IN_TAG，並將 collected 變數中的內容當作 text content

### 第五步，畫出狀態圖

![HTML 狀態圖](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-11/status-map.png)

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
