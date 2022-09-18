# 如何製作 Markdown 的 parser ?

相關套件

- [marked](https://github.com/markedjs/marked)

上述的套件需要加上 DOMPurify 來防止 XSS 攻擊的 CODE

```javascript
DOMPurify.sanitize(marked.parse(`<img src="x" onerror="alert('not happening')">`));
```
