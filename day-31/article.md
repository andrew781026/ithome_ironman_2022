# [Day31] - Mimic CodePen 介面

day-1 時我們目標自製一個 vue 在 client-side 去 render JS . HTML . CSS 三大部分

經過 30 天的說明，我們解決了 CSS 跟 HTML 在 client-side render 的部分

JS on client-side render 的部分，有點是一個很大的 TOPIC，需要許多時間描述

下面我們就偷懶使用 iframe 來製作 day-01 的目標 `< 復刻 Codepen 的功能 >` 吧！

### 時序說明

![time-diagram](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-31/img/time-diagram.png)

1. 訪問 localhost:3090
2. 被 redirect 到 localhost:3090/pen/:penId 的頁面
3. 載入預設的 html，並在載入時執行 init 的相關 JS
4. 利用 localhost:3090/data/:penId，來取得已設定的 html . css . js 到對應的編輯區
5. 編輯 html 時，post 目前編輯區的 html . css . js 給 server
6. 得到剛剛的 post 回覆 200/OK 後，將 iframe 做 reload

## 架構說明

- 畫面：分成 CSS . JS . HTML 編輯區(textarea) & 畫面顯示區(iframe)

![screenshot](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-31/img/screenshot.png)

- HTTP：
  - GET ${server}/pen/:penId = 顯示三個編輯區的 HTML
  - POST ${server}/data/:penId = 取回上次設定的 HTML . CSS . JS
  - POST ${server}/iframe/:penId = 將編輯的 HTML . CSS . JS 傳給 server
  - GET ${server}/iframe/:penId = 用於 iframe 的顯示，會利用 POST 傳入的 HTML . CSS . JS 組出對應的 HTML

### 實作

#### 1.Pen 編輯頁面

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client CodePen</title>

  <!-- 利用 jsdelivr 引用 github 上設定好的 style -->
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/andrew781026/ithome_ironman_2022/day-31/src/css/style.css">
</head>
<body>
<header>
  <button class="save-btn">儲存</button>
  PEN_ID :
  <span id="penId"></span>
</header>
<main>
  <div class="container">
    <div class="wrap" data-title="js"><textarea id="js" cols="30" rows="10"></textarea></div>
    <div class="wrap" data-title="css"><textarea id="css" cols="30" rows="10"></textarea></div>
    <div class="wrap" data-title="html"><textarea id="html" cols="30" rows="10"></textarea></div>
  </div>
  <iframe src="" id="iframe"></iframe>
</main>

<script>
  const debounce = (job, delay = 1000) => {
    let timer = null;
    return function () {
      timer && clearTimeout(timer);
      timer = setTimeout(job, delay);
    }
  }

  const getPenId = () => location.pathname.split('/').pop();
  const updatePenId = () => {
    const penId = getPenId();
    document.querySelector('#iframe').src = `http://localhost:3090/iframe/${penId}`;
    document.querySelector('#penId').innerText = penId;
  };

  const iframeReload = () => document.querySelector('#iframe').contentWindow.location.reload();

  async function updateIframe() {

    const data = ['js', 'css', 'html']
      .map(item => [item, document.querySelector('#' + item).value]);
    const json = Object.fromEntries(data);

    await fetch(`http://localhost:3090/iframe/${getPenId()}`, {
      body: JSON.stringify(json), // must match 'Content-Type' header
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, same-origin, *omit
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
    });

    iframeReload();
    document.querySelector('.save-btn').classList.remove('need-update');
  }

  async function initIframe() {

    // 取得已存在的 PenId 資訊 - HTML . CSS . JS
    const response = await fetch(`http://localhost:3090/data/${getPenId()}`, {
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    // init the html , css ,js data
    ['js', 'css', 'html'].forEach(item => document.querySelector('#' + item).value = data[item]);
  }

  // 綁定 JS . CSS . HTML 三個編輯區塊的 keyup event
  const bindKeyupEvent = () => {

    const debounceUpdateIframe = debounce(updateIframe);

    ['js', 'css', 'html'].forEach(item => {
      document
        .querySelector('#' + item)
        .addEventListener('keyup', () => {
          document.querySelector('.save-btn').classList.add('need-update');
          debounceUpdateIframe();
        })
    })
  }

  const init = () => {
    updatePenId();
    bindKeyupEvent();
    initIframe();
  }

  init();
</script>
</body>
</html>
```

#### 2.Express 

```js
const bodyParser = require('body-parser');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const port = process.env.PORT || 3090;
const _uuid = require('./uuid');

app.use(bodyParser.json());
// app.use('/static', express.static('public'));

// NOTE : 下方 pens 可能會造成 memory leak，建議在大專案中將 pens 資料存到 Redis 中
const pens = {};

app.get('/', (req, res) => {
  res.redirect(`pen/${_uuid()}`);
});

app.get('/pen/:penId', (req, res) => {
  res.sendFile(__dirname + '/clientCodepen.html');
});

app.get('/data/:penId', (req, res) => {

  const {penId} = req.params;
  const {html = '', css = '', js = ''} = pens[penId] || {};
  res.json({html, css, js});
});

app.get('/iframe/:penId', (req, res) => {

  const {penId} = req.params;
  const {html = '', css = '', js = ''} = pens[penId] || {};

  // 利用之前傳入的 HTML . CSS . JS 組出
  const output = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" >
        <title>pen at ${penId}</title>
        <style>
          ${css}
        </style>
    </head>
    <body>
      ${html}
      <script>
        ${js}
      </script>
    </body>
    </html>
  `

  res.header('Content-Type', 'text/html').send(output);
});

app.post('/iframe/:penId', (req, res) => {

  const {penId} = req.params;
  const {html = '', css = '', js = ''} = req.body;
  pens[penId] = {html, css, js};
  res.json({code: 200, msg: 'OK！'});
});

http.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}/`);
});
```

## 成果

![screenshot](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-31/img/screenshot.png)
