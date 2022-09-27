# [Day12] - HTML 的 Tokenizer 實作

昨天我們分析了 HTML 的狀態圖，今天我們來實作一下 HTML 的 Tokenizer 吧！

### 第零步，重新確定輸入 & 輸出

> 預計輸入 - sample.html

```html
<div>
    <p>Vue</p>
    <input />
    <p>Template</p>
</div>
```

> 預期輸出 Tokens

```js
const tokens = [
    {"type": "tagStart", "name": "div"},
    {"type": "tagStart", "name": "p"},
    {"type": "text", "content": "Vue"},
    {"type": "tagEnd", "name": "p"},
    {"type": "tagSelfClose", "name": "input"},
    {"type": "tagStart", "name": "p"},
    {"type": "text", "content": "Template"},
    {"type": "tagEnd", "name": "p"},
    {"type": "tagEnd", "name": "div"},
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
    IN_TAG: 1,
    IN_TAG_END: 2,
}
```

### 第三步，準備 tokens 陣列，用來收集 token & 建立一些輔助函式

```JS
let collected = '';
const tokens = [];
const isAlphabet = char => /[a-zA-Z]/.test(char);
const resetCollect = () => collected = '';
``` 

### 第四步，實作昨天分析的狀態變化規則

> 4.1 - INITIAL 的狀態變化

```JS
const handle_INITIAL = current => {

    // INITIAL 狀態時遇到 `<`
    if (current === '<') {
        // INITIAL 狀態時遇到 `<`，切換狀態為 IN_TAG
        CURR_STATUS = STATUS.IN_TAG;
        // 將 collected 變數中的內容當作 text content
        if (collected.length > 0) {
            tokens.push({type: 'text', value: collected});
            resetCollect();
        }
    }

    // INITIAL 狀態時遇到 `/` 或  `>` 抱錯
    if (current === '/' || current === '>') {
        throw new Error('Unexpected token >>> ', current);
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}
``` 

> 4.2 - IN_TAG 的狀態變化

```JS
const handle_IN_TAG = current => {

    if (current === '/') {

        const next = charList[0];

        // 自關閉標籤 voidElement ，例如 <input />
        if (collected.length > 0 && next === '>') {
            tokens.push({type: 'tagSelfClose', name: collected});
            resetCollect();
            charList.shift(); // next char `>` 已確認過，所以可以丟掉
            CURR_STATUS = STATUS.INITIAL;
        }

        // </ 關閉標籤，例如 </div>
        else CURR_STATUS = STATUS.IN_TAG_END;
    }

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}
``` 

> 4.3 - IN_TAG_END 的狀態變化

```JS
const handle_IN_TAG_END = current => {

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}
``` 

### 完整程式碼

將上面的區塊做整合，就可以得到 完整程式碼 `htmlTokenizer.js`

```
// 讀取檔案內容 
const fs = require('fs');
const str = fs.readFileSync('sample.html', 'utf8');

// 切分成字元陣列
const charList = str.split('');


// 第二步，定義關鍵的狀態
const STATUS = {
    INITIAL: 0,
    IN_TAG: 1,
    IN_TAG_END: 2,
}

let CURR_STATUS = 0;
let collected = '';
const tokens = [];
const isAlphabet = char => /[a-zA-Z]/.test(char);
const resetCollect = () => collected = '';

// 第三步 - 逐字讀取 , 遇到特定字元( # . " . = . \n )做特別處理
const charList = str.split('');

const handle_INITIAL = current => {

    // INITIAL 狀態時遇到 `<`
    if (current === '<') {
        // INITIAL 狀態時遇到 `<`，切換狀態為 IN_TAG
        CURR_STATUS = STATUS.IN_TAG;
        // 將 collected 變數中的內容當作 text content
        if (collected.length > 0) {
            tokens.push({type: 'text', value: collected});
            resetCollect();
        }
    }

    // INITIAL 狀態時遇到 `/` 或  `>` 抱錯
    if (current === '/' || current === '>') {
        throw new Error('Unexpected token >>> ', current);
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

const handle_IN_TAG = current => {

    if (current === '/') {

        const next = charList[0];

        // 自關閉標籤 voidElement ，例如 <input />
        if (collected.length > 0 && next === '>') {
            tokens.push({type: 'tagSelfClose', name: collected});
            resetCollect();
            charList.shift(); // next char `>` 已確認過，所以可以丟掉
            CURR_STATUS = STATUS.INITIAL;
        }

        // </ 關閉標籤，例如 </div>
        else CURR_STATUS = STATUS.IN_TAG_END;
    }

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

const handle_IN_TAG_END = current => {

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

try {

    while (charList.length > 0) {

        const current = charList.shift();

        if (CURR_STATUS === STATUS.INITIAL) handle_INITIAL(current);
        if (CURR_STATUS === STATUS.IN_TAG) handle_IN_TAG(current);
        if (CURR_STATUS === STATUS.IN_TAG_END) handle_IN_TAG_END(current);
    }

} catch (e) {
    console.log('e=', e);
}

console.log('tokens=', tokens);
```

----

明天比照 .env-sample 的分析流程來思考 Tokens 要如何轉換成 AST 吧 ( •̀ ω •́ )✧

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
