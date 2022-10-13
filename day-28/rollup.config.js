import {lezer} from "@lezer/generator/rollup"

export default {
  input: "./in.js",
  output: {file: "out.js", format: "cjs"},
  plugins: [lezer()]
}
