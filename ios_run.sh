#!/bin/bash
# based on https://macroquad.rs/articles/ios/
set -e
cargo build --target x86_64-apple-ios --release
cp target/x86_64-apple-ios/release/maq_tic_tac_toe MaqTicTacToe.app
# MODEL="iPhone 14"
MODEL="iPad (10th generation)"
# only once, to get the emulator running
SIMULATOR_INFO=( $(xcrun simctl list | grep " $MODEL (" | awk '{gsub(/[()]/, "", $(NF-1)); gsub(/[()]/, "", $NF); print $(NF-1)" "$NF}') )
echo "${SIMULATOR_INFO[@]}"
if [ "${SIMULATOR_INFO[1]}" != "Booted" ]; then
    xcrun simctl boot "${SIMULATOR_INFO[0]}"
fi
xcrun simctl install booted MaqTicTacToe.app
xcrun simctl launch booted com.maq_tic_tac_toe
open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/
# xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "maq_tic_tac_toe"' --style compact
# xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "maq_tic_tac_toe" and eventMessage contains "WOW"' --style compact