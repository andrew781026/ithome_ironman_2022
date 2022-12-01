const bodyParser = require('body-parser');
const app = require('express')();
const http = require('http').Server(app);
const port = process.env.PORT || 3090;
const _uuid = require('./uuid');

app.use(bodyParser.json());

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
