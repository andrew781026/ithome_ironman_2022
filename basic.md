# BABEL 到底如何做 Compiler

可以參考 [the-super-tiny-compile](https://github.com/jamiebuilds/the-super-tiny-compiler) 來做學習

切分的步驟有 

```javascript
/**
 * FINALLY! We'll create our `compiler` function. Here we will link together
 * every part of the pipeline.
 *
 *   1. input  => tokenizer   => tokens
 *   2. tokens => parser      => ast
 *   3. ast    => transformer => newAst
 *   4. newAst => generator   => output
 */
function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  // and simply return the output!
  return output;
}
```

- [astexplorer](https://astexplorer.net/#/KJ8AjD6maa)
- [codemirror](https://codemirror.net/try/?example=Markdown%20code%20block%20highlighting)
