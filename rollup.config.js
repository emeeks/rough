import babel from "rollup-plugin-babel"

export default {
  input: "src/index.js",
  output: {
    format: "iife",
    name: "rough",
    file: "dist/rough.js",
    sourcemap: "inline"
  },
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: "node_modules/**"
    })
  ]
}
