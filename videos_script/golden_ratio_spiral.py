from manim import *
from manim_voiceover import VoiceoverScene
from manim_voiceover.services.gtts import GTTSService

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


class GoldenRatioSpiral(VoiceoverScene, MovingCameraScene):
    def construct(self):
        self.camera.background_color = "#0b0d14"
        self.set_speech_service(GTTSService(lang="en"))

        title = Text("Why is this shape EVERYWHERE in nature?", font_size=40, weight=BOLD)
        with self.voiceover(text="Why is this shape everywhere, from sunflowers to galaxies?") as tracker:
            self.play(FadeIn(title, shift=UP * 0.3), run_time=0.8, rate_func=smooth)
            self.wait(0.8)
            self.play(FadeOut(title, shift=UP * 0.3), run_time=0.6)
            remaining = tracker.duration - 2.2
            if remaining > 0:
                self.wait(remaining)

        raw_squares = fibonacci_squares(7)  # sizes: 1,1,2,3,5,8,13
        scale = 0.32  # scale fibonacci units down to manim units

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

        # Reveal squares one at a time, camera smoothly tracking the growing group
        self.camera.frame.save_state()
        spoken_for = 0.0
        with self.voiceover(
            text="These are the Fibonacci numbers: one, one, two, three, five, eight, thirteen. "
            "Each number is the sum of the two before it."
        ) as tracker:
            for i, square in enumerate(square_mobs):
                self.play(
                    GrowFromCenter(square),
                    self.camera.frame.animate.move_to(square_mobs[: i + 1].get_center()).set(
                        width=square_mobs[: i + 1].width * 1.6 + 1
                    ),
                    run_time=0.55,
                    rate_func=rate_functions.ease_out_cubic,
                )
                spoken_for += 0.55
                if i < len(labels):
                    self.play(FadeIn(labels[i], scale=0.7), run_time=0.25)
                    spoken_for += 0.25
            remaining = tracker.duration - spoken_for
            if remaining > 0:
                self.wait(remaining)

        self.wait(0.3)

        # Decorative logarithmic spiral echoing the Fibonacci growth pattern.
        # r grows by a factor of phi every quarter turn, matching how the
        # square sizes grow, scaled to span from the smallest to largest square.
        phi = (1 + 5 ** 0.5) / 2
        b = np.log(phi) / (PI / 2)
        r0 = 0.5 * scale  # half the smallest square's side
        theta_max = np.log((square_mobs[-1].width / 2) / r0) / b

        def spiral_point(theta):
            r = r0 * np.exp(b * theta)
            return np.array([r * np.cos(theta), r * np.sin(theta), 0])

        spiral = ParametricFunction(
            spiral_point,
            t_range=[0, theta_max],
            color=WHITE,
            stroke_width=6,
        )
        spiral.move_to(square_mobs[0].get_center())

        with self.voiceover(text="Connect the corners with quarter arcs, and a spiral appears.") as tracker:
            self.play(Create(spiral), run_time=2.2, rate_func=rate_functions.smooth)
            self.wait(0.5)
            remaining = tracker.duration - 2.7
            if remaining > 0:
                self.wait(remaining)

        # Work out the formula's position first, then zoom out enough that both
        # the squares AND the formula fit comfortably inside the camera frame.
        formula = MathTex(r"\varphi = \frac{1+\sqrt{5}}{2} \approx 1.618", font_size=52, color=YELLOW)
        formula.next_to(square_mobs, DOWN, buff=0.9)

        full_bounds = VGroup(square_mobs, formula)
        target_width = full_bounds.width * 1.25
        target_width = max(target_width, full_bounds.height * 1.25 * 16 / 9)

        self.play(
            self.camera.frame.animate.set(width=target_width).move_to(full_bounds.get_center()),
            run_time=1.3,
            rate_func=smooth,
        )
        self.wait(0.3)

        with self.voiceover(
            text="This growth ratio is phi, the golden ratio, approximately one point six one eight."
        ) as tracker:
            self.play(Write(formula), run_time=1.2)
            remaining = tracker.duration - 1.2
            if remaining > 0:
                self.wait(remaining)
        self.wait(1.5)
