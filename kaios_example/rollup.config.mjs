import legacy from '@rollup/plugin-legacy';
import { babel } from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
    input: 'run.js',
    output: {
      format: "iife",
      file: "application/bundle.js",
      intro: "var wasm_memory; var wasm_exports;"
    },
    plugins: [
      legacy({
        './mq_js_bundle.js': {
          default: 'importObject.env',
          register_plugins: 'register_plugins',
          init_plugins: 'init_plugins',
          version: 'version',
          plugins: 'plugins',
        }
      }),
      {
        transform ( code, id ) {
          if (id.includes("maq_tic_tac_toe.js")) {
            code = code.replace(/^import \* as env from 'env'/, 'import env from \'./mq_js_bundle.js\'');
            return code;
          }
        }
      },
      {
        transform ( code, id ) {
          if (id.includes("mq_js_bundle.js")) {
            code = code.replace(/var wasm_memory;/, '');
            code = code.replace(/var wasm_exports;/, '');
            code = code.replace(/"webgl"/, '"experimental-webgl"');
            code = "console.log(\"RUNNING mq_js_bundle.js!\");" + code;
            return code;
          }
        }
      },
      babel({ babelHelpers: 'bundled' }),
      terser(),

      // {
      //   transform ( code, id ) {
      //     if (id.includes("mq_js_bundle.js")) {
      //       console.log( id );
      //       console.log( code );
      //     }
      //   }
      // },
    ]
  };