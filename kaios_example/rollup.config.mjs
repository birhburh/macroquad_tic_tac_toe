import legacy from '@rollup/plugin-legacy';

export default {
    input: 'run.js',
    output: {
      format: "iife",
      file: "bundle.js",
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
            return code;
          }
        }
      },
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