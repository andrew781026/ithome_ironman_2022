const pluginManager = require("./pluginManager");
const dfs = require("./dfs");

const renderPlugin = selector => () => ({
  visitor: {
    ALL(node) {
      // 所有類型的 node 都會進入此函式處理

      if (node.type === 'root') {
        const root = document.querySelector(selector);
        node.element = root;
        node.children.forEach(child => child.parentElement = root);
      }
      else if (node.type === 'text') {
        const textNode = document.createTextNode(node.content);
        node.parentElement.appendChild(textNode);
      }
      else {
        const element = document.createElement(node.type);

        // 追加屬性
        node.attrs?.forEach(attr => element.setAttribute(attr.name, attr.value));

        // 提示父元素
        node.children.forEach(child => child.parentElement = node.element);

        // 將 element 附加到父元素上
        node.parentElement?.appendChild(element);
      }
    },
  }
});

pluginManager.add(renderPlugin('body'));

const ast = require("./ast.json");
const newAST = bfs(ast);
console.log('newAST=', JSON.stringify(newAST, null, 2));
