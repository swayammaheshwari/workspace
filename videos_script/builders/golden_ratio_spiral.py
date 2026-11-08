from manim import *

GOLD_PALETTE = [
    "#4B6CB7", "#4FA3D1", "#5FC9C0", "#8FD694", "#F6D55C", "#F2A65A", "#E8743B",
]


def fibonacci_squares(n):
    """Tile n squares with Fibonacci side lengths, spiraling right/up/left/down."""
    fibs = [1, 1]
    while len(fibs) < n:
        fibs.append(fibs[-1] + fibs[-2])

    bbox_x, bbox_y, bbox_w, bbox_h = 0, 0, fibs[0], fibs[0]
    squares = [(bbox_x, bbox_y, fibs[0])]
    direction = 0  # 0=right, 1=up, 2=left, 3=down

    for i in range(1, n):
        size = fibs[i]
        if direction == 0:
            new_x, new_y = bbox_x + bbox_w, bbox_y
            bbox_w += size
        elif direction == 1:
            new_x, new_y = bbox_x, bbox_y + bbox_h
            bbox_h += size
        elif direction == 2:
            bbox_x -= size
            new_x, new_y = bbox_x, bbox_y
            bbox_w += size
        else:
            bbox_y -= size
            new_x, new_y = bbox_x, bbox_y
            bbox_h += size
        squares.append((new_x, new_y, size))
        direction = (direction + 1) % 4

    return squares


def build(scene, cfg):
    """scene: a VoiceoverScene+MovingCameraScene instance with speech service already set."""
    narration = cfg.get("narration", {})

    title = Text(cfg.get("title_text", "Why is this shape EVERYWHERE in nature?"), font_size=40, weight=BOLD)
    with scene.voiceover(text=narration["hook"]) as tracker:
        scene.play(FadeIn(title, shift=UP * 0.3), run_time=0.8, rate_func=smooth)
        scene.wait(0.8)
        scene.play(FadeOut(title, shift=UP * 0.3), run_time=0.6)
        remaining = tracker.duration - 2.2
        if remaining > 0:
            scene.wait(remaining)

    raw_squares = fibonacci_squares(7)  # sizes: 1,1,2,3,5,8,13
    scale = 0.32

    square_mobs = VGroup()
    labels = VGroup()

    for i, (x, y, size) in enumerate(raw_squares):
        s = size * scale
        color = GOLD_PALETTE[i % len(GOLD_PALETTE)]
        square = Square(side_length=s, color=color, fill_color=color, fill_opacity=0.35, stroke_width=3)
        square.move_to([(x + size / 2) * scale, (y + size / 2) * scale, 0])
        square_mobs.add(square)

        if size * scale > 0.35:
            label = Text(str(size), font_size=min(28, int(s * 26)), color=WHITE)
            label.move_to(square.get_center())
            labels.add(label)

    scene.camera.frame.save_state()
    spoken_for = 0.0
    with scene.voiceover(text=narration["squares"]) as tracker:
        for i, square in enumerate(square_mobs):
            scene.play(
                GrowFromCenter(square),
                scene.camera.frame.animate.move_to(square_mobs[: i + 1].get_center()).set(
                    width=square_mobs[: i + 1].width * 1.6 + 1
                ),
                run_time=0.55,
                rate_func=rate_functions.ease_out_cubic,
            )
            spoken_for += 0.55
            if i < len(labels):
                scene.play(FadeIn(labels[i], scale=0.7), run_time=0.25)
                spoken_for += 0.25
        remaining = tracker.duration - spoken_for
        if remaining > 0:
            scene.wait(remaining)

    scene.wait(0.3)

    phi = (1 + 5 ** 0.5) / 2
    b = np.log(phi) / (PI / 2)
    r0 = 0.5 * scale
    theta_max = np.log((square_mobs[-1].width / 2) / r0) / b

    def spiral_point(theta):
        r = r0 * np.exp(b * theta)
        return np.array([r * np.cos(theta), r * np.sin(theta), 0])

    spiral = ParametricFunction(spiral_point, t_range=[0, theta_max], color=WHITE, stroke_width=6)
    spiral.move_to(square_mobs[0].get_center())

    with scene.voiceover(text=narration["spiral"]) as tracker:
        scene.play(Create(spiral), run_time=2.2, rate_func=rate_functions.smooth)
        scene.wait(0.5)
        remaining = tracker.duration - 2.7
        if remaining > 0:
            scene.wait(remaining)

    formula = MathTex(r"\varphi = \frac{1+\sqrt{5}}{2} \approx 1.618", font_size=52, color=YELLOW)
    formula.next_to(square_mobs, DOWN, buff=0.9)

    full_bounds = VGroup(square_mobs, formula)
    target_width = full_bounds.width * 1.25
    target_width = max(target_width, full_bounds.height * 1.25 * 16 / 9)

    scene.play(
        scene.camera.frame.animate.set(width=target_width).move_to(full_bounds.get_center()),
        run_time=1.3,
        rate_func=smooth,
    )
    scene.wait(0.3)

    with scene.voiceover(text=narration["formula"]) as tracker:
        scene.play(Write(formula), run_time=1.2)
        remaining = tracker.duration - 1.2
        if remaining > 0:
            scene.wait(remaining)
    scene.wait(1.5)
