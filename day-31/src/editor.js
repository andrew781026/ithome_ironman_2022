import {EditorView,basicSetup} from "codemirror"
import {MyLang} from "../dist/myLang.js"

const initStr = `.btn{
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  border: 2px solid transparent;

  &:hover{
    border-color: #98c1fe;
  }
}`;

let editor = new EditorView({
  doc: initStr,
  extensions: [
    basicSetup,
    MyLang(),
  ],
  parent: document.body
})
