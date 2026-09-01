from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # 走线规则
    "routing-3w-definition": (2, (620, 1580, 4160, 2860)),
    "routing-crosstalk-cases": (2, (620, 3840, 4160, 5330)),
    "routing-perpendicular-layers": (3, (620, 1580, 4160, 4160)),
    "routing-return-path": (4, (620, 500, 4160, 1390)),
    "routing-return-current-density": (4, (620, 3740, 4160, 6130)),
    "routing-cross-split-tdr": (5, (620, 3930, 4160, 5800)),
    "routing-stitching-cap": (6, (620, 2950, 4160, 4470)),
    "routing-right-angle-width": (7, (620, 1300, 4160, 2810)),
    "routing-arc-45deg": (7, (620, 3800, 4160, 5850)),
    # 去耦与时钟
    "decoupling-stm32-placement": (8, (620, 1720, 4160, 4390)),
    "decoupling-via-connection-abcd": (9, (620, 610, 4160, 2220)),
    "decoupling-bga-backside": (9, (620, 2620, 4160, 4010)),
    "decoupling-radius-layers": (10, (620, 545, 4160, 2630)),
    "clock-oscillator-schematic": (10, (620, 4330, 4160, 5500)),
    "clock-osc-params": (11, (620, 2010, 4160, 3300)),
    "clock-xtal-temp-curve": (11, (620, 3520, 4160, 5280)),
    "clock-crosstalk-glitch": (12, (620, 1260, 4160, 2270)),
    "clock-edge-overshoot": (12, (620, 2420, 4160, 4130)),
    "clock-emi-125mhz": (13, (620, 510, 4160, 3080)),
    # 铺铜与包地
    "copper-pour-reference-plane": (13, (620, 4560, 4160, 6180)),
    "copper-edge-plating": (14, (620, 900, 4160, 2000)),
    "copper-exposed-thermal-vias": (14, (620, 2420, 4160, 3960)),
    "copper-antenna-keepout": (14, (620, 4850, 4160, 6170)),
    "guard-trace-via-spacing": (15, (620, 1820, 4160, 3300)),
    "guard-coplanar-serdes": (15, (620, 4540, 4160, 5470)),
    "isolation-transformer-photos": (16, (620, 1750, 4160, 3240)),
    "isolation-transformer-keepout": (16, (620, 3850, 4160, 6120)),
    # 接地设计
    "ground-thermal-relief-pad": (17, (620, 1500, 4160, 2600)),
    "ground-thermal-spoke-detail": (17, (620, 2530, 4160, 3850)),
    "ground-solder-quality": (17, (620, 4760, 4160, 6020)),
    "ground-agnd-0ohm-schematic": (18, (620, 4140, 4160, 5440)),
    "ground-agnd-single-point": (19, (620, 500, 4160, 2260)),
    "ground-20h-diagram": (19, (620, 3040, 4160, 4160)),
    "ground-6layer-stackup-table": (20, (620, 545, 4160, 2370)),
    "ground-20h-flux-containment": (20, (620, 2950, 4160, 4130)),
    # 高速设计
    "hs-mipi-skew-table": (21, (620, 940, 4160, 2500)),
    "hs-ddr-serpentine": (21, (620, 2700, 4160, 4870)),
    "hs-serpentine-3w-spacing": (22, (620, 530, 4160, 1390)),
    "hs-local-vs-remote-matching": (22, (620, 1500, 4160, 2740)),
    "hs-eye-diagram-compare": (23, (620, 510, 4160, 3340)),
    "hs-diffpair-s1-2s": (23, (620, 3780, 4160, 4870)),
    "hs-eda-serpentine-constant-gap": (24, (620, 560, 4160, 2500)),
    "hs-jlc-4layer-stackup": (25, (620, 530, 4160, 2740)),
    "hs-jlc-6layer-stackup": (25, (620, 3390, 4160, 6060)),
    "hs-microstrip-model": (26, (620, 1750, 4160, 3760)),
    # 加工工艺与板型
    "fab-via-inner-outer": (27, (620, 3050, 4160, 4200)),
    "fab-min-hole-tables": (27, (620, 1430, 4160, 2350)),
    "fab-min-trace-tables": (27, (620, 4280, 4160, 6250)),
    "fab-trace-spacing-labels": (28, (620, 880, 4160, 2200)),
    "fab-bga-through-fanout": (29, (620, 1750, 4160, 4380)),
    "fab-hi3559-hdi": (29, (620, 4490, 4160, 6010)),
    "fab-hdi-blind-buried": (30, (620, 880, 4160, 2170)),
    "fab-via-types-3d": (30, (620, 2860, 4160, 4900)),
    # 电源 Layout 与通流
    "power-rt6253-guidelines": (31, (620, 1430, 4160, 3060)),
    "power-rt6253-layout-fig14": (31, (620, 3330, 4160, 5090)),
    "power-trace-current-calc": (32, (620, 1510, 4160, 2900)),
    "power-via-current-sharing": (32, (620, 3780, 4160, 5780)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 32:
        raise ValueError(f"Expected 32 JPG pages, found {len(pages)} in {source_dir}")

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
    parser = argparse.ArgumentParser(description="Build pcb-layout article crops from chapter 5 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
