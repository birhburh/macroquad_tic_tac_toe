function load_asmjs(path) {
    function log_error(str)
    {
        if (window.console) {
            console.error(str);
        }
        else {
            str += "\n";
            window.MyLogs += str;
        }
    }

    window.MyLogs += "load_asmjs: BEGIN!\n";
    register_plugins(plugins);

    window.MyLogs += "load_asmjs: AFTER register_plugins!\n";
    import(path)
        .then(function (obj) {
            window.MyLogs += "load_asmjs: IN then!\n";
            wasm_memory = obj.memory;
            wasm_exports = obj;

            var crate_version = wasm_exports.crate_version();
            window.MyLogs += "load_asmjs: AFTER crate_version!\n";
            if (version != crate_version) {
                log_error("Version mismatch: gl.js version is: " + version +
                          ", rust sapp-wasm crate version is: " + crate_version)
            }
            init_plugins(plugins);
            window.MyLogs += "load_asmjs: AFTER init_plugins!\n";
            obj.main();
            window.MyLogs += "load_asmjs: AFTER main()!\n";
        })
        .catch(err => {
            log_error("WASM failed to load, probably incompatible gl.js version");
            log_error(err);
        });
    window.MyLogs += "load_asmjs: END!\n";
}