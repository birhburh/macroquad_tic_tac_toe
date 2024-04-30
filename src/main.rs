use macroquad::prelude::*;
use macroquad::request_redraw;

const SQUARES: i16 = 3;

#[derive(Clone, Debug, PartialEq)]
enum Field {
    X,
    O,
}

fn check_end(fields: &Vec<Option<Field>>) -> bool {
    for row in 0..SQUARES {
        let mut prev_val = None;
        for field_num in row * SQUARES..row * SQUARES + SQUARES {
            if let Some(field) = &fields[field_num as usize] {
                if let Some(prev_val) = &mut prev_val {
                    if &field != prev_val {
                        break;
                    } else {
                        if field_num == row * SQUARES + SQUARES - 1 {
                            return true;
                        }
                    }
                }
                prev_val = Some(field);
            } else {
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
                    } else {
                        if row == SQUARES - 1 {
                            return true;
                        }
                    }
                }
                prev_val = Some(field);
            } else {
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
                } else {
                    if field_num == SQUARES - 1 {
                        return true;
                    }
                }
            }
            prev_val = Some(field);
        } else {
            break;
        }
    }

    let mut prev_val = None;
    for field_num in 0..SQUARES {
        if let Some(field) = &fields[(field_num * SQUARES + (SQUARES - field_num - 1)) as usize] {
            if let Some(prev_val) = &mut prev_val {
                if &field != prev_val {
                    break;
                } else {
                    if field_num == SQUARES - 1 {
                        return true;
                    }
                }
            }
            prev_val = Some(field);
        } else {
            break;
        }
    }
    false
}

#[macroquad::main("TicTacToe")]
async fn main() {
    let mut fields = vec![None; (SQUARES * SQUARES) as usize];
    let mut game_over = false;
    let mut touched;
    let mut clicked;
    let mut x_move = true;
    let mut left = SQUARES * SQUARES;
    let mut prev = None;

    simulate_mouse_with_touch(false);

    loop {
        touched = false;
        clicked = false;
        for touch in touches().iter().take(1) {
            match touch.phase {
                TouchPhase::Ended => {
                    touched = true;
                }
                _ => (),
            };
        }
        if is_mouse_button_released(MouseButton::Left) {
            clicked = true;
        }
        if !game_over {
            clear_background(LIGHTGRAY);

            let game_size = screen_width().min(screen_height());
            let offset_x = (screen_width() - game_size) / 2. + 10.;
            let offset_y = (screen_height() - game_size) / 2. + 10.;
            let sq_size = (screen_height() - offset_y * 2.) / SQUARES as f32;

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

            if is_mouse_button_released(MouseButton::Left) {
                make_move = true;
            }

            draw_text(
                format!("new_x: {new_x}; new_y: {new_y}").as_str(),
                0.,
                50.,
                32.,
                RED,
            );
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

            if make_move {
                if prev.is_some() {
                    x_move = !x_move;
                    left -= 1;
                    if left <= 0 {
                        game_over = true;
                        request_redraw();
                    }
                }
                prev = None;
                if check_end(&fields) {
                    game_over = true;
                    request_redraw();
                }
            }

            if !game_over {
                if let Some(prev) = prev {
                    let field = &mut fields[prev];
                    *field = None;
                }

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
                        *field = if x_move {
                            Some(Field::X)
                        } else {
                            Some(Field::O)
                        };
                        prev = Some(field_num);
                    }
                } else {
                    prev = None;
                }
            }

            for (i, field) in fields.iter().enumerate() {
                if let Some(field) = field {
                    let x = i % SQUARES as usize;
                    let y = i / SQUARES as usize;
                    let new_x = offset_x as usize + sq_size as usize * x + sq_size as usize / 2;
                    let new_y = offset_y as usize + sq_size as usize * y + sq_size as usize / 2;
                    match field {
                        Field::X => {
                            draw_line(
                                new_x as f32 - 80.,
                                new_y as f32 - 80.,
                                new_x as f32 + 80.,
                                new_y as f32 + 80.,
                                60.,
                                BLUE,
                            );
                            draw_line(
                                new_x as f32 + 80.,
                                new_y as f32 - 80.,
                                new_x as f32 - 80.,
                                new_y as f32 + 80.,
                                60.,
                                BLUE,
                            );
                        }
                        Field::O => {
                            draw_circle_lines(new_x as f32, new_y as f32, 80., 60., RED);
                        }
                    }
                }
            }
        } else {
            clear_background(WHITE);
            let text = if left <= 0 {
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

            if touched || clicked {
                game_over = false;
                for field in &mut fields {
                    *field = None;
                }
                x_move = true;
                left = SQUARES * SQUARES;
                request_redraw();
            }
        }

        // draw_text(format!("FPS: {}", get_fps()).as_str(), 0., 50., 32., RED);
        next_frame().await
    }
}
