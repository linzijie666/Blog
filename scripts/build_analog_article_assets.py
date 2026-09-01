from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # 运放基础与选型
    "opamp-lm358-pinout": (5, (620, 2340, 4160, 3560)),
    "opamp-lm358-vos-datasheet": (3, (620, 1830, 4160, 2860)),
    "opamp-lt1678-vos-datasheet": (3, (620, 2700, 4160, 3620)),
    "opamp-lt1678-cover": (6, (620, 2230, 4160, 3470)),
    "opamp-openloop-gain": (6, (620, 3980, 4160, 5970)),
    "opamp-openloop-bode": (7, (620, 700, 4160, 3310)),
    "opamp-bias-current-table": (8, (620, 4110, 4160, 5120)),
    "opamp-slew-rate-response": (9, (620, 600, 4160, 2040)),
    "opamp-cmrr-psrr-freq": (10, (620, 480, 4160, 2130)),
    # 基本运算电路
    "gain-voltage-follower": (11, (620, 670, 4160, 1880)),
    "gain-noninverting-amp": (11, (620, 3450, 4160, 4630)),
    "gain-inverting-amp": (12, (620, 900, 4160, 2070)),
    "gain-summing-amp": (12, (620, 3600, 4160, 5060)),
    "gain-difference-amp": (13, (620, 1120, 4160, 2430)),
    "gain-differentiator": (14, (620, 1180, 4160, 3060)),
    "gain-differentiator-wave": (14, (620, 3770, 4160, 5330)),
    "gain-integrator": (15, (620, 250, 4160, 1620)),
    "gain-integrator-wave": (15, (620, 2960, 4160, 3980)),
    # 运放应用电路
    "app-cc-source-opamp": (16, (620, 2240, 4160, 3620)),
    "app-cc-source-mos": (17, (620, 480, 4160, 3310)),
    "app-range-shift-tl431": (17, (620, 4360, 4160, 5820)),
    "app-stm32-rain-table": (18, (620, 3540, 4160, 4710)),
    "app-ntc-rain-error": (19, (620, 510, 4160, 2100)),
    "app-ad5683-drive": (20, (620, 1010, 4160, 3370)),
    "app-dac-opamp-follower": (21, (620, 480, 4160, 2040)),
    # ADC 原理与选型
    "adc-sh-quantize-encode": (21, (620, 3890, 4160, 5380)),
    "adc-sampling-quantize-diagram": (22, (620, 1970, 4160, 3270)),
    "adc-transfer-curve-12bit": (23, (620, 480, 4160, 3530)),
    "adc-sar-architecture": (23, (620, 4930, 4160, 6200)),
    "adc-flash-architecture": (24, (620, 3380, 4160, 5630)),
    "adc-pipeline-architecture": (26, (620, 2120, 4160, 4430)),
    "adc-sigma-delta-architecture": (27, (620, 3770, 4160, 4750)),
    "adc-architecture-compare": (27, (620, 5300, 4160, 6180)),
    "adc-lsb-fsr-table": (29, (620, 1610, 4160, 2630)),
    "adc-offset-gain-error": (30, (620, 620, 4160, 3090)),
    "adc-enob-table": (31, (620, 1380, 4160, 2280)),
    "adc-bandwidth-vs-rate": (31, (620, 4820, 4160, 5690)),
    "adc-channel-interface": (32, (620, 530, 4160, 2570)),
    "adc-input-impedance": (34, (620, 530, 4160, 1900)),
    # 精度设计与基准源
    "vref-analog-digital-partition": (39, (620, 1080, 4160, 2830)),
    "vref-ldo-psrr": (38, (620, 2350, 4160, 5180)),
    "vref-single-vs-differential": (35, (620, 3400, 4160, 5140)),
    "vref-kelvin-ina240": (37, (620, 650, 4160, 2250)),
    "vref-rc-filter-ad7980": (37, (620, 3060, 4160, 4270)),
    "vref-offset-1p65-thevenin": (43, (620, 450, 4160, 2830)),
    "vref-flyback-tlv431": (43, (620, 3110, 4160, 4930)),
    "vref-digipot-lt6220": (44, (620, 1140, 4160, 2000)),
    "vref-pwm-rc-scope": (45, (620, 490, 4160, 2510)),
    "vref-tl431-pinout-app": (46, (620, 530, 4160, 2070)),
    "vref-tl431-internal": (46, (620, 2150, 4160, 3730)),
    "vref-tl431-12v-5v": (48, (620, 2890, 4160, 5630)),
    "vref-resistor-package-table": (49, (620, 800, 4160, 2140)),
    "vref-adr34xx-application": (50, (620, 3060, 4160, 4570)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 51:
        raise ValueError(f"Expected 51 JPG pages, found {len(pages)} in {source_dir}")

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
    parser = argparse.ArgumentParser(description="Build analog-devices article crops from chapter 6 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
