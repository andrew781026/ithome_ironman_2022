import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"

let editor = new EditorView({
  doc: "The document\nis\nshared",
  extensions: [
    basicSetup,
    // javascript(),
    html(),
  ],
  parent: document.body
})
