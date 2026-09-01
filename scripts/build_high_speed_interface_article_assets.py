from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


CROPS = {
    # IIC 与 SPI
    "iic-threshold-table": (4, (700, 2870, 4180, 3730)),
    "iic-frame-protocol": (7, (420, 1430, 3860, 2200)),
    "iic-start-stop-wave": (7, (420, 2260, 3860, 3620)),
    "iic-data-valid-wave": (8, (350, 340, 3800, 2050)),
    "iic-multi-at24c256": (9, (420, 1300, 3800, 3420)),
    "iic-nsi8100": (10, (620, 1150, 3700, 2500)),
    "iic-rc-model": (11, (620, 1150, 3700, 2920)),
    "spi-connection": (12, (700, 4880, 3200, 5980)),
    "spi-cpol-cpha": (13, (420, 2500, 3900, 4300)),
    "spi-ad5683-block": (15, (620, 950, 3600, 2880)),
    "spi-w5500-block": (15, (480, 3470, 3900, 5920)),
    "spi-w5500-timing": (16, (480, 830, 3900, 3300)),
    "spi-stm32-w25q": (17, (350, 2650, 4000, 5480)),
    "spi-multi-slave": (19, (700, 950, 3700, 2500)),
    # 建立时间保持时间与测量仪器
    "setup-hold-annotation": (20, (350, 2130, 4000, 4640)),
    "setup-hold-ch390": (21, (420, 830, 3700, 3300)),
    "scope-logic-analyzer": (23, (620, 380, 3900, 3220)),
    # RS232 与 RS485
    "rs232-wiring": (25, (420, 340, 3900, 2100)),
    "rs232-sp3232": (26, (350, 340, 4180, 3750)),
    "rs232-waveform": (27, (700, 3500, 4080, 5000)),
    "rs485-sp3485": (29, (476, 3430, 4230, 4790)),
    "rs485-pinout": (30, (700, 1600, 3520, 2900)),
    "rs485-threshold-table": (29, (620, 2180, 4080, 2600)),
    "rs485-waveform": (31, (350, 340, 4180, 3020)),
    # 差分信号与 LVDS
    "diff-single-wave": (34, (620, 540, 4050, 1330)),
    "diff-pair-wave": (34, (476, 2330, 4050, 3030)),
    "diff-anti-interference": (35, (780, 1560, 2280, 3260)),
    "lvds-current-model": (38, (820, 2510, 3900, 4440)),
    "lvds-waveform": (39, (420, 340, 3900, 2560)),
    "lvds-dc-spec": (40, (420, 340, 3900, 2560)),
    "lvds-xilinx-table": (43, (480, 1740, 3900, 3230)),
    "lvds-ads6445-current": (43, (480, 4030, 3600, 6130)),
    "lvds-eq-eye": (44, (420, 3140, 3900, 5460)),
    # 千兆网接口
    "gige-topology": (46, (620, 1740, 4180, 4060)),
    "gige-rtl8211-arch": (46, (780, 4300, 3700, 6230)),
    "gige-yt8531-schematic": (47, (350, 870, 4180, 4920)),
    "gige-rgmii-2ns": (48, (480, 340, 3600, 2620)),
    "gige-mdio-table": (48, (620, 3150, 4180, 4260)),
    "gige-pam5-wave": (49, (420, 2940, 3600, 4470)),
    "gige-rj45-t568b": (50, (480, 1130, 2900, 2830)),
    "gige-transformer-rj45": (50, (350, 2940, 4600, 4950)),
    "gige-integrated-magnetics": (51, (420, 1190, 4180, 3580)),
    "gige-rgmii-pcb-table": (53, (420, 1130, 4180, 2560)),
    "gige-transformer-keepout": (53, (350, 5320, 2400, 6450)),
    # HDMI、PCIE 与 USB
    "hdmi-soc-schematic": (55, (350, 1040, 4300, 4060)),
    "hdmi-tmds-topology": (56, (820, 700, 3500, 2560)),
    "hdmi-rate-table": (57, (476, 3830, 3500, 4680)),
    "hdmi-pcb-table": (59, (420, 340, 4300, 1760)),
    "pcie-gen-table": (60, (420, 4550, 3900, 5620)),
    "pcie-edge-schematic": (61, (350, 3100, 4600, 6100)),
    "pcie-power-table": (62, (420, 580, 3600, 1950)),
    "pcie-ac-coupling": (63, (350, 380, 2750, 1420)),
    "usb3-schematic": (63, (500, 4130, 4360, 5660)),
    "usb-mt9700": (64, (420, 1460, 3600, 3180)),
    "usb-pcb-table": (65, (420, 1930, 4300, 3050)),
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
    parser = argparse.ArgumentParser(description="Build high-speed-interfaces article crops from chapter 7 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
