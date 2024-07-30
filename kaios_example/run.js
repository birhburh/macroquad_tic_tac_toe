import * as polywasm from 'polywasm';
import * as mq_js_bundle from './mq_js_bundle.js';

globalThis.WebAssembly = polywasm.WebAssembly;

var wasm_exports;
var wasm_memory;

// extract_string extracts a string from a wasm memory buffer, given the
// memory object, and offset and the length of the string. Returns a newly
// allocated JS string.
function extract_string(mem, offset, len) {
    const buf = new Uint8Array(mem, offset, len);
    return new TextDecoder('utf8').decode(buf);
}

console.log("RUNNING run.js!");
console.log("LOADED!");
try {
    // mq_js_bundle.load('./maq_tic_tac_toe.wasm');

    var req = fetch('./itoa.wasm');
    req.then(function(x) {
        return x.arrayBuffer();
    }).then(function(bytes) {
        return WebAssembly.compile(bytes);
    }).then(function(obj) {
        var importObject = {
            env: {
                log: function (offset, length) {
                    var bytes = new Uint8Array(wasm_memory.buffer, offset, length);
                    var string = new TextDecoder('utf8').decode(bytes);
                    console.log(string);
                }
            }
        };
        return WebAssembly.instantiate(obj, importObject);
    }).then(function(obj) {
        wasm_memory = obj.exports.memory;
        wasm_exports = obj.exports;

        let to_string = (n) => {
            let [ptr, len] = obj.exports.itoa(n);
            console.log([ptr, len]);
            return extract_string(wasm_memory.buffer, ptr, len);
        }
        console.log(`ITOA: 10 -> ${to_string(10)}`);
        console.log(`ITOA: 1579 -> ${to_string(1579)}`);
        console.log(`ITOA: 1367 -> ${to_string(1367)}`);
    }).catch(err => {
        console.error("WASM failed to load");
        console.error(err);
    });
} catch (error) {
    console.log(`ERROR: ${error}`);
}
