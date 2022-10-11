class ScssTokenizer {

  // fields
  CURR_STATUS = 0;
  tokens = [];
  collected = '';
  charList = [];

  // 關鍵的狀態
  static STATUS = {
    INITIAL: 0,
    IN_SINGLE_COMMENT: 1, // 開始於 // 遇到 \n 回到 initial
    IN_MULTI_COMMENT: 2,  // 開始於 /* 遇到 */ 回到 initial
    IN_VAR_NAME: 3,       // initial 開始於 $ 遇到 : 變成 IN_VAR_VALUE
    IN_VAR_VALUE: 4,      // 開始於 : 遇到 ; 變成 INITIAL
    IN_KEYWORD: 5,        // 開始於 @ 遇到 空格 變成 IN_KEYWORD_VALUE
    IN_KEYWORD_VALUE: 6,  // 遇到 ; 變成 INITIAL / 遇到 { 變成 IN_BODY
    IN_BODY: 7,           // 開始於 { 遇到 } 變成 INITIAL
  }

  constructor(scssStr) {
    this.CURR_STATUS = ScssTokenizer.STATUS.INITIAL;
    this.charList = scssStr.split('');
  }

  // methods
  resetCollect = () => this.collected = '';
  collectChar = char => this.collected += char;
  setCurrStatus = status => this.CURR_STATUS = status;
  isLastChar = () => this.charList.length === 1;

  /**
   * 將取到的屬性值放入 token list 中
   * @param value
   */
  setVarValue = value => this.tokens[this.tokens.length - 1].value = value;

  /**
   * 將取到的屬性名稱放入 token list 中
   * @param name
   * @returns {number}
   */
  setVarName = (name) => this.tokens.push({name});

  // 取第一個字元
  getCurr = () => this.charList[0];

  // 取下一個字元
  getNext = () => this.charList[1];

  // 取下 n 個字元
  lookahead = n => this.charList[n + 1];

  // 將目前的字元從 charList 中移除
  removeCurr = () => this.charList.shift();

  // 如果關鍵字是多個的 (例如: `</`)，就需要一次從 charList 中移除 2 個字元
  removeFirstN = n => this.charList = this.charList.slice(n - 1);

  handle_INITIAL() {

    const current = this.getCurr();

    if (current === `/`) {

      const next = this.getNext();

      // 遇到 `//`，切換狀態成 IN_SINGLE_COMMENT
      if (next === `/`) {
        this.setCurrStatus(ScssTokenizer.STATUS.IN_SINGLE_QUOTATION);
        this.removeFirstN(2);
        return;
      }

      // 遇到 `/*`，切換狀態成 IN_MULTI_COMMENT
      if (next === `*`) {
        this.setCurrStatus(ScssTokenizer.STATUS.IN_MULTI_COMMENT);
        this.removeFirstN(2);
        return;
      }
    }

    if (current === `$` || current === `#`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_VAR_NAME);
      this.removeCurr();
      return;
    }

    if (current === `@`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_KEYWORD);
      this.removeCurr();
      return;
    }

    if (!['\r', '\n', ' '].includes(current)) this.collectChar(current);
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

    // IN_ATTR_NAME 狀態時遇到  ` ` or 最後一個字，收集資料當作 attrName，切換狀態成 INITIAL
    if (current === ' ' || this.isLastChar()) {
      this.setCurrStatus(STATUS.INITIAL);
      this.setAttrName((this.collected + current).trim(), true);
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

    // IN_ATTR_VALUE 狀態時遇到  ` ` or 最後一個字，收集資料，切換狀態成 INITIAL
    if (current === ' ' || this.isLastChar()) {
      this.setCurrStatus(STATUS.INITIAL);
      this.setAttrValue((this.collected + current).trim());
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

  tokenize() {
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

module.exports = ScssTokenizer;

