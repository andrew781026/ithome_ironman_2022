import {EditorView,basicSetup} from "codemirror"
import {EXAMPLE} from "../dist"

let editor = new EditorView({
  doc: "The document\nis\nshared",
  extensions: [
    basicSetup,
    EXAMPLE(),
  ],
  parent: document.body
})
