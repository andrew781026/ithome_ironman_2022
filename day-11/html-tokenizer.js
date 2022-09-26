// myDotEnvTokenizer.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串

const str = `<div>
                <p>Vue</p>
                 <input />
                <p>Template</p>
            </div>`;

// 第二步 - 定義特定字元
let CURR_STATUS = 0; // 0: normal, 1: in quotation, 2: in comment, 3: after equal
let collected = '';
const tokens = [];

const STATUS = {
    INITIAL: 0,
    IN_TAG: 1,
    IN_TAG_END: 2,
}

const isAlphabet = char => /[a-zA-Z]/.test(char);
const resetCollect = () => collected = '';

// 第三步 - 逐字讀取 , 遇到特定字元( # . " . = . \n )做特別處理
const charList = str.split('');

const handle_INITIAL = current => {

    // INITIAL 狀態時遇到 `<`
    if (current === '<') {
        // INITIAL 狀態時遇到 `<`，切換狀態為 IN_TAG
        CURR_STATUS = STATUS.IN_TAG;
        // 將 collected 變數中的內容當作 text content
        if (collected.length > 0) {
            tokens.push({type: 'text', value: collected});
            resetCollect();
        }
    }

    // INITIAL 狀態時遇到 `/` 或  `>` 抱錯
    if (current === '/' || current === '>') {
        throw new Error('Unexpected token >>> ', current);
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

const handle_IN_TAG = current => {

    if (current === '/') {

        // 自關閉標籤 voidElement ，例如 <input />
        if (collected.length > 0) {
            tokens.push({type: 'tagSelfClose', name: collected});
            resetCollect();
        }

        // </ 關閉標籤
        CURR_STATUS = STATUS.IN_TAG_END;
    }

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

const handle_IN_TAG_END = current => {

    if (current === '>') {
        if (collected.length > 0) {
            tokens.push({type: 'tagStart', name: collected});
            resetCollect();
            CURR_STATUS = STATUS.INITIAL;
        } else throw new Error('< 跟 > 之間需要有 alpahbet 文字');
    }

    // 如果不是上述的特殊字元，則收集起來
    if (isAlphabet(current)) {
        collected += current;
    }
}

try {

    while (charList.length > 0) {

        const current = charList.shift();

        if (CURR_STATUS === STATUS.INITIAL) handle_INITIAL(current);
        if (CURR_STATUS === STATUS.IN_TAG) handle_IN_TAG(current);
        if (CURR_STATUS === STATUS.IN_TAG_END) handle_IN_TAG_END(current);
    }

} catch (e) {
    console.log('e=', e);
}

console.log('tokens=', tokens);
