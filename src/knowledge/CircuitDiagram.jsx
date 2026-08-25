const diagramCopy = {
  divider: {
    title: "电阻分压与采样",
    nodes: ["VIN", "R1", "VOUT", "R2", "GND"]
  },
  decoupling: {
    title: "芯片电源去耦回路",
    nodes: ["VCC", "走线/过孔", "CDEC", "IC", "GND"]
  },
  buck: {
    title: "Buck 输出电感",
    nodes: ["SW", "L", "VOUT", "COUT", "LOAD"]
  },
  ferrite: {
    title: "磁珠 π 型滤波",
    nodes: ["VIN", "CIN", "FB", "COUT", "VLOAD"]
  }
};

export default function CircuitDiagram({ variant }) {
  const diagram = diagramCopy[variant];

  return (
    <figure className="circuit-diagram">
      <svg viewBox="0 0 760 210" role="img" aria-labelledby={`${variant}-title ${variant}-desc`}>
        <title id={`${variant}-title`}>{diagram.title}</title>
        <desc id={`${variant}-desc`}>{diagram.nodes.join("，")}</desc>
        <path className="circuit-line" d="M70 105 H690" />
        {diagram.nodes.map((node, index) => {
          const x = 70 + index * 155;
          return (
            <g key={node} transform={`translate(${x} 105)`}>
              <circle r="22" />
              <text y="6" textAnchor="middle">{index + 1}</text>
              <text className="circuit-label" y={index % 2 ? -44 : 58} textAnchor="middle">
                {node}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>{diagram.title}：编号节点按能量或噪声电流的传播方向排列。</figcaption>
    </figure>
  );
}
