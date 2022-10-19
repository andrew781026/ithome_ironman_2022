# [Day27] - 語法分析（syntactic analysis）

## 前言

之前 [Day-01] ~ [Day-25] - 我們展示了 詞法分析（Lexical analysis）- 利用狀態機產生 Tokens

然後利用 Parser 將 Tokens 轉換成 AST

![html-lexical-parse](https://raw.githubusercontent.com/andrew781026/ithome_ironman_2022/main/day-27/html-lexical-parse.png)

今天我們來說明一種解析方式 - 語法分析（syntactic analysis）。

## 語法分析（syntactic analysis）

> 來自 WIKI
```
語法分析（英語：syntactic analysis，也叫 parsing）
是根據某種給定的形式文法對由單詞序列（如英語單詞序列）構成的輸入文字進行分析並確定其語法結構的一種過程。

語法剖析器（parser）通常是作為編譯器或直譯器的組件出現的，
它的作用是進行語法檢查、並構建由輸入的單詞組成的資料結構（一般是語法分析樹、抽象語法樹等層次化的資料結構）。
語法剖析器通常使用一個獨立的詞法剖析器從輸入字元流中分離出一個個的「單詞」，
並將單詞流作為其輸入。實際開發中，語法剖析器可以手工編寫，也可以使用工具（半）自動生成。
```

其實在 [day-14] 的過程中，我們就是自己手動建立 語法剖析器（parser）並將 TokenList 手動轉換成 AST。

當然，我們也可以使用工具 -  `Lezer.js` 自動生成 語法剖析器（parser）。

不過當我們要使用工具自動生成時，我們需要先定義文法（grammar）。

## 文法（grammar）

用於描述字串的一套產生規則。下面舉幾個範例：

如果我們想要表示 (5+7) 這種字串的文法：

> Grammar_01
```
<number> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
<sign> ::= "+" | "-"
<expression> ::= "(" <number> <sign> <number> ")"
<more-expression> ::= "(" <expression> <sign> <number> ")"
```

- `<number>` 定義數字可以是 0 ~ 9 的任意值
- `<sign>` 定義符號可以是 + 或 -
- `<expression>` 定義 expression 可接受 (5+7) . (6-2) 這類的文字格式
- `<more-expression>` 定義 more-expression 可接受 ((5+7)-8) . ((6-2)+7) 這類的文字格式，不過 (9-(5+7)) 就不符合格式

因此在 Grammar_01 中 `(5+7)` . `((5+7)+6)` 是合法的，但是 `(5+7+9)` 就不合法。

這些 Grammar 的定義方式大多跟前後文沒有關係，因此也常被稱為 `上下文無關文法(Context-Free Grammar)`。

----

明天說明一下要如何在 `Lezer.js` 中按照 Lezer 的規則定義 Grammar_01 的文法。

### 參考資料

- [@lezer/generator](https://github.com/lezer-parser/generator)
- [Context-Free Grammar Introduction](https://www.tutorialspoint.com/automata_theory/context_free_grammar_introduction.htm) 
- [WIKI - 上下文無關文法](https://zh.wikipedia.org/wiki/%E4%B8%8A%E4%B8%8B%E6%96%87%E6%97%A0%E5%85%B3%E6%96%87%E6%B3%95)
- [15. LR Parsing](https://www.youtube.com/watch?v=8UDWd-Axd5A&ab_channel=NicolasLaurent)
