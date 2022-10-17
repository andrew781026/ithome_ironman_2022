import {EditorView,basicSetup} from "codemirror"
import {MyLang} from "../dist/myLang.js"

let editor = new EditorView({
  doc: "{\n{\n4545\n}5545\n}",
  extensions: [
    basicSetup,
    MyLang(),
  ],
  parent: document.body
})
