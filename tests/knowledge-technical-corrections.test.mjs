import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readArticle = (name) =>
  readFile(new URL(`../src/knowledge/articles/${name}.jsx`, import.meta.url), "utf8");

test("high-risk design examples state the corrected electrical constraints", async () => {
  const [opampApps, adc, opampBasics, mosfet, ground, fpga, powerLayout, ldo, vref] =
    await Promise.all([
      readArticle("OpampAppsArticle"),
      readArticle("AdcPrimerArticle"),
      readArticle("OpampBasicsArticle"),
      readArticle("MosfetArticle"),
      readArticle("PcbGroundDesignArticle"),
      readArticle("FpgaArticle"),
      readArticle("PcbPowerLayoutArticle"),
      readArticle("LinearRegulatorArticle"),
      readArticle("VrefPrecisionArticle")
    ]);

  assert.match(opampApps, /RAIN 是允许的外部源阻抗/);
  assert.match(adc, /4\.2V 大于 4\.096V/);
  assert.match(opampBasics, /输出 ±20V/);
  assert.match(opampBasics, /12\.57V\/µs/);
  assert.match(opampApps, /LM358.*压摆率.*不能满足/s);
  assert.match(mosfet, /完整的 VDS-ID 轨迹/);
  assert.match(mosfet, /独立栅极电阻/);
  assert.match(ground, /连续地平面/);
  assert.match(fpga, /VCCINT.*VCCBRAM.*共用/s);
  assert.match(powerLayout, /上臂接稳压后的 VOUT/);
  assert.match(ldo, /ΨJT/);
  assert.match(vref, /采样电容建立时间/);

  assert.doesNotMatch(opampApps, /RAIN 的灌电流/);
  assert.doesNotMatch(ground, /保证两端等电位（0V 压差）/);
  assert.doesNotMatch(ldo, /T_J=70\+0\.85×15=82\.75°C/);
});

test("protocol, timing and converter fundamentals use the corrected definitions", async () => {
  const [eye, ethernet, uart, reset, mcu, ddr, adc, opamp, circuits, opto, si] =
    await Promise.all([
      readArticle("EyeDiagramJitterArticle"),
      readArticle("GigabitEthernetArticle"),
      readArticle("Rs232Rs485Article"),
      readArticle("ResetWatchdogArticle"),
      readArticle("McuArticle"),
      readArticle("DdrArticle"),
      readArticle("AdcPrimerArticle"),
      readArticle("OpampBasicsArticle"),
      readArticle("OpampCircuitsArticle"),
      readArticle("OptocouplerArticle"),
      readArticle("SiMeasurementArticle")
    ]);

  assert.match(eye, /UI=T_\{bit\}=1\/R_\{bit\}/);
  assert.match(ethernet, /4B5B/);
  assert.match(uart, /0,1,0,1,0,1,0,1/);
  assert.match(reset, /IWDG.*独立 LSI/s);
  assert.match(mcu, /LSI.*RTC/s);
  assert.match(mcu, /USART1.*不支持 USB DFU/s);
  assert.match(ddr, /tCCD_L.*同一 Bank Group/s);
  assert.match(adc, /7 个比较器.*8 个电阻/s);
  assert.match(adc, /量化分辨率/);
  assert.match(opamp, /输入折算/);
  assert.match(opamp, /开环.*fT.*闭环.*−3dB/s);
  assert.match(opamp, /VOUT\/AOL/);
  assert.match(circuits, /上升沿.*负尖峰.*下降沿.*正尖峰/s);
  assert.match(opto, /0x08.*0x77.*112/);
  assert.match(si, /并联电容.*负向反射/);
});

test("component-specific statements distinguish ratings, variants and polarity", async () => {
  const [apps, vref, mosfet, diode, opto] = await Promise.all([
    readArticle("OpampAppsArticle"),
    readArticle("VrefPrecisionArticle"),
    readArticle("MosfetArticle"),
    readArticle("DiodeArticle"),
    readArticle("OptocouplerArticle")
  ]);

  assert.match(apps, /4\.000/);
  assert.match(vref, /AD5683.*外部基准/s);
  assert.match(vref, /source.*sink/s);
  assert.match(mosfet, /VGS→0/);
  assert.match(diode, /5\.1V 稳压管/);
  assert.match(opto, /VCEO/);
  assert.match(opto, /VF、IF.*VR/s);
});

test("engineering heuristics are bounded by interface, device and stackup conditions", async () => {
  const [setupHold, ddr, length, routing, decoupling, hdmiUsb, hdi, powerLayout] =
    await Promise.all([
      readArticle("SetupHoldTimeArticle"),
      readArticle("DdrArticle"),
      readArticle("LengthMatchingArticle"),
      readArticle("PcbRoutingArticle"),
      readArticle("PcbDecouplingArticle"),
      readArticle("HdmiPcieUsbArticle"),
      readArticle("PcbFabHdiArticle"),
      readArticle("PcbPowerLayoutArticle")
    ]);

  assert.match(setupHold, /测量门限.*器件时序图/s);
  assert.match(setupHold, /保持违例.*降低频率.*不一定/s);
  assert.match(ddr, /初始化序列.*具体代际.*数据手册/s);
  assert.match(length, /CDR.*deskew.*偏斜预算/s);
  assert.match(routing, /3W.*经验规则.*层叠/s);
  assert.match(decoupling, /λ\/40.*经验估算.*安装电感/s);
  assert.match(hdmiUsb, /USB 2\.0.*不能.*AC 耦合/s);
  assert.match(hdi, /0\.8mm.*不等于.*必须使用 HDI/s);
  assert.match(powerLayout, /10mil.*1A.*经验值.*铜厚/s);
});
