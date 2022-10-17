import {lezer} from "@lezer/generator"

export default {
  input: "src/grammar.js",
  external: id => id != "tslib" && !/^(\.?\/|\w:)/.test(id),
  output: [
    {file: "./dist/myLang.js", format: "es"}
  ],
  plugins: [lezer()]
}
