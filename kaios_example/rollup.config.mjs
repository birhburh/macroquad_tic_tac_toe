import legacy from '@rollup/plugin-legacy';
import { babel } from '@rollup/plugin-babel';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';

export default {
    input: 'run.js',
    output: {
      format: "iife",
      file: "application/bundle.js"
    },
    plugins: [
      legacy({
        './mq_js_bundle.js': {
          default: 'importObject.env',
          load: 'load',
        }
      }),
      {
        transform ( code, id ) {
          if (id.includes("mq_js_bundle.js")) {
            code = code.replace(/"webgl"/, '"experimental-webgl"');
            code = "console.log(\"RUNNING mq_js_bundle.js!\");" + code;
            return code;
          }
        }
      },
      commonjs(),
      nodeResolve(),
      babel({ babelHelpers: 'bundled' }),

      terser({
        toplevel: true,
        mangle: true,
        output: {
          // beautify: true
        }
      }),




      // {
      //   transform ( code, id ) {
      //     console.log( id );
      //     if (id.includes("mq_js_bundle.js")) {
      //       // console.log( code );
      //     }
      //   }
      // },
    ]
  };