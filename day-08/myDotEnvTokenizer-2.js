// myDotEnvTokenizer.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串
const fs = require('fs');
const str = fs.readFileSync('.env-sample', 'utf8');

// 第二步 - 定義特定字元
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

const resetCollect = () => collected = '';

// 第三步 - 逐字讀取 , 遇到特定字元( # . " . = . \n )做特別處理
const charList = str.split('');

const handle_NORMAL = current => {

    // NORMAL 狀態時遇到 `#` ，切換狀態為 IN_COMMENT
    if (current === '#') {
        CURR_STATUS = STATUS.IN_COMMENT;
    }

    // NORMAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION
    if (current === '"') {
        CURR_STATUS = STATUS.IN_QUOTATION;
    }

    // NORMAL 狀態時遇到 `=` ，切換狀態為 AFTER_EQUAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字
    if (current === '=') {
        CURR_STATUS = STATUS.AFTER_EQUAL; // change to after equal status ( collect value )
        tokens.push({type: 'key', value: collected}); // the collected is key
        resetCollect();
    }

    // NORMAL 狀態時遇到 `\n` ，不做處理，收集下個字元
    if (current === '\n') {
        // do nothing
    }
}

const handle_IN_QUOTATION = current => {

    // IN_QUOTATION 狀態時遇到 `=` . `\n` . `#` ，不做處理，收集下個字元
    if (current === '\n' || current === '=' || current === '#') {
        // do nothing
    }

    // IN_QUOTATION 狀態時遇到 `"` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '"') {
        CURR_STATUS = 0;
        tokens.push({type: 'value', value: collected});
        resetCollect();
    }
}

const handle_IN_COMMENT = current => {

    // IN_COMMENT 狀態時遇到 `=` . `"` . `#` ，不做處理，收集下個字元
    if (current === '"' || current === '=' || current === '#') {
        // do nothing
    }

    // IN_COMMENT 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '\n') {
        CURR_STATUS = STATUS.NORMAL;
        tokens.push({type: 'comment', value:'#'+ collected});
        resetCollect();
    }
}

const handle_AFTER_EQUAL = current => {

    // AFTER_EQUAL 狀態時遇到 `=` . `"` . `#` ，不做處理，收集下個字元
    if ( current === '=' || current === '#') {
        // do nothing
    }

    // AFTER_EQUAL 狀態時遇到 `"` ，切換狀態為 IN_QUOTATION
    if (current === '"') {
        CURR_STATUS = STATUS.IN_QUOTATION;
    }

    // AFTER_EQUAL 狀態時遇到 `#` ，切換狀態為 NORMAL，並將 collected 中的文字當作 key，然後清空 collected 變數內的文字
    if (current === '#') {
        CURR_STATUS = STATUS.IN_COMMENT;
        tokens.push({type: 'value', value: collected});
        resetCollect();
    }

    // AFTER_EQUAL 狀態時遇到 `\n` ，切換狀態為 NORMAL，並將收集的文字當作 value，然後清空 collected 變數內的文字
    if (current === '\n') {
        CURR_STATUS = STATUS.NORMAL;
        tokens.push({type: 'value', value: collected});
    }
}

try {

    while (charList.length > 0) {

        const current = charList.shift();

        if(CURR_STATUS === STATUS.NORMAL) handle_NORMAL(current);
        if(CURR_STATUS === STATUS.IN_QUOTATION) handle_IN_QUOTATION(current);
        if(CURR_STATUS === STATUS.IN_COMMENT) handle_IN_COMMENT(current);
        if(CURR_STATUS === STATUS.AFTER_EQUAL) handle_AFTER_EQUAL(current);

        // 如果沒遇到特殊字元 , 就將 char 收集起來
        if(current !== '\r') collected += current;
    }

} catch (e) {
    console.log('e=', e);
}

console.log('tokens=', tokens);
