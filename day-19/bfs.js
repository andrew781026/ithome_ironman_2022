const transformer = require("./transformer");

const logger = node => {
  if (node.type === 'text')
    console.log('currentNode=', node.content)
  else
    console.log('currentNode=', node.type)
};

function bfs(ast) {
  // 當前節點，第一次進入時 ast 也就是 ROOT 節點
  const currentNode = ast;
  const stack = [currentNode];

  while (stack.length > 0) {
    // 取出 stack 的第一個節點
    const currentNode = stack.shift();

    //  console.log 當前節點
    // logger(currentNode);

    //  transformer
    transformer(currentNode);

    if (currentNode.children?.length > 0) {
      // 如果當前節點有 child node，就把 child node 放入 stack
      for (const childNode of currentNode.children) {
        stack.push(childNode);
      }
    }
  }

  return currentNode;
}

const ast = require("./ast.json");
// bfs(ast);

module.exports = bfs;
