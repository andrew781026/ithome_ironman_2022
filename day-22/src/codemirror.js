import {EditorState} from "@codemirror/state"
import {defaultKeymap, historyKeymap, history, undo, redo} from "@codemirror/commands"
import {drawSelection, keymap, lineNumbers} from "@codemirror/view"

let startState = EditorState.create({
  doc: "The document\nis\nshared",
  extensions: [
    history(),
    drawSelection(),
    lineNumbers(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
    ])
  ]
})


let otherState = EditorState.create({
  doc: startState.doc,
  extensions: [
    drawSelection(),
    lineNumbers(),
    keymap.of([
      ...defaultKeymap,
      {key: "Mod-z", run: () => undo(mainView)},
      {key: "Mod-y", mac: "Mod-Shift-z", run: () => redo(mainView)}
    ])
  ]
})
