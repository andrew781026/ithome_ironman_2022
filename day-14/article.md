# [Day14] - 簡易 HTML 的 Parse 實作

昨天我們分析 HTML Tokens 要轉換成 AST 需要利用 elementStack 來輔助，今天我們就來實作一下。

### 複習一下 遇到不同的 token 要做什麼

1. 如果是 tagStart，則建立一個新的 node A，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
2. 如果是 tagEnd，則 pop elementStack 的最後一個元素
3. 如果是 tagSelfClose 或 Text，則建立一個新的 node A，node A 當作 elementStack 的最後一個元素的 children

### 根據上面的 3 條規則，做出 4 個 handle function

> `tagStart` handler

```js
// 遇到 tagStart，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
const handleTagStart = elementStack => token => {
    const node = {type: token.name, children: []}; // node A
    elementStack[elementStack.length - 1].children.push(node); // node A 當作 elementStack 的最後一個元素的 children
    elementStack.push(node); // 並將 node A push elementStack
};
```

> `tagEnd` handler

```js
 // 遇到 tagEnd，則 pop elementStack 的最後一個元素
const handleTagEnd = elementStack => token => {
    elementStack.pop(); // pop elementStack 的最後一個元素
};
```

> `tagSelfClose` handler

```js
// 遇到 tagStart，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
const handleTagSelfClose = elementStack => token => {
    const node = {type: token.name}; // tagSelfClose node
    elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
};
```

> `Text` handler

```js
// 遇到 tagStart，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
const handleText = elementStack => token => {
    const node = {type: 'text', content: token.content}; // text node
    elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
};
```

### 實作

```js
const assert = require('node:assert');

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
];

const expected_AST = {
    type: 'root',
    children: [
        {
            "type": "div",
            "children": [
                {
                    "type": "p",
                    "children": [
                        {
                            "type": "text",
                            "content": "Vue"
                        }
                    ]
                },
                {"type": "input"},
                {
                    "type": "p",
                    "children": [
                        {
                            "type": "text",
                            "content": "Template"
                        }
                    ]
                }
            ]
        }
    ]
}

const root = {type: 'root', children: []};
const output_AST = root;
const elementStack = [root];

const handleTagStart = elementStack => token => {
    const node = {type: token.name, children: []}; // node A
    elementStack[elementStack.length - 1].children.push(node); // node A 當作 elementStack 的最後一個元素的 children
    elementStack.push(node); // 並將 node A push elementStack
};

const handleTagEnd = elementStack => token => {
    elementStack.pop(); // pop elementStack 的最後一個元素
};

const handleTagSelfClose = elementStack => token => {
    const node = {type: token.name}; // tagSelfClose node
    elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
};

const handleText = elementStack => token => {
    const node = {type: 'text', content: token.content}; // text node
    elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
};

while (tokens.length > 0) {
    // 取出目前要 check 的 token
    const token = tokens.shift();

    // 遇到 tagStart，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
    if (token.type === 'tagStart') handleTagStart(elementStack)(token);

    // 遇到 tagEnd，則 pop elementStack 的最後一個元素
    if (token.type === 'tagEnd') handleTagEnd(elementStack)(token);

    // 遇到 text，當作 elementStack 的最後一個元素的 children
    if (token.type === 'text') handleText(elementStack)(token);

    // 遇到 tagSelfClose，當作 elementStack 的最後一個元素的 children
    if (token.type === 'tagSelfClose') handleTagSelfClose(elementStack)(token);
}

assert.deepEqual(output_AST, expected_AST);
```

----

相信有許多邦友發現了，最近討論的 HTML 範例都是沒有屬性的，那如果有屬性要如何分析呢？先留給大家思考了，我們下一篇再來討論。

### 參考資料

- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 15.3 章節
- [html-spec # parse-state](https://html.spec.whatwg.org/multipage/parsing.html#parse-state)
