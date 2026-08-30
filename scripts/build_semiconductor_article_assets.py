from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # 二极管
    "diode-rectifier": (4, (620, 2380, 4160, 5700)),
    "diode-schottky-anti-reverse": (5, (620, 1600, 4160, 4250)),
    "diode-freewheel-circuits": (6, (620, 550, 4160, 3950)),
    "diode-zener-reference": (9, (620, 850, 4160, 3760)),
    "diode-tvs-protection": (12, (620, 2950, 4160, 4380)),
    # 三极管
    "bjt-switch-inverter": (14, (620, 550, 4160, 3500)),
    "bjt-level-shift": (14, (620, 3850, 4160, 5850)),
    "bjt-tl431-reference": (17, (620, 780, 4160, 2150)),
    "bjt-linear-regulator": (17, (620, 2560, 4160, 4400)),
    "bjt-common-emitter-qpoint": (20, (620, 550, 4160, 4420)),
    "bjt-small-signal": (24, (620, 550, 4160, 5520)),
    "bjt-voltage-bias-qpoint": (27, (620, 700, 4160, 4600)),
    "bjt-bypass-compare": (28, (620, 500, 4160, 5750)),
    # 光耦
    "optocoupler-ctr": (31, (620, 450, 4160, 3850)),
    "optocoupler-circuits": (33, (620, 450, 4160, 4050)),
    "oc-od-wired-and": (35, (620, 450, 4160, 4000)),
    # MOS 管
    "mos-iic-level-shift": (38, (620, 950, 4160, 2600)),
    "mos-pmos-soft-start": (40, (620, 700, 4160, 2900)),
    "mos-vs-bjt-temperature": (46, (620, 500, 4160, 6000)),
    "mos-soft-start-simulation": (50, (620, 500, 4160, 6000)),
    "mos-switching-loss": (55, (620, 500, 4160, 4450)),
    "mos-soa": (58, (620, 750, 4160, 4400)),
    "mos-soa-selection": (59, (620, 600, 4160, 3900)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 60:
        raise ValueError(f"Expected 60 JPG pages, found {len(pages)} in {source_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    for base_name, (page_number, box) in CROPS.items():
        with Image.open(pages[page_number - 1]) as page:
            crop = page.convert("RGB").crop(box)
            body = resized(crop, 1400)
            high_resolution = resized(crop, 2200)
            body.save(output_dir / f"{base_name}.webp", "WEBP", quality=84, method=6)
            high_resolution.save(
                output_dir / f"{base_name}-hd.jpg",
                "JPEG",
                quality=92,
                optimize=True,
                progressive=True,
            )
            print(
                f"{base_name}: page {page_number}, "
                f"body {body.width}x{body.height}, "
                f"hd {high_resolution.width}x{high_resolution.height}"
            )


def main() -> None:
    parser = argparse.ArgumentParser(description="Build semiconductor article crops from chapter 2 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
