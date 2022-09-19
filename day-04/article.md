# [Day04] - 逐行分析 ( Line By Line Parse )

昨天我們提到了 .env 的四大規則，今天我們來看看這些規則可以如何被解析吧 !

### 解析方法一：逐行解析

我們先研究一下， .env 的規則要如何用 code 來對應分析呢 ?

1. 以 `=` 作為分隔符號 , 前面當變數 , 後面當值

```javascript
// 等號之前是 KEY 
const key = lineStr.substring(0, lineStr.indexOf('='));

// 等號之後是 VALUE
const value = lineStr.substring(lineStr.indexOf('=') + 1);
```

2. `#` 後面是註解

2.1 如果 `#` 在第一個字元，就整行忽略掉

```javascript
// 開頭是 # 的行 , 直接跳過
const lineStr = '  # .env-sample file';
if (lineStr.trim().startsWith('#')) {
    // skip; // 這行忽略掉
}
```

2.2 如果 `#` 不在第一個字元，而在後面

以 `SECRET_KEY=YOURSECRETKEYGOESHERE # comment` 為例

前面的 value 會取到 `YOURSECRETKEYGOESHERE # comment` , 而後面的 comment 需要忽略

因此需要將前面的 value 改成用 `lineStr.substring(lineStr.indexOf('=') + 1, lineStr.indexOf('#'))` 來取值

```javascript
// 前面的 value 只能取到 # 前面文字
const lineStr = 'SECRET_KEY=YOURSECRETKEYGOESHERE # comment'
const value = lineStr.substring(lineStr.indexOf('=') + 1, lineStr.indexOf('#'));
```

3. `"` 是一對的 , 中間遇到的換行 ( \n ) . 特殊字元 ( # . = ) 不起效果

```javascript
// 多行模式中 ~~~
if (IS_IN_QUOTATION) {

    // 遇過結尾符的 " , 將 value 文字收納起來
    if (lineStr.indexOf('"') > -1) {
        // 取得 value 文字
        const value = tempValue + lineStr.substring(0, lineStr.indexOf('"'));
        output[tempKey] = value;
        IS_IN_QUOTATION = false;
    
    } else tempValue += lineStr + '\n';
    
    continue;
}

// 多行模式未啟動 ~~~
if (!IS_IN_QUOTATION && lineStr.indexOf('"') > -1) {

    // 單行
    if (lineStr.match(/"/g).length > 1) {
        const key = lineStr.substring(0, lineStr.indexOf('='));
        const value = lineStr.substring(lineStr.indexOf('"') + 1, lineStr.lastIndexOf('"'));
        output[key] = value;
    }

    // 多行
    else {
        IS_IN_QUOTATION = true; // 啟動多行模式

        // 先將 " 後面的文字收集起來
        tempKey = lineStr.substring(0, lineStr.indexOf('='));
        tempValue = lineStr.substring(lineStr.indexOf('"') + 1) + '\n';
    }
}
```

### 總結

```javascript
// myDotEnvParser.js

// 第一步 - 讀取檔案內容 , 取得要 Parser 的字串
const fs = require('fs');
const str = fs.readFileSync('./.env-sample', 'utf8');

// 第二步 - 定義特定字元
const EQUAL = '=';
const COMMENT = '#';
const QUOTATION = '"';

// 第三步 - 逐行讀取 , 遇到特定字元( # . " . = )做特別處理
const lineList = str.split('\n');

for (let lineno = 0; lineno < lineList.length; lineno++) {

    const lineStr = lineList[lineno];

    if (IS_IN_QUOTATION) {

        // 遇過結尾符的 " , 將 value 文字收納起來
        if (lineStr.indexOf('"') > -1) {
            // 取得 value 文字
            const value = tempValue + lineStr.substring(0, lineStr.indexOf('"'));
            output[tempKey] = value;
            IS_IN_QUOTATION = false;

        } else tempValue += lineStr + '\n';

        continue;
    }

    // # 開頭 , 整行跳過
    if (lineStr.trim().startsWith('#')) {
        continue;
    }

    // 有 " 先記錄位置
    if (lineStr.indexOf('"') > -1) {

        // 單行
        if (lineStr.match(/"/g).length > 1) {
            const key = lineStr.substring(0, lineStr.indexOf('='));
            const value = lineStr.substring(lineStr.indexOf('"') + 1, lineStr.lastIndexOf('"'));
            output[key] = value;
        }

        // 多行
        else {
            IS_IN_QUOTATION = true;

            // 先將 " 後面的文字收集起來
            tempKey = lineStr.substring(0, lineStr.indexOf('='));
            tempValue = lineStr.substring(lineStr.indexOf('"') + 1) + '\n';
        }
    }

    // 有 = 取變數名稱跟值
    if (lineStr.indexOf('=') > -1 && lineStr.indexOf('"') === -1) {
        const key = lineStr.substring(0, lineStr.indexOf('='));
        const value = lineStr.substring(lineStr.indexOf('=') + 1, lineStr.indexOf('#')).trim();
        output[key] = value;
    }
}

console.log('output=', output);
```
