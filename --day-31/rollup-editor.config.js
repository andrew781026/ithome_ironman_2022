import {nodeResolve} from "@rollup/plugin-node-resolve"

export default {
  input: "./src/editor.js",
  output: {
    file: "./output/editor.bundle.js",
    format: "iife"
  },
  plugins: [nodeResolve()]
}
