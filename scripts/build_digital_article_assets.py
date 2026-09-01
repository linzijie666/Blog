from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # 单片机
    "mcu-minimal-system": (5, (620, 2950, 4160, 5060)),
    "mcu-power-circuit": (6, (620, 1710, 4160, 3030)),
    "mcu-crystal-circuit": (7, (620, 680, 4160, 1370)),
    "mcu-reset-circuit": (7, (620, 3930, 4160, 5700)),
    "mcu-boot-swd": (8, (620, 1720, 4160, 3480)),
    "mcu-por-waveform": (10, (620, 1900, 4160, 3920)),
    "mcu-hse-params": (11, (620, 2200, 4160, 3860)),
    "mcu-boot-modes": (11, (620, 5150, 4160, 5970)),
    "mcu-swd-pins": (12, (620, 4010, 4160, 5040)),
    "mcu-datasheet-page": (14, (620, 2140, 4160, 5070)),
    "mcu-clock-tree": (63, (620, 540, 4160, 4260)),
    "crystal-photos": (57, (620, 3435, 4160, 4915)),
    "crystal-params": (57, (620, 5230, 4160, 5970)),
    # FPGA
    "soc-block-diagram": (20, (620, 1940, 4160, 4790)),
    "fpga-7series-table": (21, (620, 2500, 4160, 3420)),
    "fpga-zynq-architecture": (23, (620, 600, 4160, 3360)),
    "fpga-artix-power": (24, (620, 2620, 4160, 4970)),
    "fpga-cyclone-power": (25, (620, 720, 4160, 2560)),
    "fpga-jtag-circuit": (27, (620, 600, 4160, 2020)),
    "fpga-master-spi": (27, (620, 4520, 4160, 5270)),
    "fpga-config-arch": (28, (620, 660, 4160, 2540)),
    "fpga-mode-table": (28, (620, 4620, 4160, 5880)),
    "fpga-mode-circuit": (29, (620, 580, 4160, 1450)),
    "fpga-done-circuit": (29, (620, 3740, 4160, 5070)),
    "fpga-clock-region": (64, (620, 660, 4160, 2740)),
    "fpga-clock-hdmi": (64, (620, 3110, 4160, 5030)),
    # DDR
    "ddr-command-table": (32, (620, 2890, 4160, 4270)),
    "ddr-mode-register": (33, (620, 2960, 4160, 4020)),
    "ddr-ball-table": (35, (620, 2280, 4160, 5830)),
    "ddr-address-table": (36, (620, 2070, 4160, 2760)),
    "ddr-internal-block": (40, (620, 630, 4160, 2340)),
    "ddr-capacity-sdram": (39, (620, 2300, 4160, 4500)),
    "ddr-capacity-ddr3": (39, (620, 5250, 4160, 5825)),
    "ddr-capacity-ddr4": (40, (620, 3850, 4160, 4550)),
    "ddr-speedbin": (41, (620, 1660, 4160, 2550)),
    "ddr-routing-schematic": (43, (620, 590, 4160, 2700)),
    "ddr-pin-swap": (47, (620, 3520, 4160, 5120)),
    # 复位与看门狗 / 时钟方案
    "reset-rc-internal": (49, (620, 5330, 4160, 5960)),
    "max809-timing": (50, (620, 2100, 4160, 2710)),
    "max809-table": (50, (620, 3470, 4160, 4620)),
    "reset-cascade": (51, (620, 1340, 4160, 2310)),
    "watchdog-cn825-circuit": (51, (620, 3680, 4160, 4720)),
    "watchdog-tpv6823-app": (54, (620, 2570, 4160, 4320)),
    "watchdog-timing": (55, (620, 4750, 4160, 6060)),
    "watchdog-design-circuit": (56, (620, 2330, 4160, 3690)),
    "osc-active-circuit": (59, (620, 3340, 4160, 4330)),
    "quartz-params": (61, (620, 565, 4160, 2440)),
    "clock-buffer-diagram": (61, (620, 4680, 4160, 5690)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 66:
        raise ValueError(f"Expected 66 JPG pages, found {len(pages)} in {source_dir}")

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
    parser = argparse.ArgumentParser(description="Build digital-chip article crops from chapter 4 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
