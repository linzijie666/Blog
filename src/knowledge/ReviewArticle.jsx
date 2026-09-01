import ArticleShell from "./ArticleShell.jsx";
import { getArticleBySlug } from "./articles.js";
import CapacitorArticle from "./articles/CapacitorArticle.jsx";
import DiodeArticle from "./articles/DiodeArticle.jsx";
import DdrArticle from "./articles/DdrArticle.jsx";
import FerriteBeadArticle from "./articles/FerriteBeadArticle.jsx";
import FpgaArticle from "./articles/FpgaArticle.jsx";
import InductorArticle from "./articles/InductorArticle.jsx";
import LinearRegulatorArticle from "./articles/LinearRegulatorArticle.jsx";
import McuArticle from "./articles/McuArticle.jsx";
import MosfetArticle from "./articles/MosfetArticle.jsx";
import OptocouplerArticle from "./articles/OptocouplerArticle.jsx";
import ResistorArticle from "./articles/ResistorArticle.jsx";
import ResetWatchdogArticle from "./articles/ResetWatchdogArticle.jsx";
import SwitchingRegulatorArticle from "./articles/SwitchingRegulatorArticle.jsx";
import TriodeArticle from "./articles/TriodeArticle.jsx";
import PcbRoutingArticle from "./articles/PcbRoutingArticle.jsx";
import PcbDecouplingArticle from "./articles/PcbDecouplingArticle.jsx";
import PcbCopperPourArticle from "./articles/PcbCopperPourArticle.jsx";
import PcbGroundDesignArticle from "./articles/PcbGroundDesignArticle.jsx";
import PcbHighSpeedArticle from "./articles/PcbHighSpeedArticle.jsx";
import PcbFabHdiArticle from "./articles/PcbFabHdiArticle.jsx";
import PcbPowerLayoutArticle from "./articles/PcbPowerLayoutArticle.jsx";
import OpampBasicsArticle from "./articles/OpampBasicsArticle.jsx";
import OpampCircuitsArticle from "./articles/OpampCircuitsArticle.jsx";
import OpampAppsArticle from "./articles/OpampAppsArticle.jsx";
import AdcPrimerArticle from "./articles/AdcPrimerArticle.jsx";
import VrefPrecisionArticle from "./articles/VrefPrecisionArticle.jsx";
import IicSpiArticle from "./articles/IicSpiArticle.jsx";
import SetupHoldTimeArticle from "./articles/SetupHoldTimeArticle.jsx";
import Rs232Rs485Article from "./articles/Rs232Rs485Article.jsx";
import LvdsArticle from "./articles/LvdsArticle.jsx";
import GigabitEthernetArticle from "./articles/GigabitEthernetArticle.jsx";
import HdmiPcieUsbArticle from "./articles/HdmiPcieUsbArticle.jsx";
import PiPdnArticle from "./articles/PiPdnArticle.jsx";
import TransmissionLineTerminationArticle from "./articles/TransmissionLineTerminationArticle.jsx";
import SiMeasurementArticle from "./articles/SiMeasurementArticle.jsx";
import LengthMatchingArticle from "./articles/LengthMatchingArticle.jsx";
import SiRoutingArticle from "./articles/SiRoutingArticle.jsx";
import EyeDiagramJitterArticle from "./articles/EyeDiagramJitterArticle.jsx";

const articleBodies = {
  resistor: ResistorArticle,
  capacitor: CapacitorArticle,
  inductor: InductorArticle,
  "ferrite-bead": FerriteBeadArticle,
  diode: DiodeArticle,
  triode: TriodeArticle,
  optocoupler: OptocouplerArticle,
  mosfet: MosfetArticle,
  "switching-regulator": SwitchingRegulatorArticle,
  "linear-regulator": LinearRegulatorArticle,
  mcu: McuArticle,
  fpga: FpgaArticle,
  ddr: DdrArticle,
  "reset-watchdog": ResetWatchdogArticle,
  "pcb-routing": PcbRoutingArticle,
  "pcb-decoupling": PcbDecouplingArticle,
  "pcb-copper-pour": PcbCopperPourArticle,
  "pcb-ground-design": PcbGroundDesignArticle,
  "pcb-high-speed": PcbHighSpeedArticle,
  "pcb-fab-hdi": PcbFabHdiArticle,
  "pcb-power-layout": PcbPowerLayoutArticle,
  "opamp-basics": OpampBasicsArticle,
  "opamp-circuits": OpampCircuitsArticle,
  "opamp-apps": OpampAppsArticle,
  "adc-primer": AdcPrimerArticle,
  "vref-precision": VrefPrecisionArticle,
  "iic-spi": IicSpiArticle,
  "setup-hold-time": SetupHoldTimeArticle,
  "rs232-rs485": Rs232Rs485Article,
  lvds: LvdsArticle,
  "gigabit-ethernet": GigabitEthernetArticle,
  "hdmi-pcie-usb": HdmiPcieUsbArticle,
  "pi-pdn": PiPdnArticle,
  "transmission-line-termination": TransmissionLineTerminationArticle,
  "si-measurement": SiMeasurementArticle,
  "length-matching": LengthMatchingArticle,
  "si-routing": SiRoutingArticle,
  "eye-diagram-jitter": EyeDiagramJitterArticle
};

export default function ReviewArticle({ slug, email }) {
  const article = getArticleBySlug(slug);
  const ArticleBody = articleBodies[slug];
  if (!article || !ArticleBody) return null;

  return (
    <ArticleShell article={article} email={email}>
      <ArticleBody />
    </ArticleShell>
  );
}
