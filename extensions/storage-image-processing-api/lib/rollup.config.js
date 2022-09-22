import typescript from "rollup-plugin-typescript2";
import copy from 'rollup-plugin-copy'

export default {
  input: "./src/index.ts",
  output: [
    {
      file: "./dist/bundle.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/bundle.es.js",
      format: "es",
    },
  ],
  plugins: [typescript(), copy({
    targets: [
      { src: 'src/types', dest: 'dist' },
    ]
  })],
};