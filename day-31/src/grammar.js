import {parser} from "./lang.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const MyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Program: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Program: foldInside
      }),
      styleTags({
        Number: t.number,
        "( )": t.paren
      })
    ]
  })
})

export function MyLang() {
  return new LanguageSupport(MyLanguage)
}
