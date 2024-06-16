use macroquad::prelude::*;

const SQUARES: i16 = 3;

#[derive(Clone, Debug, PartialEq)]
enum Field {
    X,
    O,
}

fn check_end(fields: &[Option<Field>]) -> (bool, bool) {
    let mut has_empty = false;

    for row in 0..SQUARES {
        let mut prev_val = None;
        for field_num in row * SQUARES..row * SQUARES + SQUARES {
            if let Some(field) = &fields[field_num as usize] {
                if let Some(prev_val) = &mut prev_val {
                    if &field != prev_val {
                        break;
                    } else if field_num == row * SQUARES + SQUARES - 1 {
                        return (true, true);
                    }
                }
                prev_val = Some(field);
            } else {
                has_empty = true;
                break;
            }
        }
    }

    for column in 0..SQUARES {
        let mut prev_val = None;
        for row in 0..SQUARES {
            if let Some(field) = &fields[(row * SQUARES + column) as usize] {
                if let Some(prev_val) = &mut prev_val {
                    if &field != prev_val {
                        break;
                    } else if row == SQUARES - 1 {
                        return (true, true);
                    }
                }
                prev_val = Some(field);
            } else {
                has_empty = true;
                break;
            }
        }
    }

    let mut prev_val = None;
    for field_num in 0..SQUARES {
        if let Some(field) = &fields[(field_num * SQUARES + field_num) as usize] {
            if let Some(prev_val) = &mut prev_val {
                if &field != prev_val {
                    break;
                } else if field_num == SQUARES - 1 {
                    return (true, true);
                }
            }
            prev_val = Some(field);
        } else {
            has_empty = true;
            break;
        }
    }

    let mut prev_val = None;
    for field_num in 0..SQUARES {
        if let Some(field) = &fields[(field_num * SQUARES + (SQUARES - field_num - 1)) as usize] {
            if let Some(prev_val) = &mut prev_val {
                if &field != prev_val {
                    break;
                } else if field_num == SQUARES - 1 {
                    return (true, true);
                }
            }
            prev_val = Some(field);
        } else {
            has_empty = true;
            break;
        }
    }

    has_empty = has_empty || fields.last().unwrap().is_none();

    (!has_empty, false)
}

fn draw_x(x: f32, y: f32) {
    draw_line(x - 80., y - 80., x + 80., y + 80., 60., BLUE);
    draw_line(x + 80., y - 80., x - 80., y + 80., 60., BLUE);
}

fn draw_o(x: f32, y: f32) {
    draw_poly(x, y, 30, 95., 0., RED);
    draw_poly(x, y, 30, 50., 0., WHITE);
    // TODO: Fix poly_lines and make a pull request
    // They are now like star
    // draw_circle_lines(x, y, 80., 60., RED);
    // draw_poly_lines(x, y, 20, 80., 0., 60., RED);
}

