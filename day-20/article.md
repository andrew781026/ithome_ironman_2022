# [Day20] - 將 AST 轉換成 HTML DOM 元素 - Renderer 

## 前言

day-10 到 day-19 我們花了 10 天說明如何將 HTML 轉換成 AST， 經歷了下圖的流程

![tokenizer-parser-transformer]()

那當我們拿到 AST 之後，我們要怎麼像 Vue 一樣將它放到網頁中呢？

這就牽涉到該如何建立 HTML element 並將 child element 放到 parent element 中。

以下幾個重要的 POINT

- 建立 HTML element
- 將 attrs 放到 element 中
- 將 child element 放到 parent element 中

---

### 建立元素 ( createElement )

> MDN 文件 [createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) 的說明

- 函式說明

#### 格式

```
createElement(tagName, is)
```

#### 參數

- tagName ：要建立的元素名稱，有 ul, li, div, span ...等等，只要在 [HTML TAG 列表](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) 中有的都可以用
- is ：可選參數，當使用的 WebComponents 你只想用原有的元素名稱顯示時，就可以添加這個參數

#### 返回值

- 會回傳一個 HTML element

#### 範例 

我們可以用以下方式建立 HTML element

```js
const divElement = document.createElement('div');
// <div></div>

const pElement = document.createElement('p');
// <p></p>

const wordCountElement = createElement('p', { is: 'word-count' });
// <p is="word-count"></p> - 這個 element 是自訂的元素 ( word-count )
```

> 文字不算是一種 Element 因此需要使用 [document.createTextNode(text)](https://developer.mozilla.org/en-US/docs/Web/API/Document/createTextNode) 來建立 text node

---

### 添加屬性 ( setAttribute )

> MDN 文件 [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) 的說明

#### 格式

```
setAttribute(name, value)
```

#### 參數

- name  ： 屬性的名稱 ( 例如： class, id, style ...等等 )
- value ： 屬性的值 ( 例如： input 的 type 屬性值，可以是 text, password, email, search ...等等 )

#### 返回值

- None ( 不會回傳任何值 )

#### 範例

我們可以用以下方式在 HTML element 中添加屬性

```js
const button = document.querySelector("button");

button.setAttribute("name", "helloButton"); // 追加 name 屬性
button.setAttribute("disabled", "");        // 追加 disabled 屬性
// <button name="helloButton" disabled></button>
```

### 附加子元素 ( appendChild )

> MDN 文件 [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) 的說明

- 函式說明

#### 格式

```
appendChild(aChild)
```

#### 參數

- aChild ： 一個 HTML element 或是 text node

#### 返回值

- 會回傳剛剛附加的 aChild

#### 範例

我們可以用以下方式附加子元素到 HTML element 中

```js
const p = document.createElement("p");
document.body.appendChild(p);
/* 
   <body>
     <p></p>
   </body>
 */

const ul = document.createElement("ul");
const li01 = document.createElement("li");
const li02 = document.createElement("li");
ul.appendChild(li01);
ul.appendChild(li02);
/* 
   <ul>
     <li></li>
     <li></li>
   </ul>
 */

const textNode = document.createTextNode("首頁");
li01.appendChild(textNode);
/* 
   <ul>
     <li>首頁</li>
     <li></li>
   </ul>
 */
```

## 建立渲染器 createRenderer

## 將 AST 附加到網頁的 body 中

複習一下昨天最後的 newAST 結果

```javascript
const newAST = {
  "type": "root",
  "children": [
    {
      "type": "div",
      "attrStr": "id=\"app\"",
      "children": [
        {
          "type": "p",
          "attrStr": "class=\"text-red\"",
          "children": [
            {
              "type": "text",
              "content": "Vue"
            }
          ],
          "attrs": [
            {
              "name": "class",
              "value": "text-red"
            }
          ]
        },
        {
          "type": "input",
          "attrStr": "type=\"text\" id=\"username\" placeholder=\"請輸入姓名\" disabled",
          "attrs": [
            {
              "name": "type",
              "value": "text"
            },
            {
              "name": "id",
              "value": "username"
            },
            {
              "name": "placeholder",
              "value": "請輸入姓名"
            },
            {
              "name": "disabled",
              "value": true
            }
          ]
        },
        {
          "type": "img",
          "attrStr": "src=\"https://ithelp.ithome.com.tw/storage/image/fight.svg\"\r\n         alt='\"圖片\"'",
          "attrs": [
            {
              "name": "src",
              "value": "https://ithelp.ithome.com.tw/storage/image/fight.svg"
            },
            {
              "name": "alt",
              "value": "\"圖片\""
            }
          ]
        },
        {
          "type": "p",
          "attrStr": "style=\"margin-top: 3px\"",
          "children": [
            {
              "type": "text",
              "content": "\"Template\""
            }
          ],
          "attrs": [
            {
              "name": "style",
              "value": "margin-top: 3px"
            }
          ]
        }
      ],
      "attrs": [
        {
          "name": "id",
          "value": "app"
        }
      ]
    }
  ]
}
```

利用上面的 renderer 就可以將昨天的 newAST 生成 HTML DOM 附加到網頁的 body 中

```javascript
const renderer = createRenderer();
const body = document.querySelector("body");
body.appendChild(renderer.render(newAST));
```

## 總結

今天我們說明了如何將 AST 轉換成 HTML DOM，並且附加到 body 中。

相信邦友們也比較了解為何花那麼長的篇幅說明 parser 跟 AST 了吧！ヽ(✿ﾟ▽ﾟ)ノ

### 參考資料

- [HTML SPEC - rendering](https://html.spec.whatwg.org/multipage/#toc-rendering)
- [書籍 - Vue.js 設計與實現](https://www.tenlong.com.tw/products/9787115583864) - 第 7 . 8 章
- [Chiu CC - Graph: Breadth-First Search(BFS，廣度優先搜尋)](https://alrightchiu.github.io/SecondRound/graph-breadth-first-searchbfsguang-du-you-xian-sou-xun.html)
- [JavaScript实现深度优先（DFS）和广度优先（BFS）算法](https://juejin.cn/post/6956172064252231717)
