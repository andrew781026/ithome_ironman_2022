const pluginManager = require("./pluginManager");

const transformer = node => {
  const plugins = pluginManager.get();

  for (const plugin of plugins) {
    const {visitor} = plugin();
    const {ALL: allHandler, [node.type]: typeHandler} = visitor;

    // 先執行 ALL 通用的處理函式
    allHandler && allHandler(node);

    // 再執行對應 type 的處理函式
    typeHandler && typeHandler(node);
  }

  return node;
};

module.exports = transformer;
