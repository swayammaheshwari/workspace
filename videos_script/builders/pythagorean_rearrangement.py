from manim import *

A = 3  # short leg
B = 4  # long leg
C = 5  # hypotenuse

SCALE = 0.72
DA, DB = A * SCALE, B * SCALE


def build(scene, cfg):
    narration = cfg.get("narration", {})

    title = Text(cfg.get("title_text", "A proof with zero algebra"), font_size=42, weight=BOLD)
    with scene.voiceover(text=narration["intro"]) as tracker:
        scene.play(FadeIn(title, shift=UP * 0.3), run_time=0.7)
        scene.wait(0.9)
        scene.play(FadeOut(title, shift=UP * 0.3), run_time=0.5)
        remaining = tracker.duration - 2.1
        if remaining > 0:
            scene.wait(remaining)

    half = (DA + DB) / 2
    corner_A = np.array([-half, -half, 0])
    corner_B = np.array([half, -half, 0])
    corner_C = np.array([half, half, 0])
    corner_D = np.array([-half, half, 0])

    P1 = corner_A + RIGHT * DA
    P2 = corner_B + UP * DA
    P3 = corner_C + LEFT * DA
    P4 = corner_D + DOWN * DA

    frame = Square(side_length=DA + DB, color=WHITE, stroke_width=4)

    tri_color = "#4FA3D1"
    T1 = Polygon(corner_A, P1, P4, color=tri_color, fill_color=tri_color, fill_opacity=0.75, stroke_width=2)
    T2 = Polygon(corner_B, P2, P1, color=tri_color, fill_color=tri_color, fill_opacity=0.75, stroke_width=2)
    T3 = Polygon(corner_C, P3, P2, color=tri_color, fill_color=tri_color, fill_opacity=0.75, stroke_width=2)
    T4 = Polygon(corner_D, P4, P3, color=tri_color, fill_color=tri_color, fill_opacity=0.75, stroke_width=2)
    triangles = VGroup(T1, T2, T3, T4)

    inner_square = Polygon(P1, P2, P3, P4, color=YELLOW, fill_color=YELLOW, fill_opacity=0.35, stroke_width=3)

    with scene.voiceover(text=narration["setup"]) as tracker:
        scene.play(Create(frame), run_time=0.8)
        scene.play(LaggedStart(*[GrowFromCenter(t) for t in triangles], lag_ratio=0.15), run_time=1.4)
        scene.play(FadeIn(inner_square), run_time=0.6)
        remaining = tracker.duration - 2.8
        if remaining > 0:
            scene.wait(remaining)

    c_label = MathTex("c^2", font_size=48, color=YELLOW).move_to(inner_square.get_center())
    with scene.voiceover(text=narration["c_squared"]) as tracker:
        scene.play(Write(c_label), run_time=0.7)
        scene.wait(1.0)
        remaining = tracker.duration - 1.7
        if remaining > 0:
            scene.wait(remaining)

    caption1 = Text("Same 4 triangles, arranged one way...", font_size=30)
    caption1.to_edge(DOWN, buff=0.5)
    scene.play(FadeIn(caption1, shift=UP * 0.2), run_time=0.6)
    scene.wait(0.6)
    scene.play(
        FadeOut(caption1, shift=UP * 0.2),
        FadeOut(c_label),
        FadeOut(inner_square),
        run_time=0.5,
    )

    with scene.voiceover(text=narration["slide"]) as tracker:
        scene.play(
            T1.animate.shift(UP * DA),
            T3.animate.shift(LEFT * DB),
            T4.animate.shift(RIGHT * DA + DOWN * DB),
            run_time=1.8,
            rate_func=rate_functions.ease_in_out_cubic,
        )
        scene.wait(0.5)
        remaining = tracker.duration - 2.3
        if remaining > 0:
            scene.wait(remaining)

    a_square = Square(side_length=DA, color=GREEN, fill_color=GREEN, fill_opacity=0.35, stroke_width=0)
    a_square.move_to(corner_A + RIGHT * DA / 2 + UP * DA / 2)
    b_square = Square(side_length=DB, color="#E8743B", fill_color="#E8743B", fill_opacity=0.35, stroke_width=0)
    b_square.move_to(corner_C + LEFT * DB / 2 + DOWN * DB / 2)

    a_label = MathTex("a^2", font_size=40, color=WHITE).move_to(a_square.get_center())
    b_label = MathTex("b^2", font_size=40, color=WHITE).move_to(b_square.get_center())

    with scene.voiceover(text=narration["reveal"]) as tracker:
        scene.play(FadeIn(a_square), FadeIn(b_square), run_time=0.5)
        scene.play(Write(a_label), Write(b_label), run_time=0.6)
        remaining = tracker.duration - 1.1
        if remaining > 0:
            scene.wait(remaining)

    caption2 = Text("...reveals a² and b², exactly where c² was.", font_size=30)
    caption2.to_edge(DOWN, buff=0.5)
    with scene.voiceover(text=narration["same_area"]) as tracker:
        scene.play(FadeIn(caption2, shift=UP * 0.2), run_time=0.6)
        scene.wait(0.7)
        remaining = tracker.duration - 1.3
        if remaining > 0:
            scene.wait(remaining)
    scene.play(FadeOut(caption2, shift=UP * 0.2), run_time=0.5)

    formula = MathTex("a^2 + b^2 = c^2", font_size=56, color=YELLOW)
    formula.to_edge(DOWN, buff=1.0)
    with scene.voiceover(text=narration["conclusion"]) as tracker:
        scene.play(Write(formula), run_time=1.0)
        remaining = tracker.duration - 1.0
        if remaining > 0:
            scene.wait(remaining)
    scene.wait(1.5)
