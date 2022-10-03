const fs = require('fs');

const tokenizer = require('./html-attr-tokenizer');
const parser = require('./html-token-parser');
const AttrTokenizer = require('./attrStr-tokenizer');

const htmlStr = fs.readFileSync('./html/with-attr.html', 'utf8');

const tokens = tokenizer(htmlStr);
const ast = parser([...tokens]);
console.log('tokens=', JSON.stringify(tokens, null, 2), '\n-----------------\n');
console.log('ast=', JSON.stringify(ast, null, 2), '\n-----------------\n');

const attrStr = "src=\"https://ithelp.ithome.com.tw/storage/image/fight.svg\"\r\n         alt=圖片";
const attrs = new AttrTokenizer(attrStr).tokenize();
console.log('attrs=', JSON.stringify(attrs, null, 2), '\n-----------------\n');

const attrStr_2 = "type=\"text\" id=\"username\" placeholder=\"請輸入姓名\" disabled";
const attrs_2 = new AttrTokenizer(attrStr_2).tokenize();
console.log('attrs_2=', JSON.stringify(attrs_2, null, 2), '\n-----------------\n');
