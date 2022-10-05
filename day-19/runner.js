const AttrTokenizer = require("../day-18/attrStr-tokenizer");
const pluginManager = require("./pluginManager");
const bfs = require("./bfs");

const plugin = () => ({
  visitor: {
    ALL(node) {
      // 所有類型的 node 都會進入此函式處理
      if (node.type !== 'text' && node.attrStr) {
        node.attrs = new AttrTokenizer(node.attrStr).tokenize();
      }
    },
    text(node) {
      // 只有 type = "text" 的 node 會進入此函式處理
      console.log('text node=', node.content);
    }
  }
});

pluginManager.add(plugin);

const ast = require("./ast.json");
const newAST = bfs(ast);
console.log('newAST=', JSON.stringify(newAST, null, 2));
