# [Day25] - SCSS Reader - 檔案 & 位置資訊保留

## 前言

昨天我們提到了 source map 的概念。

在產生 source map 的時候，我們需要知道目前在原始檔案的位置，以及在哪個原始檔案中。

那我們就不可能用 `charList = originStr.split('');` 這種方式來處理，因為它不會記錄 位置 & 檔案的相關資訊。

我們可以使用 `fs.read`，來處理檔案，來記錄目前處理到的位置之資訊 & 目前處理的檔案。

```js
const fs = require('fs');

class Reader {

  file = null;
  filePath = '';
  position = {
    col: 0,
    row: 0,
    index: 0
  }

  constructor(filePath) {
    this.filePath = filePath;
    this.file = fs.openSync(filePath, 'r');
  }

  close() {
    fs.closeSync(this.file);
  }

  async read(position, size = 1) {

    return new Promise((resolve, reject) => {

      // only need to store one byte (one character)
      const b = Buffer.alloc(size);

      fs.read(this.file, b, 0, size, position.index, function (err, bytesRead, buffer) {
        if (err) reject(new Error('at [row:col]=' + `[${position.row}:${position.col}] Reader error=` + err.message));
        else resolve(buffer.toString('utf8', 0, bytesRead));
      });
    });
  }

  next() {
    const position = this.position;
    return this.read(position)
      .then(char => {
        // 遇到換行符號 , 行數 + 1
        if (char === '\n') {
          position.row++;
          position.col = 0;
        } else {
          position.col++;
        }
        return char;
      });
  }

  lookahead(size = 1) {
    return this.read(this.position, size);
  }
}

module.exports = Reader;
```

### 參考資料

- [Read a file one character at a time in node.js?](https://stackoverflow.com/questions/30096691/read-a-file-one-character-at-a-time-in-node-js) 
