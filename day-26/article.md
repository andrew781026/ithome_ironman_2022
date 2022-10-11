# [Day26] - SCSS Tokenizer

## 前言

[day-23] 我們說明了 SCSS 的規則 & 一些關鍵的字元

今天我們仿造 [[Day12] - HTML 的 Tokenizer](https://ithelp.ithome.com.tw/articles/10299768) 的方法 來實作一個 SCSS 的 tokenizer

### 第零步，重新確定輸入 & 輸出

> 預計輸入 - app.scss

```scss
@import "_color.scss"; // 會將 _color.scss 的內容全部輸出
@import "_button.scss"; // 會將 _button.scss 的內容全部輸出

// @use "_text.scss";      // 一定要放在 @forward 之前，且只會輸出有在目標檔案中有使用到的部分，可設定 Namespace
// @forward "_space.scss"; // 只會輸出有在目標檔案中有使用到的部分
@debug "Debugging";
@warn "This is a warning";

// Nesting
nav {
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li { display: inline-block; }

  a {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
  }

  // parent selector
  [dir=rtl] & {
    margin-left: 0;
    margin-right: 10px;
  }
}

// Placeholder Selectors
%toolbelt {
  box-sizing: border-box;
  border-top: 1px rgba(#000, .12) solid;
  padding: 16px 0;
  width: 100%;

  &:hover { border: 2px rgba(#000, .5) solid; }
}

.action-buttons {
  @extend %toolbelt;
  color: #4285f4;
}

.reset-buttons {
  @extend %toolbelt;
  color: #cddc39;
}
```

> 預期輸出 Tokens

```js
const tokens = [
  {
    "type": "keyword",
    "name": "import",
    "value": "\"_color.scss\""
  },
  {
    "type": "keyword",
    "name": "import",
    "value": "\"_button.scss\""
  }
]
```

### 第一步，讀取檔案 & 轉換成字元陣列

```JS
// 讀取檔案內容 
const fs = require('fs');
const str = fs.readFileSync('sample.html', 'utf8');

// 切分成字元陣列
const charList = str.split('');
``` 

### 第二步，定義關鍵的狀態

```JS
const STATUS = {
  INITIAL: 0,
  IN_SINGLE_COMMENT: 1, // 開始於 // 遇到 \n 回到 initial
  IN_MULTI_COMMENT: 2,  // 開始於 /* 遇到 */ 回到 initial
  IN_VAR_NAME: 3,       // initial 開始於 $ 遇到 : 變成 IN_VAR_VALUE
  IN_VAR_VALUE: 4,      // 開始於 : 遇到 ; 變成 INITIAL
  IN_KEYWORD: 5,        // 開始於 @ 遇到 空格 變成 IN_KEYWORD_VALUE
  IN_KEYWORD_VALUE: 6,  // 遇到 ; 變成 INITIAL / 遇到 { 變成 IN_BODY
  IN_BODY: 7,           // 開始於 { 遇到 } 變成 INITIAL
}
```

### 第三步，準備 tokens 陣列，用來收集 token & 建立一些輔助函式

```JS
resetCollect = () => this.collected = '';
collectChar = char => this.collected += char;
setCurrStatus = status => this.CURR_STATUS = status;
isLastChar = () => this.charList.length === 1;
addToken = token => this.tokens.push(token);
``` 

### 第四步，實作昨天分析的狀態變化規則

> 4.1 - INITIAL 的狀態變化

```JS
handle_INITIAL() {

    const current = this.getCurr();

    if (current === `/`) {

      const next = this.getNext();

      // 遇到 `//`，切換狀態成 IN_SINGLE_COMMENT
      if (next === `/`) {
        this.setCurrStatus(ScssTokenizer.STATUS.IN_SINGLE_COMMENT);
        this.removeFirstN(2);
        return;
      }

      // 遇到 `/*`，切換狀態成 IN_MULTI_COMMENT
      if (next === `*`) {
        this.setCurrStatus(ScssTokenizer.STATUS.IN_MULTI_COMMENT);
        this.removeFirstN(2);
        return;
      }
    }

    if (current === `$` || current === `#`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_VAR_NAME);
      this.removeCurr();
      return;
    }

    if (current === `@`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_KEYWORD);
      this.removeCurr();
      return;
    }

    if (current === `{`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_BODY);
      this.addToken({type: 'css', selector: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    if (!['\r', '\n', ' '].includes(current)) this.collectChar(current);
    this.removeCurr();
  }
``` 

> 4.2 - IN_SINGLE_COMMENT 的狀態變化

```JS
  handle_IN_SINGLE_COMMENT() {

  const current = this.getCurr();

  if (current === '\n') {
    this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
    this.addToken({type: 'comment', value: this.collected});
    this.removeCurr();
    this.resetCollect();
    this.removeCurr();
    return;
  }

  this.collectChar(current);
  this.removeCurr();
}
``` 

> 4.3 - IN_MULTI_COMMENT 的狀態變化

```JS
handle_IN_MULTI_COMMENT() {

  const current = this.getCurr();

  if (current === '*' && this.lookahead(1) === '/') {
    this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
    this.addToken({type: 'comment', value: this.collected});
    this.removeCurr();
    this.resetCollect();
    this.removeCurr();
    return;
  }

  this.collectChar(current);
  this.removeCurr();
}
``` 

 ...等

### 完整程式碼

將上面的區塊做整合，就可以得到 [完整程式碼 scssTokenizer.js](https://github.com/andrew781026/ithome_ironman_2022/blob/main/day-26/util/tokenizer.js)
