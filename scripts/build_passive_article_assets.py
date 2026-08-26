from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    "resistor-package": (4, (620, 420, 4160, 3500)),
    "resistor-power-current": (6, (620, 420, 4160, 3900)),
    "resistor-applications": (11, (620, 420, 4160, 5700)),
    "zero-ohm-applications": (16, (620, 420, 4160, 5700)),
    "capacitor-functions": (21, (620, 380, 4160, 5900)),
    "capacitor-pump-timing": (24, (620, 380, 4160, 5900)),
    "capacitor-selection": (28, (620, 350, 4160, 4700)),
    "capacitor-pdn": (35, (620, 300, 4160, 6100)),
    "inductor-dcr": (38, (620, 350, 4160, 6100)),
    "inductor-current": (39, (620, 350, 4160, 5800)),
    "ferrite-applications": (42, (620, 300, 4160, 6100)),
    "ferrite-comparison": (43, (620, 300, 4160, 6100)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 44:
        raise ValueError(f"Expected 44 JPG pages, found {len(pages)} in {source_dir}")

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
    parser = argparse.ArgumentParser(description="Build selected passive-component article crops.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
