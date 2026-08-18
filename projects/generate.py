"""Generate the three project thumbnails as SVG.

Sized to the .proj-thumb box (132x142) but authored as viewBox-only so they
stay crisp at the 96x104 mobile size and on retina. Each tile is one bold
form on an accent-tinted dark ground; the set is meant to read as a family.
"""
import random
from pathlib import Path

OUT = Path(__file__).parent
OUT.mkdir(exist_ok=True)

W, H = 132, 142
R = 14  # matches --radius-md so the art's corners sit under the CSS radius

ACCENT = "#F26B3A"   # --accent
LIME = "#C8F53C"     # --accent-2
CLAY = "#CF7A52"     # warm clay for the generative pair


def wrap(bg, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'width="{W}" height="{H}" role="img">\n'
        f'  <rect width="{W}" height="{H}" rx="{R}" fill="{bg}"/>\n'
        f'{body}'
        f'</svg>\n'
    )


# --- HIV Risk: SHAP-style importance cascade ------------------------------
# Bars descend in width and fade out, so the eye reads "ranked contributions"
# without needing any axis or label to survive at 132px.
def hiv():
    widths = [100, 86, 71, 57, 44, 32, 21]
    bh, gap = 8, 9
    total = len(widths) * bh + (len(widths) - 1) * gap
    y = (H - total) / 2
    rows = []
    for i, w in enumerate(widths):
        op = round(1.0 - i * 0.115, 3)
        rows.append(
            f'  <rect x="16" y="{y + i * (bh + gap):.1f}" width="{w}" '
            f'height="{bh}" rx="4" fill="{ACCENT}" opacity="{op}"/>\n'
        )
    return wrap("#1F1512", "".join(rows))


# --- wtf2EAT: sparse user-item matrix -------------------------------------
# The literal shape of the collaborative filtering problem: mostly empty,
# a scattered minority observed.
def wtf2eat():
    random.seed(7)
    cols, rows_n = 7, 8
    cell, gap = 10, 4
    gw = cols * cell + (cols - 1) * gap
    gh = rows_n * cell + (rows_n - 1) * gap
    x0, y0 = (W - gw) / 2, (H - gh) / 2
    filled = set(random.sample(range(cols * rows_n), 13))
    out = []
    for idx in range(cols * rows_n):
        r, c = divmod(idx, cols)
        x = x0 + c * (cell + gap)
        y = y0 + r * (cell + gap)
        op = "1" if idx in filled else "0.13"
        out.append(
            f'  <rect x="{x:.1f}" y="{y:.1f}" width="{cell}" height="{cell}" '
            f'rx="3" fill="{LIME}" opacity="{op}"/>\n'
        )
    return wrap("#171A10", "".join(out))


# --- Equanimity & Nocturne: noise resolving into form ---------------------
# Four panels left to right: pure noise, coarse structure, near-form, clean.
# Encodes the diffusion process the pipelines actually run.
def nocturne():
    random.seed(11)
    panels, pad, gap = 4, 14, 6
    pw = (W - 2 * pad - gap * (panels - 1)) / panels
    ptop, ph = 20, 102
    out = [f'  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">'
           f'<stop offset="0" stop-color="{CLAY}" stop-opacity=".95"/>'
           f'<stop offset="1" stop-color="{CLAY}" stop-opacity=".45"/>'
           f'</linearGradient></defs>\n']
    # The two channels cross: the resolved form ramps up as the grain ramps
    # down. Varying grain alone read as four panels of identical speckle —
    # it's the crossfade that makes the sequence legible at thumbnail size.
    form_op = [0.00, 0.22, 0.62, 1.00]
    grain_op = [0.60, 0.42, 0.20, 0.00]
    grain_n = [190, 120, 55, 0]
    dot_px = [1.3, 1.8, 2.6, 0]

    for p in range(panels):
        x = pad + p * (pw + gap)
        out.append(f'  <clipPath id="c{p}"><rect x="{x:.1f}" y="{ptop}" '
                   f'width="{pw:.1f}" height="{ph}" rx="3"/></clipPath>\n')
        out.append(f'  <rect x="{x:.1f}" y="{ptop}" width="{pw:.1f}" '
                   f'height="{ph}" rx="3" fill="{CLAY}" opacity=".10"/>\n')
        if form_op[p]:
            out.append(f'  <rect x="{x:.1f}" y="{ptop}" width="{pw:.1f}" '
                       f'height="{ph}" rx="3" fill="url(#g)" '
                       f'opacity="{form_op[p]}"/>\n')
        if not grain_n[p]:
            continue
        # One <g> per panel carries fill/opacity/clip so the dots stay
        # attribute-free — the difference between a 27KB file and a 5KB one.
        out.append(f'  <g clip-path="url(#c{p})" fill="{CLAY}" '
                   f'opacity="{grain_op[p]}">')
        for _ in range(grain_n[p]):
            cx = x + random.random() * pw
            cy = ptop + random.random() * ph
            out.append(f'<rect x="{cx:.0f}" y="{cy:.0f}" '
                       f'width="{dot_px[p]}" height="{dot_px[p]}"/>')
        out.append('</g>\n')
    return wrap("#1F1712", "".join(out))


for name, svg in (("hiv-risk", hiv()), ("wtf2eat", wtf2eat()),
                  ("equanimity", nocturne())):
    (OUT / f"{name}.svg").write_text(svg)
    print(f"{name}.svg  {len(svg):>6} bytes")
