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

var console=(function(oldCons){
return {
    debug: function(text){
        oldCons.log(text);
        window.MyLogs.write("DEBUG: " + text);
    },
    log: function(text){
        oldCons.log(text);
        window.MyLogs.write("LOG: " + text);
    },
    info: function (text) {
        oldCons.info(text);
        window.MyLogs.write("INFO: " + text);
    },
    warn: function (text) {
        oldCons.warn(text);
        window.MyLogs.write("WARN: " + text);
    },
    error: function (text) {
        oldCons.error(text);
        window.MyLogs.write("ERROR: " + text);
    },
    assert: function(val, text){
        window.MyLogs.write(`ASSERT: ${val}: ${text}`);
        oldCons.assert(val, text);
    },
};
}(window.console));
window.console = console;

window.alert = function(text) {
    console.log("ALERT: " + text);
};

console.log("\n");
console.log("RUNNING create_log.js!");

var script = document.createElement('script');
script.src = "require.js";
script.dataset.main = "./run";

script.onerror = function(ev){
    console.log(`ERROR: ${ev}!`);
}

document.getElementsByTagName('head')[0].appendChild(script);
