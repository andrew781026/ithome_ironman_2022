import {parser} from "./lang.grammar"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

export const MyLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        // 縮進策略 (Indentation strategy) - 用於縮排
        Application: context => context.column(context.node.from) + context.unit
      }),
      foldNodeProp.add({
        // 將可折疊區塊改成用 Application
        Application: foldInside
      }),
      styleTags({
        "; ,": t.separator,
        "{ }": t.brace
      })
    ]
  })
})

export function MyLang() {
  return new LanguageSupport(MyLanguage)
}
