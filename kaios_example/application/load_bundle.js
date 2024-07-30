
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

window.onerror = function(msg, url, lineNo, columnNo, error){
    url = url.replace(/^(app:\/\/tic-tac-toe\.birh\.burh)\//,"");
    console.log(`WINDOW ERROR: kaios_example/application/${url}:${lineNo}:${columnNo}: ${msg}, ${error}!`);
}

const a = performance.now();
var script = document.createElement('script');
script.defer = true;
script.onload = function () {
    const b = performance.now();
    console.log(`bundle.js LOADED: ${b - a}`);
};
script.onerror = function (err) {
const a = performance.now();
    const b = performance.now();
    console.log(`bundle.js NOT LOADED ${err}: ${b - a}`);
};
script.src = "bundle.js";

document.head.appendChild(script); //or something of the likes
