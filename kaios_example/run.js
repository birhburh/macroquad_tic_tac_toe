import * as maq_tic_tac_toe from './maq_tic_tac_toe';
import * as mq_js_bundle from './mq_js_bundle.js';

console.log("RUNNING run.js!");
console.log("LOADED!");
try {
    mq_js_bundle.register_plugins(mq_js_bundle.plugins);
    var crate_version = maq_tic_tac_toe.crate_version();
    if (mq_js_bundle.version != crate_version) {
        console.error("Version mismatch: gl.js version is: " + mq_js_bundle.version +
                      ", rust sapp-wasm crate version is: " + crate_version);
    }
    mq_js_bundle.init_plugins(mq_js_bundle.plugins);
    maq_tic_tac_toe.main();
} catch (error) {
    console.log(`ERROR: ${error}`);
}
