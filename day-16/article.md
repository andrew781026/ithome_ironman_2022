# [Day16] - HTML 加 attr 的 Tokenizer

> 額外小知識 `void element`

有些 HTML tag 是不需要結尾的，也會被自動認定成 tagSelfClose，像是 `<img>` `<br>` `<hr>` 等等，這種 tag 就稱為 `void element`。

那 void element 有那些呢 ?
可以參考 [w3.org - 4.3. Elements](https://www.w3.org/TR/2011/WD-html-markup-20110405/syntax.html#syntax-elements) 來查看有哪些 void element。

---

昨天我們分析了 HTML 的狀態圖，今天我們來實作一下 HTML 加上 attr 的 Tokenizer 吧！

### 第零步，重新確定輸入 & 輸出

> 預計輸入 - sample.html

```html
<div id="app">
    <p class="text-red">Vue</p>
    <input type="text" id="username" placeholder="請輸入姓名" disabled/>
    <img src="https://ithelp.ithome.com.tw/storage/image/fight.svg"
         alt='"圖片"'>
    <p style="margin-top: 3px">Template</p>
</div>
```

> 預期輸出 Tokens

```js
const tokens = [
    {"type": "tagStart", "name": "div", attrStr: `id="app"`},
    {"type": "tagStart", "name": "p", attrStr: `class="text-red"`},
    {"type": "text", "content": "Vue"},
    {"type": "tagEnd", "name": "p"},
    {
        "type": "tagSelfClose",
        "name": "input",
        isVoidElement: true,
        attrStr: `type="text" id="username" placeholder="請輸入姓名" disabled`
    },
    {
        "type": "tagSelfClose",
        "name": "img",
        isVoidElement: true,
        attrStr: `src="https://ithelp.ithome.com.tw/storage/image/fight.svg" \n alt='"圖片"'`
    },
    {"type": "tagStart", "name": "p", attrStr: `style="margin-top: 3px"`},
    {"type": "text", "content": "Template"},
    {"type": "tagEnd", "name": "p"},
    {"type": "tagEnd", "name": "div"},
]
```

### 第一步，把之前的 tokenizer 拿出來

```JS
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

### 第二步，定義關鍵的狀態

```JS
const STATUS = {
    INITIAL: 0,
    IN_TAG: 1,
    IN_TAG_END: 2,
    IN_ATTR: 3,
}
```

### 第三步，補一個 isVoidElement 的判斷

利用 [void-elements](https://www.npmjs.com/package/void-elements) 套件的資料來判斷是否為 `void element`。

```JS
const voidElements = require('void-elements');
const voidElementChecker = tagName => voidElements[tagName];
```

### 第三步，實作 & 調整昨天分析的狀態變化規則

`handle_IN_TAG_END` 跟 `handle_INITIAL` 根據昨天的分析，這兩個狀態我們不用動。

> 4.3 - IN_TAG 的狀態變化

```JS
const handle_IN_TAG = current => {

    // 遇到空格變成狀態 IN_ATTR
    if (current === ' ') {
        CURR_STATUS = STATUS.IN_ATTR;
        const tagName = collected;
        const isVoidElement = voidElementChecker(tagName);
        const token = isVoidElement ? {type: 'tagSelfClose', name: tagName, isVoidElement} :  {type: 'tagStart', name: tagName};
        tokens.push(token);
        resetCollect();
        return;
    }

    // 跟 [ day-12 ] 的實作相同
}
``` 

> 4.4 - IN_ATTR 的狀態變化

```JS
const handle_IN_ATTR = current => {

    const next = charList[0];

    if (current === '>' || (current === '/' && next === '>')) {
        CURR_STATUS = STATUS.INITIAL;
        const attrStr = collected;
        tokens[tokens.length - 1].attrStr = attrStr; // 設定最後一個 token 的 attrStr
        resetCollect();
        return;
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}
``` 

### 完整程式碼

將上面的區塊做整合，就可以得到 完整程式碼 `htmlTokenizer.js`

[完整程式碼 htmlTokenizer.js 請到 github 上查看](https://github.com/andrew781026/ithome_ironman_2022/blob/main/day-16/html-attr-tokenizer.js)

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
- [html-spec # parse-state](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
