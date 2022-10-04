const transformer = require("./transformer");

const logger = node => {
  if (node.type === 'text')
    console.log('currentNode=', node.content)
  else
    console.log('currentNode=', node.type)
};

function dfs(ast) {
  // 當前節點，第一次進入時 ast 也就是 ROOT 節點
  const currentNode = ast;

  //  console.log 當前節點
  // logger(currentNode);

  //  transformer
  transformer(currentNode);

  if (currentNode.children?.length > 0) {
    // 如果當前節點有 child node，就遞迴走訪
    for (const childNode of currentNode.children) {
      dfs(childNode);
    }
  }

  return currentNode;
}

const ast = require("./ast.json");
// dfs(ast);

module.exports = dfs;
