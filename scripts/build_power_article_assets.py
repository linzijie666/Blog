from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # 开关电源
    "dcdc-components": (4, (620, 3140, 4160, 4200)),
    "dcdc-design-rt8279": (5, (620, 1750, 4160, 3560)),
    "dcdc-design-rt6253": (5, (620, 3650, 4160, 5900)),
    "dcdc-design-waveform": (7, (620, 3280, 4160, 5500)),
    "buck-loop-charge": (9, (620, 1700, 4160, 2860)),
    "buck-loop-freewheel": (9, (620, 3550, 4160, 4760)),
    "buck-waveform": (10, (620, 590, 4160, 2800)),
    "boost-loop-charge": (12, (620, 620, 4160, 2070)),
    "boost-loop-freewheel": (12, (620, 2650, 4160, 4080)),
    "ccm-dcm-waveforms": (14, (620, 2880, 4160, 4880)),
    "psm-light-load-ripple": (15, (620, 2860, 4160, 4090)),
    "volt-second-waveform": (17, (620, 1330, 4160, 3050)),
    "volt-second-buck-circuit": (18, (620, 2520, 4160, 3800)),
    "volt-second-buck-equiv": (18, (620, 4500, 4160, 6090)),
    "cap-charge-curve": (29, (620, 690, 4160, 1960)),
    "sequencing-rc-circuit": (28, (620, 4930, 4160, 5670)),
    "sequencing-chip-circuit": (29, (620, 3430, 4160, 4890)),
    "sequencing-gpio-circuit": (31, (620, 2900, 4160, 3940)),
    "ripple-cause-parts": (32, (620, 3240, 4160, 4790)),
    "ripple-probe-setup": (34, (620, 490, 4160, 1750)),
    "ripple-measure-point": (34, (620, 3210, 4160, 4150)),
    "fccm-psm-scope": (36, (620, 560, 4160, 3870)),
    "mode-scope-compare": (53, (620, 1610, 4160, 2620)),
    "ripple-inductance-sim": (51, (620, 3550, 4160, 5660)),
    "ripple-fsw-sim": (52, (620, 1040, 4160, 3100)),
    "ripple-esr-esl-parts": (48, (620, 2340, 4160, 3440)),
    "ripple-measure-chain": (55, (620, 1940, 4160, 3220)),
    # 线性稳压源
    "ldo-nmos-block": (21, (620, 620, 4160, 1730)),
    "ldo-fb-divider": (21, (620, 2860, 4160, 4180)),
    "ldo-nmos-iv": (22, (620, 590, 4160, 2180)),
    "ldo-pmos-topology": (23, (620, 730, 4160, 2210)),
    "ldo-pmos-iv": (23, (620, 2870, 4160, 4880)),
    "ldo-thermal-calc": (26, (620, 950, 4160, 4750)),
    "ldo-selection-table": (42, (620, 540, 4160, 2350)),
    "ldo-fixed-circuit": (42, (620, 2440, 4160, 3540)),
    "ldo-dropout-psrr": (44, (620, 550, 4160, 4150)),
    "ldo-params-table": (45, (620, 4100, 4160, 5770)),
    "ldo-power-circuit": (46, (620, 860, 4160, 2400)),
    "dcdc-ldo-model": (56, (620, 530, 4160, 1350)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 56:
        raise ValueError(f"Expected 56 JPG pages, found {len(pages)} in {source_dir}")

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
    parser = argparse.ArgumentParser(description="Build power article crops from chapter 3 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
