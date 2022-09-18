const dotenv = require('dotenv');
const fs = require('fs');

// 1. 讀取 .env 檔案
const properties = fs.readFileSync('.env').toString();

// 2. 將 .env 檔案內容轉換成 AST ( Parser )
const parsed = dotenv.parse(properties);

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
