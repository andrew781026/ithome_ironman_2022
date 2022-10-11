const ScssTokenizer = require("./tokenizer");

const fs = require("fs");
const scssStr = fs.readFileSync("../src/app.scss").toString();
const tokens = new ScssTokenizer(scssStr).tokenize();
console.log('tokens=', JSON.stringify(tokens, null, 2));
