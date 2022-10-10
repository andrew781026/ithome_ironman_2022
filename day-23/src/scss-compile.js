const sass = require('sass');

const result = sass.compile("src/app.scss");
console.log(result.css);

const compressed = sass.compile("src/app.scss", {style: "compressed"});
console.log(compressed.css);
