function load_asmjs(path) {
    console.log("load_asmjs: BEGIN!");
    register_plugins(plugins);

    console.log("load_asmjs: AFTER register_plugins!");
    import(path)
        .then(function (obj) {
            console.log("load_asmjs: IN then!");
            wasm_memory = obj.memory;
            wasm_exports = obj;

            var crate_version = wasm_exports.crate_version();
            console.log("load_asmjs: AFTER crate_version!");
            if (version != crate_version) {
                console.error("Version mismatch: gl.js version is: " + version +
                              ", rust sapp-wasm crate version is: " + crate_version);
            }
            init_plugins(plugins);
            console.log(`load_asmjs: AFTER init_plugins!: main?`);
            obj.main();
            console.log("load_asmjs: AFTER main()!");
        })
        .catch(err => {
            console.error("WASM failed to load, probably incompatible gl.js version");
            console.error(err);
        });
    console.log("load_asmjs: END!");
}