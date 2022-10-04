const parser = tokens => {

    const root = {type: 'root', children: []};
    const output_AST = root;
    const elementStack = [root];

    while (tokens.length > 0) {
        const token = tokens.shift();

        // 遇到 tagStart，node A 當作 elementStack 的最後一個元素的 children，並將 node A push elementStack
        if (token.type === 'tagStart') {
            const node = {type: token.name, attrStr: token.attrStr, children: []}; // node A
            elementStack[elementStack.length - 1].children.push(node); // node A 當作 elementStack 的最後一個元素的 children
            elementStack.push(node); // 並將 node A push elementStack
        }

        // 遇到 tagEnd，則 pop elementStack 的最後一個元素
        if (token.type === 'tagEnd') {
            elementStack.pop(); // pop elementStack 的最後一個元素
        }

        // 遇到 text，當作 elementStack 的最後一個元素的 children
        if (token.type === 'text') {
            const node = {type: 'text', content: token.content}; // text node
            elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
        }

        // 遇到 tagSelfClose，當作 elementStack 的最後一個元素的 children
        if (token.type === 'tagSelfClose') {
            const node = {type: token.name, attrStr: token.attrStr}; // tagSelfClose node
            elementStack[elementStack.length - 1].children.push(node); // 當作 elementStack 的最後一個元素的 children
        }
    }

    return output_AST;
};

module.exports = parser;
