#!/bin/bash

set -e
./asmjs_build.sh

pushd kaios_example
npm install
npm run build
popd

cat >> kaios_example/mq_js_bundle.js.new <<- EOM
    window.MyLogs += "RUNNED mq_js_bundle.js!\n";
EOM

cat >> wasm2js_example/mq_js_bundle.js <<- EOM
    load_asmjs = function() {
        var cached_function = load_asmjs;

        return function() {
            window.MyLogs += "RUNNED load_asmjs!\n";
            var result = cached_function.apply(this, arguments);

            return result;
        };
    }
EOM
uglifyjs -b <kaios_example/mq_js_bundle.js >>kaios_example/mq_js_bundle.js.new
mv kaios_example/mq_js_bundle.js.new kaios_example/mq_js_bundle.js

# exit

gdeploy install kaios_example
gdeploy stop helloworld.birh.burh
gdeploy start helloworld.birh.burh
gdeploy evaluate helloworld.birh.burh "window.MyLogs"
