#!/bin/bash

set -e
./asmjs_build.sh

pushd kaios_example
npm install
npm run build
popd

cat >kaios_example/mq_js_bundle.js.new <<- EOM
    console.log("RUNNING mq_js_bundle.js!");
EOM
uglifyjs -b <kaios_example/mq_js_bundle.js | sed 's/"webgl"/"experimental-webgl"/' >>kaios_example/mq_js_bundle.js.new
cat <kaios_example/wrap_asmjs.js >>kaios_example/mq_js_bundle.js.new
mv kaios_example/mq_js_bundle.js.new kaios_example/mq_js_bundle.js

cat >kaios_example/maq_tic_tac_toe.wasm.js.new <<- EOM
    console.log("RUNNING maq_tic_tac_toe.wasm.js.new!");
    define(function(require, exports, module) {
        console.log("RUNNING INSIDE define!");
EOM
sed 's/^export var \([^ ]*\) /exports\.\1 /' <wasm2js_example/maq_tic_tac_toe.wasm.js | uglifyjs >>kaios_example/maq_tic_tac_toe.wasm.js.new
cat >>kaios_example/maq_tic_tac_toe.wasm.js.new <<- EOM
    });
EOM
mv kaios_example/maq_tic_tac_toe.wasm.js.new kaios_example/maq_tic_tac_toe.wasm.js

gdeploy stop tic-tac-toe.birh.burh

gdeploy uninstall tic-tac-toe.birh.burh
gdeploy install kaios_example

gdeploy start tic-tac-toe.birh.burh
repeats=0
while true; do
    line=$(gdeploy evaluate tic-tac-toe.birh.burh "window.MyLogs.read()" | tail -n +3 | sed 's/Script run in the tic-tac-toe.birh.burh app context evaluated to: //')
    if [ "$line" = '{ type: '\''undefined'\'' }' ]; then
        sleep 0.1
        (( repeats++ ))
        if [ $repeats -gt 100 ]; then
            break
        fi
    else
        repeats=0
        echo $line
    fi
done
