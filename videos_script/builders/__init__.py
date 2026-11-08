from . import euler_identity, golden_ratio_spiral, pythagorean_rearrangement

BUILDERS = {
    "golden_ratio_spiral": golden_ratio_spiral.build,
    "pythagorean_rearrangement": pythagorean_rearrangement.build,
    "euler_identity": euler_identity.build,
}
