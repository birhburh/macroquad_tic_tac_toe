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
sed 's/^export var \([^ ]*\) /exports\.\1 /' <kaios_example/maq_tic_tac_toe.wasm.js | uglifyjs >>kaios_example/maq_tic_tac_toe.wasm.js.new
cat >>kaios_example/maq_tic_tac_toe.wasm.js.new <<- EOM
    });
EOM
mv kaios_example/maq_tic_tac_toe.wasm.js.new kaios_example/maq_tic_tac_toe.wasm.js

du -h target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm
du -h kaios_example/maq_tic_tac_toe.wasm.js

# basic-http-server kaios_example
# exit

id=$(sed <kaios_example/manifest.webapp -n 's/.*"origin": "app:\/\/\(.*\)",/\1/p')

gdeploy stop $id 2>/dev/null || true

gdeploy uninstall $id 2>/dev/null || true
gdeploy install kaios_example

echo $id
gdeploy start $id
repeats=0
while true; do
    readed=$(gdeploy evaluate $id "window.MyLogs.read()")
    lines="$(echo -n "$readed" | tail -n +3 | sed "s/Script run in the $id app context evaluated to: //")"

    if [ $(echo -n "$lines" | wc -l) -eq 0 ]; then
        sleep 0.1
        (( repeats++ ))
        if [ $repeats -eq 30 ]; then
            echo "Oh dear..."
        fi
        if [ $repeats -gt 50 ]; then
            echo "Now you've done it"
            break
        fi
    else
        repeats=0

        echo "$lines" | while IFS= read -r line ; do
            echo $(date '+%Y-%m-%d %H:%M:%S') $line
        done
    fi
done
