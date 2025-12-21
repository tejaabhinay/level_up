function DnaBackground() {
  const helices = [
    { id: 1, centerX: 420, hue: 0, tilt: 0, opacity: 0.5 },
    { id: 2, centerX: 640, hue: 220, tilt: 25, opacity: 0.35 },
    { id: 3, centerX: 280, hue: 120, tilt: -20, opacity: 0.3 },
  ];

  return (
    <svg
      viewBox="0 0 1000 1400"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        animation: "dnaFloat 60s linear infinite",
      }}
    >
      {helices.map((h) => (
        <DNAHelix key={h.id} {...h} />
      ))}
    </svg>
  );
}

/* ===============================
   DNA HELIX (PURE, STATIC)
   =============================== */

function DNAHelix({ centerX, hue, tilt, opacity }) {
  const nucleotides = ["A", "T", "G", "C"];
  const amplitude = 140;
  const spacing = 40;
  const steps = 260;

  const points = Array.from({ length: steps }, (_, i) => {
    const y = i * spacing * 0.25;
    const angle = i * 0.35;
    const depth = (Math.cos(angle) + 1) / 2;

    return {
      x: centerX + Math.sin(angle) * amplitude,
      y,
      depth,
      r: 4 + depth * 5,
      opacity: (0.3 + depth * 0.7) * opacity,
      base: nucleotides[i % 4],
    };
  });

  return (
    <g transform={`rotate(${tilt} ${centerX} 700)`}>
      <defs>
        <radialGradient id={`dna-${hue}`}>
          <stop offset="0%" stopColor={`hsl(${hue},80%,65%)`} />
          <stop offset="70%" stopColor={`hsl(${hue},70%,45%)`} />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={`url(#dna-${hue})`}
            opacity={p.opacity}
          />
          <text
            x={p.x}
            y={p.y + 4}
            textAnchor="middle"
            fontSize={8 + p.depth * 6}
            fill={`hsla(${hue},100%,90%,${p.opacity})`}
            style={{ userSelect: "none" }}
          >
            {p.base}
          </text>
        </g>
      ))}
    </g>
  );
}

export default DnaBackground;
