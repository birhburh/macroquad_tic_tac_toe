# Tic-Tac-Toe in [macroquad](https://github.com/not-fl3/macroquad)

Simple macroquad example of using `blocking_event_loop`

![Example run](screenshot.png)

## Tested on platforms:
- OSX (Intel) (Works only OpenGl, AppleGfxApi::Metal draws [quarter of application](heavy_metal_screenshot.png))
- WASM (using [cargo-webquad](https://github.com/not-fl3/cargo-webquad/tree/master))
- Should work on Windows and `(GNU )?Linux( (X11|Wayland))?( (GTK|QT))?` (Not tested yet)

## TODO:
- Add support for touch after `blocking_event_loop` is implemented for android and iOS
- Catched bug of `draw_circle_lines` it draws lines like it's sun (fix, or create issue if lazy)
- Metal backend works weird (fix, or create issue if lazy)