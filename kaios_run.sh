#!/bin/bash

# /Applications/Waterfox\ Classic.app/Contents/MacOS/waterfox -chrome chrome://webide/content/webide.xul

set -e

# weird solution but it uses right miniquad after that
# rm -f Cargo.lock

# based on this
# https://doc.rust-lang.org/cargo/guide/cargo-home.html
CARGO_HOME=${CARGO_HOME:-$HOME/.cargo/}
miniquad_parts=$(cargo tree -p miniquad -f '{p}' 2>/dev/null | head -1)
miniquad_parts=( $(echo $miniquad_parts | cut -d' ' -f2-3 | sed 's/(.*#\(.*\))/\1/') )
miniquad_hash=${miniquad_parts[1]}
miniquad_ver=${miniquad_parts[0]##*v}

status=0
ls -1 $CARGO_HOME/git/db | grep miniquad -q || status=$?
if [ $status -eq 0 ]; then
    for dir in $CARGO_HOME/git/db/miniquad*; do
        hash=$(cat $dir/FETCH_HEAD | cut -f 1)
        if [[ $hash =~ ^"$miniquad_hash" ]]; then
            dir_hash=$(basename $dir | cut -d'-' -f2)
            for dir in $CARGO_HOME/git/checkouts/miniquad-$dir_hash/*; do
                subdir_hash=$(basename $dir)
                if [[ $miniquad_hash =~ ^"$subdir_hash" ]]; then
                    miniquad_path=$CARGO_HOME/git/checkouts/miniquad-$dir_hash/$subdir_hash
                fi
            done
        fi
    done
fi

status=0
ls -1 $CARGO_HOME/registry/src/*/* | grep miniquad -q || status=$?
if [ -z "$miniquad_path" ] && [ $status -eq 0 ]; then
    for dir in $CARGO_HOME/registry/src/*/miniquad*; do
        ver=$(basename $dir | cut -d'-' -f 2)
        if [[ $ver == $miniquad_ver ]]; then
            miniquad_path=$dir
        fi
    done
fi

echo Path to gl.js: ${miniquad_path:-../miniquad}/js/gl.js
ls ${miniquad_path:-../miniquad}/js/gl.js
cat ${miniquad_path:-../miniquad}/js/gl.js > kaios_example/mq_js_bundle.js
uglifyjs -b <kaios_example/mq_js_bundle.js >kaios_example/mq_js_bundle.js.new && mv kaios_example/mq_js_bundle.js.new kaios_example/mq_js_bundle.js

cargo build --target=wasm32-unknown-unknown --release
# install binaryen's wasm2js (or just build it and add to PATH)
# wasm2js -Oz target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm -o kaios_example/maq_tic_tac_toe.js
# wasm2js --emscripten -Oz target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm -o kaios_example/application/maq_tic_tac_toe.js

wasm2wat target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm -o kaios_example/maq_tic_tac_toe.wat
cp target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm kaios_example/application

wat2wasm kaios_example/itoa.wat -o kaios_example/itoa.wasm
wasm2wat kaios_example/itoa.wasm -o kaios_example/itoa.out.wat
# wasm2js -Oz kaios_example/itoa.wasm -o kaios_example/itoa.js
cp kaios_example/itoa.wasm kaios_example/application

pushd kaios_example
npm install
npm run build
popd

du -h target/wasm32-unknown-unknown/release/maq_tic_tac_toe.wasm
du -h kaios_example/application/bundle.js
du -h kaios_example/application/itoa.wasm

# basic-http-server kaios_example/application
# exit

name=$(sed <kaios_example/application/manifest.webapp -n 's/.*"name": "\(.*\)",/\1/p')
id=$(sed <kaios_example/application/manifest.webapp -n 's/.*"origin": "app:\/\/\(.*\)",/\1/p')
type=$(sed <kaios_example/application/manifest.webapp -n 's/.*"type": "\(.*\)",/\1/p')
echo $name
echo $id
echo $type

if [ "$type" != "certified" ]; then
    line=$(gdeploy list | grep "$name" || true)
    if [ "$line" != "" ]; then
        id=$(echo $line | cut -d' ' -f3 | sed 's/app:\/\/\(.*\)\/manifest.webapp/\1/')
    fi
fi

echo $id
echo $type
gdeploy stop "$id" 2>/dev/null || true

gdeploy uninstall $id 2>/dev/null || true
install_res=$(gdeploy install kaios_example/application)
echo $id
echo "$install_res"
if [ "$type" != "certified" ]; then
    id=$(echo "$install_res" | tail -1 | cut -d' ' -f2)
fi

echo $id
echo $(date '+%Y-%m-%d %H:%M:%S')
gdeploy start $id
repeats=0
while true; do
    readed=$(gdeploy evaluate $id "window.MyLogs.read()")
    lines="$(echo -n "$readed" | tail -n +3 | sed "s/Script run in the $id app context evaluated to: //")"

    if [ $(echo -n "$lines" | wc -l) -eq 0 ] && [ "$lines" == "" ]; then
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
