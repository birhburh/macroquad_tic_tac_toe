#!/bin/bash
# based on https://macroquad.rs/articles/ios/
set -e
cargo build --target x86_64-apple-ios --release
cp target/x86_64-apple-ios/release/maq_tic_tac_toe MaqTicTacToe.app
# only once, to get the emulator running
IPHONE_8_INFO=( $(xcrun simctl list | grep " iPhone 8" | tr -s ' ' | sed 's/[^(]* (\([^(]*\)).*(\(.*\))/\1 \2/') )
if [ "${IPHONE_8_INFO[1]}" != "Booted" ]; then
    xcrun simctl boot "${IPHONE_8_INFO[0]}"
fi
xcrun simctl install booted MaqTicTacToe.app
xcrun simctl launch booted com.maq_tic_tac_toe
# open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/
# xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "maq_tic_tac_toe"' --style compact
# xcrun simctl spawn booted log stream --predicate 'processImagePath endswith "maq_tic_tac_toe" and eventMessage contains "WOW"' --style compact