#!/bin/bash

set -e

./asmjs_build.sh
basic-http-server wasm2js_example