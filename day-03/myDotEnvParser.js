// myDotEnvParser.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串
const fs = require('fs');
const str = fs.readFileSync('.env-sample', 'utf8');

// 第二步 - 定義特定字元
const EQUAL = '=';
const COMMENT = '#';
const QUOTATION = '"';
let QUOTATION_NUM = 0;
let tempValue = '';
let tempKey = '';
const output = {};

// 第三步 - 逐行讀取 , 遇到特定字元( # . " . = )做特別處理
const lineList = str.split('\n');

for (let lineno = 0; lineno < lineList.length ; lineno++) {

    const lineStr = lineList[lineno];

    // # 開頭 , 整行跳過
    if (lineStr.trim().startsWith('#')) {
        continue;
    }

    // 遇過的 " 是奇數 => 遇到的內容都當作字串 , 直到遇到下一個 "
    if (QUOTATION_NUM % 2 === 1) {

        // 遇過結尾符的 " , 將 value 文字收納起來
        if (lineStr.indexOf('"') > -1) {

            QUOTATION_NUM++;
            const CURR_QUOTATION = {
                lineno: lineno,
                column: lineStr.indexOf('"'),
            }

            // 取得 value 文字
            const value = tempValue + lineStr.substring(0, CURR_QUOTATION.column);
            output[tempKey] = value.replaceAll('\r','\r\n');
        }

        tempValue += lineStr;

        // " 後面指有可能是 # 的註解 , 直接換下行處理
        continue;
    }

    if (QUOTATION_NUM % 2 === 0){

        // 有 " 先記錄位置
        if (lineStr.indexOf('"') > -1) {

            // 單行
            if(lineStr.match(/"/g).length === 2) {
                const key = lineStr.substring(0, lineStr.indexOf('='));
                const value = lineStr.substring(lineStr.indexOf('"')+1,lineStr.lastIndexOf('"'));
                output[key] = value;
            }

            // 多行
            else{
                QUOTATION_NUM++;

                // 先將 " 後面的文字收集起來
                tempKey = lineStr.substring(0, lineStr.indexOf('='));
                tempValue = lineStr.substring(lineStr.indexOf('"') + 1);
            }
        }

        // 有 = 取變數名稱跟值
        if (lineStr.indexOf('=') > -1 && lineStr.indexOf('"') === -1) {
            const key = lineStr.substring(0, lineStr.indexOf('='));
            const value = lineStr.substring(lineStr.indexOf('=') + 1,lineStr.indexOf('#')).trim();
            output[key] = value;
        }
    }
}

console.log('output=',output);
