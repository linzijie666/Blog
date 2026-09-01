from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


# Source pages are 4762 x 6735. Crops intentionally retain labels and red callouts.
CROPS = {
    # PI / PDN
    "pdn-frequency-bands": (7, (650, 450, 4200, 3300)),
    "ssn-eye-comparison": (10, (350, 300, 4250, 2150)),
    "vsense-rk3588": (12, (350, 2800, 4300, 6100)),
    "vsense-tps548b28": (13, (600, 500, 4200, 4700)),
    "decoupling-capacitor-layout": (16, (350, 400, 4300, 6000)),
    "ground-partition": (17, (650, 2600, 4100, 5600)),
    "split-power-ferrite": (19, (550, 300, 4250, 6100)),
    # Transmission line / termination
    "transmission-line-model": (20, (400, 2500, 4250, 6000)),
    "microstrip-impedance": (22, (450, 400, 4250, 3400)),
    "reflection-ringing": (25, (500, 350, 4300, 6100)),
    "reflection-coefficient": (26, (500, 500, 4100, 4300)),
    "source-termination": (27, (500, 500, 4200, 5400)),
    "ddr-flyby-termination": (29, (450, 250, 4300, 6100)),
    "thevenin-termination": (30, (450, 400, 4250, 4200)),
    "rc-termination": (31, (450, 350, 4250, 5200)),
    "lvds-internal-termination": (34, (450, 350, 4200, 4100)),
    "ddr-odt-read-write": (35, (450, 350, 4250, 5200)),
    # SI measurement
    "rise-time-bandwidth": (37, (500, 300, 4200, 4400)),
    "clock-bandwidth-scope": (39, (450, 1800, 4300, 5900)),
    "one-sixth-wavelength": (40, (400, 1800, 4300, 6200)),
    "insertion-loss-distance": (42, (450, 350, 4250, 3400)),
    "vna-sparams-test": (43, (450, 350, 4300, 6000)),
    "tdr-impedance-profile": (44, (450, 600, 4250, 5200)),
    # Length matching
    "clock-data-setup-hold": (46, (450, 400, 4250, 4300)),
    "ddr-length-groups": (48, (450, 350, 4250, 5200)),
    "lpddr4-skew-table": (49, (450, 300, 4250, 3400)),
    "differential-skew-eyes": (55, (450, 1800, 4300, 6100)),
    "interpair-clock-matching": (57, (450, 300, 4250, 5600)),
    "embedded-clock-interfaces": (59, (450, 300, 4250, 5600)),
    "near-end-length-tuning": (63, (450, 300, 4250, 5600)),
    "meander-eye-comparison": (64, (450, 250, 4250, 6100)),
    "meander-spacing-rules": (66, (450, 2000, 4250, 6100)),
    # Routing path
    "interface-impedance-tables": (68, (450, 350, 4250, 5900)),
    "bga-breakout-impedance": (70, (450, 350, 4250, 5900)),
    "return-current-density": (71, (450, 350, 4250, 4300)),
    "stitching-via-return": (72, (450, 450, 4250, 5900)),
    "via-stub-backdrill": (74, (450, 350, 4250, 5700)),
    "blind-buried-vias": (75, (450, 300, 4250, 5400)),
    "pad-voiding": (76, (450, 300, 4250, 5900)),
    "differential-breakout-symmetry": (78, (450, 350, 4250, 5900)),
    "differential-spacing": (80, (450, 300, 4250, 4300)),
    "fpc-coax-twinax": (83, (450, 300, 4250, 6100)),
    "equalizer-redriver": (85, (450, 300, 4250, 5600)),
    "fiber-weave-effect": (86, (450, 350, 4250, 6000)),
    "pcb-impedance-test": (87, (450, 1900, 4250, 6100)),
    # Eye diagram / jitter / equalization
    "eye-overlay-patterns": (89, (450, 300, 4250, 5900)),
    "eye-height-width": (90, (450, 1700, 4250, 6000)),
    "isi-eye-closing": (91, (450, 2200, 4250, 6100)),
    "hdmi-eye-mask": (92, (450, 1300, 4250, 5900)),
    "isi-channel-loss": (94, (450, 350, 4250, 6100)),
    "receiver-equalization": (96, (450, 300, 4250, 6100)),
    "preemphasis-eye": (97, (450, 1800, 4250, 6100)),
    "deemphasis-eye": (98, (450, 350, 4250, 6000)),
}


def resized(image: Image.Image, longest_side: int) -> Image.Image:
    result = image.copy()
    result.thumbnail((longest_side, longest_side), Image.Resampling.LANCZOS)
    return result


def build_assets(source_dir: Path, output_dir: Path) -> None:
    pages = sorted(source_dir.glob("*.jpg"))
    if len(pages) != 98:
        raise ValueError(f"Expected 98 JPG pages, found {len(pages)} in {source_dir}")

    output_dir.mkdir(parents=True, exist_ok=True)
    for base_name, (page_number, box) in CROPS.items():
        with Image.open(pages[page_number - 1]) as page:
            crop = page.convert("RGB").crop(box)
            body = resized(crop, 1400)
            high_resolution = resized(crop, 2200)
            body.save(output_dir / f"{base_name}.webp", "WEBP", quality=84, method=6)
            high_resolution.save(output_dir / f"{base_name}-hd.jpg", "JPEG", quality=92, optimize=True, progressive=True)
            print(f"{base_name}: page {page_number}, body {body.width}x{body.height}, hd {high_resolution.width}x{high_resolution.height}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build SI/PI article crops from chapter 8 pages.")
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    build_assets(args.source_dir, args.output_dir)


if __name__ == "__main__":
    main()
