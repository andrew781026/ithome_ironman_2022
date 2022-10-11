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

var readable = fs.createReadStream("./src/app.scss", {
  encoding: 'utf8',
  fd: null,
});
readable.on('readable', function() {
  var chunk;
  while (null !== (chunk = readable.read(1) /* here */)) {
    console.log(chunk); // chunk is one byte
  }
});

module.exports = Reader;
