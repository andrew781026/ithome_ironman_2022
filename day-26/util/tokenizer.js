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

  addToken = token => this.tokens.push(token);

  patchLastToken = patch => {
    const lastToken = this.tokens[this.tokens.length - 1];
    Object.assign(lastToken, patch);
  };

  /**
   * 將取到的屬性值放入 token list 中
   * @param value
   */
  setVarValue = value => this.tokens[this.tokens.length - 1].value = value;

  // 取第一個字元
  getCurr = () => this.charList[0];

  // 取下一個字元
  getNext = () => this.charList[1];

  // 取下 n 個字元
  lookahead = n => this.charList[n + 1];

  // 將目前的字元從 charList 中移除
  removeCurr = () => this.charList.shift();

  // 如果關鍵字是多個的 (例如: `</`)，就需要一次從 charList 中移除 2 個字元
  removeFirstN = n => this.charList = this.charList.slice(n);

  handle_INITIAL() {

    const current = this.getCurr();

    if (current === `/`) {

      const next = this.getNext();

      // 遇到 `//`，切換狀態成 IN_SINGLE_COMMENT
      if (next === `/`) {
        this.setCurrStatus(ScssTokenizer.STATUS.IN_SINGLE_COMMENT);
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

    if (current === `{`) {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_BODY);
      this.addToken({type: 'css', selector: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    if (!['\r', '\n', ' '].includes(current)) this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_SINGLE_COMMENT() {

    const current = this.getCurr();

    if (current === '\n') {
      this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
      this.addToken({type: 'comment', value: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_MULTI_COMMENT() {

    const current = this.getCurr();

    if (current === '*' && this.lookahead(1) === '/') {
      this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
      this.addToken({type: 'comment', value: this.collected});
      this.removeCurr();
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_VAR_NAME() {

    const current = this.getCurr();

    if (current === ':') {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_VAR_VALUE);
      this.addToken({type: 'variable', name: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_VAR_VALUE() {

    const current = this.getCurr();

    if (current === ';') {
      this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
      this.patchLastToken({value: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_KEYWORD() {

    const current = this.getCurr();

    if (current === '{') {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_BODY);
      this.addToken({type: 'keyword', name: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    if (current === ' ' || current === '\n') {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_KEYWORD_VALUE);
      this.addToken({type: 'keyword', name: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_KEYWORD_VALUE() {

    const current = this.getCurr();

    if (current === '{') {
      this.setCurrStatus(ScssTokenizer.STATUS.IN_BODY);
      this.patchLastToken({value: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    if (current === ';' ) {
      this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
      this.patchLastToken({value: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  handle_IN_BODY() {

    const current = this.getCurr();

    if (current === '}') {
      this.setCurrStatus(ScssTokenizer.STATUS.INITIAL);
      this.addToken({type: 'body', content: this.collected});
      this.resetCollect();
      this.removeCurr();
      return;
    }

    this.collectChar(current);
    this.removeCurr();
  }

  tokenize() {
    const {STATUS} = ScssTokenizer;
    while (this.charList.length > 0) {

      if (this.CURR_STATUS === STATUS.INITIAL) this.handle_INITIAL();
      else if (this.CURR_STATUS === STATUS.IN_SINGLE_COMMENT) this.handle_IN_SINGLE_COMMENT();
      else if (this.CURR_STATUS === STATUS.IN_MULTI_COMMENT) this.handle_IN_MULTI_COMMENT();
      else if (this.CURR_STATUS === STATUS.IN_VAR_NAME) this.handle_IN_VAR_NAME();
      else if (this.CURR_STATUS === STATUS.IN_VAR_VALUE) this.handle_IN_VAR_VALUE();
      else if (this.CURR_STATUS === STATUS.IN_KEYWORD) this.handle_IN_KEYWORD();
      else if (this.CURR_STATUS === STATUS.IN_KEYWORD_VALUE) this.handle_IN_KEYWORD_VALUE();
      else if (this.CURR_STATUS === STATUS.IN_BODY) this.handle_IN_BODY();
    }
    return this.tokens;
  }
}

module.exports = ScssTokenizer;

