import {lezer} from "@lezer/generator/rollup"

export default {
  input: "src/index.js",
  external: id => id != "tslib" && !/^(\.?\/|\w:)/.test(id),
  output: [
    {dir: "./dist", format: "es"}
  ],
  plugins: [lezer()]
}
