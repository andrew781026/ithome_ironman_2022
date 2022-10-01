// 讀取檔案內容
const fs = require('fs');
const str = fs.readFileSync('sample.html', 'utf8');
const voidElements = require('./void-elements');

// 第二步，定義關鍵的狀態
const STATUS = {
    INITIAL: 0,
    IN_TAG: 1,
    IN_TAG_END: 2,
    IN_ATTR: 3,
}

let CURR_STATUS = 0;
let collected = '';
const tokens = [];
const isAlphabet = char => /[a-zA-Z]/.test(char);
const resetCollect = () => collected = '';
const voidElementChecker = tagName => Boolean(voidElements[tagName]);

// 第三步 - 逐字切分
const charList = str.split('');

const handle_INITIAL = current => {

    // INITIAL 狀態時遇到 `<`
    if (current === '<') {

        const next = charList[0];

        // INITIAL 狀態時遇到 `</`，切換狀態為 IN_TAG_END
        if (next === '/') CURR_STATUS = STATUS.IN_TAG_END;
        // INITIAL 狀態時遇到 `<`，切換狀態為 IN_TAG
        else CURR_STATUS = STATUS.IN_TAG;

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

    // 遇到空格變成狀態 IN_ATTR
    if (current === ' ') {
        CURR_STATUS = STATUS.IN_ATTR;
        const tagName = collected;
        tokens.push({
            type: 'tagStart',
            name: tagName,
            isVoidElement: voidElementChecker(tagName),
        });
        resetCollect();
        return;
    }

    if (current === '/') {

        const next = charList[0];

        // 自關閉標籤 voidElement ，例如 <input />
        if (collected.length > 0 && next === '>') {
            tokens.push({type: 'tagSelfClose', name: collected});
            resetCollect();
            charList.shift(); // next char `>` 已確認過，所以可以丟掉
            CURR_STATUS = STATUS.INITIAL;
        }

        // </ 關閉標籤，例如 </div>
        else CURR_STATUS = STATUS.IN_TAG_END;
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

const handle_IN_ATTR = current => {

    const next = charList[0];
    if (current === '/' && next === '>') {
        CURR_STATUS = STATUS.INITIAL;
        tokens[tokens.length - 1].attrStr = collected.trim(); // 設定最後一個 token 的 attrStr
        resetCollect();
        charList.shift(); // next char `>` 已確認過，所以可以丟掉
        return;
    }

    if (current === '>') {
        CURR_STATUS = STATUS.INITIAL;
        tokens[tokens.length - 1].attrStr = collected.trim(); // 設定最後一個 token 的 attrStr
        resetCollect();
        return;
    }

    // 將字元收集起來
    collected += current;
}

try {

    while (charList.length > 0) {

        const current = charList.shift();

        if (CURR_STATUS === STATUS.INITIAL) handle_INITIAL(current);
        if (CURR_STATUS === STATUS.IN_TAG) handle_IN_TAG(current);
        if (CURR_STATUS === STATUS.IN_TAG_END) handle_IN_TAG_END(current);
        if (CURR_STATUS === STATUS.IN_ATTR) handle_IN_ATTR(current);
    }

} catch (e) {
    console.log('e=', e);
}

console.log('tokens=', tokens);
