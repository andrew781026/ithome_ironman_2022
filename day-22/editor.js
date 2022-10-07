import {EditorView, basicSetup} from "codemirror"
import {javascript} from "@codemirror/lang-javascript"
import {html} from "@codemirror/lang-html"

let editor = new EditorView({
  extensions: [
    basicSetup,
    // javascript(),
    html(),
  ],
  parent: document.body
})
