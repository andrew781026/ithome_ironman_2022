const dotenv = require('dotenv');
const fs = require('fs');

// 1. 讀取 .env 檔案
const properties = fs.readFileSync('.env-sample').toString();

console.log('properties=',properties);

const str = `
# .env-sample file
# This is a comment
SECRET_KEY=YOURSECRETKEYGOESHERE # comment
SECRET_HASH="something-with-a-#-hash"
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END DSA PRIVATE KEY-----"
`

// 2. 將 .env 檔案內容轉換成 AST ( Parser )
const parsed = dotenv.parse(str);

// 3. 將 AST 資訊放入 process.env 中
Object.keys(parsed).forEach(key => process.env[key] = parsed[key]);

// 4. 檢查 process.env 是否有 .env 的資料
console.log('process.env=',process.env);
console.log('parsed=',parsed);
/**
 *  {
 *    S3_BUCKET: 'YOURS3BUCKET',
 *    SECRET_KEY: 'YOURSECRETKEYGOESHERE'
 *  }
 *
 * */
