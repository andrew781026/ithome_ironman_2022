const AttrTokenizer = require('./attrStr-tokenizer');

const attrStr = "src=\"https://ithelp.ithome.com.tw/storage/image/fight.svg\"\r\n         alt=圖片";
const attrs = new AttrTokenizer(attrStr).tokenize();
console.log('attrs=', JSON.stringify(attrs, null, 2), '\n-----------------\n');

const attrStr_2 = "type=\"text\" id=\"username\" placeholder=\"請輸入姓名\" disabled";
const attrs_2 = new AttrTokenizer(attrStr_2).tokenize();
console.log('attrs_2=', JSON.stringify(attrs_2, null, 2), '\n-----------------\n');
