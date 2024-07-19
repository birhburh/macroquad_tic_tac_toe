# Tic-Tac-Toe in [macroquad](https://github.com/not-fl3/macroquad)

Simple macroquad example of using `blocking_event_loop`

![Example run](screenshot.png)

## Tested on platforms:
- OSX (Intel)
- WASM (using [cargo-webquad](https://github.com/not-fl3/cargo-webquad/tree/master))
- Android
- iOS (Metal/Opengl)
- `(GNU )?Linux( (X11|Wayland))?( (GTK|QT))?`
- Should work on Windows (Not tested yet)
- KaiOs! (2.5.1)
    - If you have kaios phone: `kaios_run.sh`
    - TODO:
        - Add gif or apng to readme
        - Find way to really minimize size and loading time

## TODO:
- Clarify in iOS documentation that you need to use your package name instead `mygame` everywhere (probably `cargo-quad-ios` will be convenient) (Probably add log command from [here](https://macroquad.rs/articles/ios/#simulator-logs))

# Credits:
- [tic-tac-toe icon](https://icon-icons.com/icon/tic-tac-toe/39453)