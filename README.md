# Tic-Tac-Toe in [macroquad](https://github.com/not-fl3/macroquad)

Simple macroquad example of using `blocking_event_loop`

**!!! Currently not working: local paths in Cargo.toml**

![Example run](screenshot.png)

## Tested on platforms:
- OSX (Intel)
- WASM (using [cargo-webquad](https://github.com/not-fl3/cargo-webquad/tree/master))
- Android
- iOS (Metal/Opengl) (It looks really different with opengl with highdpi [on](highdpi_ios.png) and [off](not_highdpi_ios.png))
- Should work on Windows and `(GNU )?Linux( (X11|Wayland))?( (GTK|QT))?` (Not tested yet)
- KaiOs? (Now i make plain js run via `asmjs_run.sh`)

## TODO:
- Catched bug of `draw_circle_lines` it draws lines like it's sun (Added PR based on another PR, lucky)
- Add support for touch after `blocking_event_loop` is implemented for android and iOS (Added to macroquad localy, make PR)
- Clarify in iOS documentation that you need to use your package name instead `mygame` everywhere (probably `cargo-quad-ios` will be convenient) (Probably add log command from [here](https://macroquad.rs/articles/ios/#simulator-logs))