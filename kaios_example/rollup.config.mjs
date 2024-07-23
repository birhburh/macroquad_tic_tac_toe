import legacy from '@rollup/plugin-legacy';
import { babel } from '@rollup/plugin-babel';
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
          register_plugins: 'register_plugins',
          init_plugins: 'init_plugins',
          version: 'version',
          plugins: 'plugins',
        }
      }),
      {
        transform ( code, id ) {
          if (id.includes("mq_js_bundle.js")) {
            code = code.replace(/var wasm_memory;/, "import {memory as wasm_memory} from './maq_tic_tac_toe';");
            code = code.replace(/var wasm_exports;/, "import * as wasm_exports from './maq_tic_tac_toe';");
            code = code.replaceAll(/wasm_memory = [^\n]*;/g, "");
            code = code.replaceAll(/wasm_exports = [^\n]*;/g, "");
            code = code.replace(/"webgl"/, '"experimental-webgl"');
            code = "console.log(\"RUNNING mq_js_bundle.js!\");" + code;
            return code;
          } else if (id.includes("maq_tic_tac_toe.js")) {
            code = code.replace(/^import \* as env from 'env'/, 'import env from \'./mq_js_bundle.js\'');
            return code;
          }
        }
      },
      babel({ babelHelpers: 'bundled' }),
      terser({
        toplevel: true,
        mangle: {
          properties: {
            reserved: ['createVertexArrayOES', 'deleteVertexArrayOES', 'bindVertexArrayOES', 'isVertexArrayOES']
          }
        },
        output: {
          // beautify: true
        }
      })

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