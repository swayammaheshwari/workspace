from manim import *


def build(scene, cfg):
    narration = cfg.get("narration", {})

    title = Text(cfg.get("title_text", "The most beautiful equation in math"), font_size=38, weight=BOLD)
    with scene.voiceover(text=narration["intro"]) as tracker:
        scene.play(FadeIn(title, shift=UP * 0.3), run_time=0.7)
        scene.wait(0.9)
        scene.play(FadeOut(title, shift=UP * 0.3), run_time=0.5)
        remaining = tracker.duration - 2.1
        if remaining > 0:
            scene.wait(remaining)

    plane = NumberPlane(
        x_range=[-2, 2, 1],
        y_range=[-2, 2, 1],
        x_length=6,
        y_length=6,
        background_line_style={"stroke_opacity": 0.25},
    ).to_edge(LEFT, buff=1.0)

    circle = Circle(radius=2, color=BLUE_D, stroke_width=3).move_to(plane.get_origin())

    with scene.voiceover(text=narration["circle"]) as tracker:
        scene.play(Create(plane), run_time=0.8)
        scene.play(Create(circle), run_time=0.8)
        remaining = tracker.duration - 1.6
        if remaining > 0:
            scene.wait(remaining)

    theta = ValueTracker(0)

    def point_on_circle():
        t = theta.get_value()
        return plane.c2p(np.cos(t), np.sin(t))

    dot = always_redraw(lambda: Dot(point_on_circle(), color=YELLOW, radius=0.08))
    radius_line = always_redraw(lambda: Line(plane.get_origin(), point_on_circle(), color=YELLOW, stroke_width=3))
    trace = TracedPath(point_on_circle, stroke_color=GOLD, stroke_width=4)

    angle_label = always_redraw(
        lambda: MathTex(r"\theta", font_size=32, color=WHITE).move_to(
            plane.get_origin()
            + np.array([0.55 * np.cos(theta.get_value() / 2), 0.55 * np.sin(theta.get_value() / 2), 0])
        )
    )

    live_formula = always_redraw(
        lambda: MathTex(
            r"e^{i\theta} = \cos\theta + i\sin\theta", font_size=36, color=WHITE
        ).to_edge(RIGHT, buff=1.2).shift(UP * 2)
    )

    value_display = always_redraw(
        lambda: MathTex(rf"\theta = {theta.get_value():.2f}", font_size=32, color=GRAY_B).next_to(
            live_formula, DOWN, buff=0.5
        )
    )

    scene.add(trace, radius_line, dot, angle_label)
    with scene.voiceover(text=narration["formula_intro"]) as tracker:
        scene.play(Write(live_formula), run_time=0.8)
        scene.play(FadeIn(value_display), run_time=0.4)
        remaining = tracker.duration - 1.2
        if remaining > 0:
            scene.wait(remaining)

    with scene.voiceover(text=narration["rotation"]) as tracker:
        scene.play(theta.animate.set_value(PI), run_time=max(tracker.duration, 3.0), rate_func=rate_functions.smooth)

    scene.wait(0.5)

    with scene.voiceover(text=narration["landing"]):
        scene.play(Flash(point_on_circle(), color=YELLOW, flash_radius=0.5), run_time=0.6)
        scene.wait(0.3)

    scene.play(FadeOut(angle_label), FadeOut(value_display), run_time=0.4)
    live_formula.clear_updaters()

    result1 = MathTex(r"e^{i\pi} = -1", font_size=48, color=YELLOW).to_edge(RIGHT, buff=1.2).shift(UP * 1.0)
    with scene.voiceover(text=narration["minus_one"]) as tracker:
        scene.play(Transform(live_formula, result1), run_time=1.0)
        remaining = tracker.duration - 1.0
        if remaining > 0:
            scene.wait(remaining)
    scene.wait(0.8)

    final = MathTex(r"e^{i\pi} + 1 = 0", font_size=56, color=YELLOW)
    final.move_to(live_formula.get_center())
    with scene.voiceover(text=narration["conclusion"]) as tracker:
        scene.play(Transform(live_formula, final), run_time=1.0)
        remaining = tracker.duration - 1.0
        if remaining > 0:
            scene.wait(remaining)
    scene.wait(2)
