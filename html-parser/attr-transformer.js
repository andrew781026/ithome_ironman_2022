// 便利的輔助函式
const isAlphabet = char => /[a-zA-Z]/.test(char);

class AttrTokenizer {

    // fields
    CURR_STATUS = 0;
    tokens = [];
    collected = '';
    charList = [];

    // 關鍵的狀態
    static STATUS = {
        INITIAL: 0,
        IN_ATTR_NAME: 1,
        IN_ATTR_VALUE: 2,
        IN_SINGLE_QUOTATION: 3,
        IN_DOUBLE_QUOTATION: 4,
    }

    constructor(attrStr) {
        this.CURR_STATUS = AttrTokenizer.STATUS.INITIAL;
        this.charList = attrStr.split('');
    }

    // methods
    resetCollect = () => this.collected = '';
    collectChar = char => this.collected += char;
    setCurrStatus = status => this.CURR_STATUS = status;

    /**
     * 將取到的屬性值放入 token list 中
     * @param value
     */
    setAttrValue = value => this.tokens[this.tokens.length - 1].value = value;

    /**
     * 將取到的屬性名稱放入 token list 中
     * @param name
     * @param onlyName 只有 name 沒有 value
     * @returns {number}
     */
    setAttrName = (name, onlyName) => {
        if (onlyName) return this.tokens.push({name, value: true});
        else return this.tokens.push({name});
    }

    // 取第一個字元
    getCurr = () => this.charList[0];

    // 取下一個字元
    getNext = () => this.charList[1];

    // 取下 n 個字元
    getNextN = n => this.charList[n + 1];

    // 將目前的字元從 charList 中移除
    removeCurr = () => this.charList.shift();

    // 如果關鍵字是多個的 (例如: `</`)，就需要一次從 charList 中移除 2 個字元
    removeFirstN = n => this.charList = this.charList.slice(n - 1);

    handle_INITIAL() {

        const current = this.getCurr();
        const {STATUS} = AttrTokenizer;

        // INITIAL 狀態時遇到 `英文字母`
        if (isAlphabet(current)) {
            this.setCurrStatus(STATUS.IN_ATTR_NAME);
            this.collected += current;
            this.removeCurr();
            return;
        }

        this.removeCurr();
    }

    handle_IN_ATTR_NAME() {

        const current = this.getCurr();
        const {STATUS} = AttrTokenizer;

        // IN_ATTR_NAME 狀態時遇到 `=`，切換狀態成 IN_ATTR_VALUE
        if (current === '=') {
            this.setCurrStatus(STATUS.IN_ATTR_VALUE);
            this.setAttrName(this.collected);
            this.resetCollect();
            this.removeCurr();
            return;
        }

        // IN_ATTR_NAME 狀態時遇到 `/` or `>` or ` `，收集資料，切換狀態成 INITIAL
        if (current === '/' || current === '>' || current === ' ') {
            this.setCurrStatus(STATUS.INITIAL);
            this.setAttrName(this.collected, true);
            this.resetCollect();
            this.removeCurr();
            return;
        }

        // 非特殊字元的情況
        this.collectChar(current);
        this.removeCurr();
    }

    handle_IN_ATTR_VALUE() {

        const current = this.getCurr();
        const {STATUS} = AttrTokenizer;

        // IN_ATTR_VALUE 狀態時遇到 `/` or `>` or ` `，收集資料，切換狀態成 INITIAL
        if (current === '/' || current === '>' || current === ' ') {
            this.setCurrStatus(STATUS.INITIAL);
            this.setAttrValue(this.collected);
            this.resetCollect();
            this.removeCurr();
            return;
        }

        // IN_ATTR_VALUE 狀態時遇到 `'`，切換狀態成 IN_SINGLE_QUOTATION
        if (current === "'") {
            this.setCurrStatus(STATUS.IN_SINGLE_QUOTATION);
            this.removeCurr();
            return;
        }

        // IN_ATTR_NAME 狀態時遇到 `"`，切換狀態成 IN_DOUBLE_QUOTATION
        if (current === '"') {
            this.setCurrStatus(STATUS.IN_DOUBLE_QUOTATION);
            this.removeCurr();
            return;
        }

        // 非特殊字元的情況
        this.collectChar(current);
        this.removeCurr();
    }

    handle_IN_SINGLE_QUOTATION() {

        const current = this.getCurr();
        const {STATUS} = AttrTokenizer;

        // IN_SINGLE_QUOTATION 狀態時遇到 `'`，切換狀態成 INITIAL
        if (current === `'`) {
            this.setCurrStatus(STATUS.INITIAL);
            this.setAttrValue(this.collected);
            this.resetCollect();
            this.removeCurr();
            return;
        }

        // 非特殊字元的情況
        this.collectChar(current);
        this.removeCurr();
    }

    handle_IN_DOUBLE_QUOTATION() {

        const current = this.getCurr();
        const {STATUS} = AttrTokenizer;

        // IN_DOUBLE_QUOTATION 狀態時遇到 `"`，切換狀態成 INITIAL
        if (current === `"`) {
            this.setCurrStatus(STATUS.INITIAL);
            this.setAttrValue(this.collected);
            this.resetCollect();
            this.removeCurr();
            return;
        }

        // 非特殊字元的情況
        this.collectChar(current);
        this.removeCurr();
    }

    transform() {
        const {STATUS} = AttrTokenizer;
        while (this.charList.length > 0) {

            if (this.CURR_STATUS === STATUS.INITIAL) this.handle_INITIAL();
            else if (this.CURR_STATUS === STATUS.IN_ATTR_NAME) this.handle_IN_ATTR_NAME();
            else if (this.CURR_STATUS === STATUS.IN_ATTR_VALUE) this.handle_IN_ATTR_VALUE();
            else if (this.CURR_STATUS === STATUS.IN_SINGLE_QUOTATION) this.handle_IN_SINGLE_QUOTATION();
            else if (this.CURR_STATUS === STATUS.IN_DOUBLE_QUOTATION) this.handle_IN_DOUBLE_QUOTATION();
        }
        return this.tokens;
    }
}

module.exports = AttrTokenizer;
