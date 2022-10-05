const transformer = () => {

  const appender = node => {

    console.log('node=', node);

    // ROOT 節點
    if (node.type === 'root') {
      const root = document.createElement('template');
      root.setAttribute('data-type', 'root');
      node.element = root;
      node.children?.forEach(child => child.parentElement = root);
    }

    // text 節點
    else if (node.type === 'text') {
      const textNode = document.createTextNode(node.content);
      node.parentElement.appendChild(textNode);
    }

    // element 節點
    else {
      const element = document.createElement(node.type);
      node.element = element;

      // 追加屬性
      node.attrs?.forEach(attr => element.setAttribute(attr.name, attr.value));

      // 提示父元素
      node.children?.forEach(child => child.parentElement = node.element);

      // 將 element 附加到父元素上
      node.parentElement?.appendChild(element);
    }

    return node;
  }

  return {
    appender,
  }
};

function dfs(ast, appender) {
  // 當前節點，第一次進入時 ast 也就是 ROOT 節點
  const currentNode = ast;

  // appender
  appender(currentNode);

  if (currentNode.children?.length > 0) {
    // 如果當前節點有 child node，就遞迴走訪
    for (const childNode of currentNode.children) {
      dfs(childNode, appender);
    }
  }

  return currentNode;
}

export function createRenderer() {
  const {appender} = transformer();
  return {
    render: ast => dfs(ast, appender),
  };
}
