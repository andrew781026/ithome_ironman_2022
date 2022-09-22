// myDotEnvParser.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串
const fs = require('fs');
const str = fs.readFileSync('.env-sample', 'utf8');

// 第二步 - 定義特定字元
const EQUAL = '=';
const COMMENT = '#';
const QUOTATION = '"';
let CURR_STATUS = 0; // 0: normal, 1: in quotation, 2: in comment, 3: after equal
let collected = '';
const tokens = [];

const position = {row: 0, column: 0};

const STATUS = {
    NORMAL: 0,
    IN_QUOTATION: 1,
    IN_COMMENT: 2,
    AFTER_EQUAL: 3,
}

const updatePosition = (char) => {
    // 遇到換行符號 , 行數 + 1
    if (char === '\n') {
        position.row++;
        position.column = 0;
    } else {
        position.column++;
    }
}

const resetCollect = () => collected = '';

// 第三步 - 逐字讀取 , 遇到特定字元( # . " . = . \n )做特別處理
const charList = str.split('');

try {

    while (charList.length > 0) {

        const current = charList.shift();

        // 更新目前位置
        updatePosition(current);

        if (CURR_STATUS === STATUS.NORMAL) {

            if (current === '#') {
                CURR_STATUS = STATUS.IN_COMMENT;
                continue;
            }

            if (current === '"') {
                CURR_STATUS = STATUS.IN_QUOTATION;
                continue;
            }

            if (current === '=') {
                CURR_STATUS = STATUS.AFTER_EQUAL; // change to after equal status ( collect value )
                tokens.push({type: 'key', value: collected}); // the collected is key
                resetCollect();
                continue;
            }

            if (current === '\n') {

                // 如果換行前面有收集到字元 , 抱錯
                if (collected.length > 0) throw new Error(`Syntax Error: ${collected} at [Line:Column] = ${position.row}:${position.column}`);
                continue;
            }
        }

        if (CURR_STATUS === STATUS.IN_QUOTATION) {

            if (current === '"') {
                CURR_STATUS = 0;
                tokens.push({type: 'value', value: collected});
                resetCollect();
                continue;
            }
        }

        if (CURR_STATUS === STATUS.IN_COMMENT) {

            if (current === '\n') {
                CURR_STATUS = STATUS.NORMAL;
                tokens.push({type: 'comment', value:'#'+ collected});
                resetCollect();
                continue;
            }
        }

        if (CURR_STATUS === STATUS.AFTER_EQUAL) {

            if (current === '"') {
                if (collected.length > 0) throw new Error(`Syntax Error: ${collected} at [Line:Column] = ${position.row}:${position.column}`);
                CURR_STATUS = STATUS.IN_QUOTATION;
                continue;
            }

            if (current === '#') {
                CURR_STATUS = STATUS.IN_COMMENT;
                tokens.push({type: 'value', value: collected});
                resetCollect();
                continue;
            }

            if (current === '\n') {
                CURR_STATUS = STATUS.NORMAL;
                tokens.push({type: 'value', value: collected});
                continue;
            }
        }

        // 如果沒遇到特殊字元 , 就將 char 收集起來
        if(current !== '\r') collected += current;
    }

} catch (e) {
    console.log('e=', e);
}

console.log('tokens=', tokens);
