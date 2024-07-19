import * as maq_tic_tac_toe from './maq_tic_tac_toe';
import * as mq_js_bundle from './mq_js_bundle.js';

window.MyLogs = {
    queue: [],
    write(value) {
        this.queue.push(value);
    },
    read() {
        var res = this.queue.join('\n');
        this.queue = [];
        return res;
    },
};

function handle_log(oldCons, orig_func, title, text) {
    var err = new Error();
    var text = err.stack.split('\n')[2].split('/').slice(-1) + ": " + text;
    orig_func.bind(oldCons)(text);
    window.MyLogs.write(title + ": " + text);
}

var console=(function(oldCons){
return {
    debug: function(text){
        handle_log(oldCons, oldCons.debug, "DEBUG", text);
    },
    log: function(text){
        handle_log(oldCons, oldCons.log, "LOG", text);
    },
    info: function (text) {
        handle_log(oldCons, oldCons.info, "INFO", text);
    },
    warn: function (text) {
        handle_log(oldCons, oldCons.warn, "WARN", text);
    },
    error: function (text) {
        handle_log(oldCons, oldCons.error, "ERROR", text);
    },
    assert: function(val, text){
        handle_log(oldCons, oldCons.assert, "ASSERT", text);
    },
};
}(window.console));
window.console = console;

window.alert = function(text) {
    console.log("ALERT: " + text);
};

console.log("RUNNING run.js!");

window.onerror = function(msg, url, lineNo, columnNo, error){
    url = url.replace(/^(app:\/\/helloworld\.birh\.burh)\//,"");
    console.log(`WINDOW ERROR: kaios_example/${url}:${lineNo}:${columnNo}: ${msg}, ${error}!`);
}

console.log("LOADED!");
try {
    mq_js_bundle.register_plugins(mq_js_bundle.plugins);
    wasm_memory = maq_tic_tac_toe.memory;
    wasm_exports = maq_tic_tac_toe;
    var crate_version = wasm_exports.crate_version();
    if (mq_js_bundle.version != crate_version) {
        console.error("Version mismatch: gl.js version is: " + mq_js_bundle.version +
                      ", rust sapp-wasm crate version is: " + crate_version);
    }
    mq_js_bundle.init_plugins(mq_js_bundle.plugins);
    maq_tic_tac_toe.main();
} catch (error) {
    console.log(`ERROR: ${error}`);
}
