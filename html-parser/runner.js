const fs = require('fs');

const tokenizer = require('./html-attr-tokenizer');
const parser = require('./html-token-parser');
const AttrTransformer = require('./attr-transformer');

const htmlStr = fs.readFileSync('./html/with-attr.html', 'utf8');

const tokens = tokenizer(htmlStr);
const ast = parser([...tokens]);
console.log('tokens=', JSON.stringify(tokens, null, 2), '\n-----------------\n');
console.log('ast=', JSON.stringify(ast, null, 2), '\n-----------------\n');

const attrStr = "src=\"https://ithelp.ithome.com.tw/storage/image/fight.svg\"\r\n         alt='\"圖片\"'";
const attrs = new AttrTransformer(attrStr).transform();
console.log('attrs=', JSON.stringify(attrs, null, 2), '\n-----------------\n');
