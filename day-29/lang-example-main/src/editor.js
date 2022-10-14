import {EditorView,basicSetup} from "codemirror"
import {MyLang} from "../dist/myLang.js"

let editor = new EditorView({
  doc: "(((8+9)+10)-20)", // ((((((((a=10))))))))
  extensions: [
    basicSetup,
    MyLang(),
  ],
  parent: document.body
})