fn game_play_state(
    fields: &mut [Option<Field>],
    x_move: &mut bool,
    pressed_over: &mut Option<usize>,
    old_x: &mut f32,
    old_y: &mut f32,
) -> (bool, bool) {
    clear_background(LIGHTGRAY);

    let game_size = screen_width().min(screen_height());
    let offset_x = (screen_width() - game_size) / 2. + 10.;
    let offset_y = (screen_height() - game_size) / 2. + 10.;
    let sq_size = (screen_height() - offset_y * 2.) / SQUARES as f32;

    // Draw game field
    draw_rectangle(offset_x, offset_y, game_size - 20., game_size - 20., WHITE);

    for i in 1..SQUARES {
        draw_line(
            offset_x,
            offset_y + sq_size * i as f32,
            screen_width() - offset_x,
            offset_y + sq_size * i as f32,
            2.,
            LIGHTGRAY,
        );
    }

    for i in 1..SQUARES {
        draw_line(
            offset_x + sq_size * i as f32,
            offset_y,
            offset_x + sq_size * i as f32,
            screen_height() - offset_y,
            2.,
            LIGHTGRAY,
        );
    }

    let mut new_x = mouse_position().0;
    let mut new_y = mouse_position().1;
    let mut make_move = false;

    // TODO: Check if it works on android when blocking_event_loop will be implemented
    for touch in touches().iter().take(1) {
        match touch.phase {
            TouchPhase::Ended | TouchPhase::Cancelled => {
                make_move = true;
                break;
            }
            _ => (),
        }
        new_x = touch.position.x;
        new_y = touch.position.y;
    }

    let mut pressed = is_mouse_button_pressed(MouseButton::Left);
    let mut released = is_mouse_button_released(MouseButton::Left);

    for touch in touches().iter().take(1) {
        use TouchPhase::*;
        match touch.phase {
            Started | Stationary => pressed = true,
            Ended | Cancelled => {
                released = true;
                new_x = *old_x;
                new_y = *old_y;
            }
            _ => (),
        }
    }

    debug!("WOW: pressed: {}", pressed);
    debug!("WOW: released: {}", released);
    debug!("WOW: new_x: {}", old_x);
    debug!("WOW: new_y: {}", old_y);
    debug!("WOW: new_x: {}", new_x);
    debug!("WOW: new_y: {}", new_y);
    debug!("WOW: game_size: {}", game_size);
    debug!("WOW: offset_x: {}", offset_x);
    debug!("WOW: offset_y: {}", offset_y);

    if new_x >= offset_x
        && new_x <= offset_x + game_size - 20.
        && new_y >= offset_y
        && new_y <= offset_y + game_size - 20.
    {
        let new_x = (new_x - offset_x) / sq_size;
        let new_y = (new_y - offset_y) / sq_size;
        let field_num = (new_y as i16 * SQUARES + new_x as i16) as usize;
        let field = &mut fields[field_num];

        if field.is_none() {
            if pressed {
                *pressed_over = Some(field_num);
            } else if released {
                if let Some(pressed_over) = pressed_over {
                    if *pressed_over == field_num {
                        *field = if *x_move {
                            Some(Field::X)
                        } else {
                            Some(Field::O)
                        };
                        make_move = true;
                    }
                }
                *pressed_over = None;
            }
        } else if pressed {
            *pressed_over = None;
        }
    } else if pressed {
        *pressed_over = None;
    }
    *old_x = new_x;
    *old_y = new_y;

    debug!("WOW: pressed_over: {:?}", pressed_over);

    for (i, field) in fields.iter().enumerate() {
        if let Some(field) = field {
            let x = i % SQUARES as usize;
            let y = i / SQUARES as usize;
            let new_x = offset_x as usize + sq_size as usize * x + sq_size as usize / 2;
            let new_y = offset_y as usize + sq_size as usize * y + sq_size as usize / 2;
            match field {
                Field::X => {
                    draw_x(new_x as f32, new_y as f32);
                }
                Field::O => {
                    draw_o(new_x as f32, new_y as f32);
                }
            }
        }
    }

    let mut game_over = false;
    let mut win = false;
    if make_move {
        (game_over, win) = check_end(fields);
        *x_move = !*x_move;
        macroquad::miniquad::window::schedule_update();
    }
    (game_over, win)
}

fn game_over_state(win: bool, x_move: bool) {
    clear_background(WHITE);
    let text = if !win {
        "DRAW"
    } else if x_move {
        "O WINS"
    } else {
        "X WINS"
    };
    let mut text = text.to_string();
    text.push_str(". Touch screen to play again.");
    let font_size = 30.;
    let text_size = measure_text(&text, None, font_size as _, 1.0);

    draw_text(
        &text,
        screen_width() / 2. - text_size.width / 2.,
        screen_height() / 2. - text_size.height / 2.,
        font_size,
        DARKGRAY,
    );
}

fn window_conf() -> Conf {
    Conf {
        window_title: "TicTacToe".to_owned(),
        platform: miniquad::conf::Platform {
            blocking_event_loop: true,
            // apple_gfx_api: miniquad::conf::AppleGfxApi::Metal,
            ..Default::default()
        },
        // high_dpi: true,
        ..Default::default()
    }
}

#[macroquad::main(window_conf)]
async fn main() {
    let mut fields = vec![None; (SQUARES * SQUARES) as usize];
    let mut game_over = false;
    let mut win = false;
    let mut x_move = true;
    let mut pressed_over = None;
    let mut old_x = 0.;
    let mut old_y = 0.;
    let mut counter = 0;

    simulate_mouse_with_touch(false);

    loop {
        if !game_over {
            (game_over, win) = game_play_state(
                &mut fields,
                &mut x_move,
                &mut pressed_over,
                &mut old_x,
                &mut old_y,
            );
            if game_over {
                macroquad::miniquad::window::schedule_update();
            }
        } else {
            game_over_state(win, x_move);

            let mut pressed = is_mouse_button_pressed(MouseButton::Left);

            for touch in touches().iter().take(1) {
                if touch.phase == TouchPhase::Ended {
                    pressed = true;
                }
            }

            if pressed {
                game_over = false;
                for field in &mut fields {
                    *field = None;
                }
                x_move = true;
                pressed_over = None;
                macroquad::miniquad::window::schedule_update();
            }
        }

        let text = format!("COUNTER: {}", counter);
        counter += 1;
        let font_size = 30.;
        let text_size = measure_text(&text, None, font_size as _, 1.0);

        draw_text(
            &text,
            screen_width() / 2. - text_size.width / 2.,
            screen_height() / 2. - text_size.height / 2.,
            font_size,
            RED,
        );

        next_frame().await
    }
}
