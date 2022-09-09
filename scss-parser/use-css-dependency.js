const css = require('css');
const obj = css.parse('body { font-size: 12px; }' , { sourcemap: true });
const cssStr = css.stringify(obj, { sourcemap: true });

console.log('obj=',obj);
console.log('cssStr=',cssStr);
