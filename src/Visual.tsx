// Small hand-drawn style diagrams for each project. These are illustrations of how
// each project works, not real data.

const Box = ({ x, y, w, label, accent }: { x: number; y: number; w: number; label: string; accent?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height={34} rx={9} className={accent ? "v-box v-accent" : "v-box"} />
    <text x={x + w / 2} y={y + 21} textAnchor="middle" className={accent ? "v-label v-label-accent" : "v-label"}>
      {label}
    </text>
  </g>
);

const Arrow = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} className="v-line" markerEnd="url(#arrow)" />
);

const Defs = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" className="v-arrowhead" />
    </marker>
  </defs>
);

function Flow({ steps, accentIndex }: { steps: string[]; accentIndex: number }) {
  const w = 79;
  const gap = (340 - steps.length * w) / (steps.length - 1);
  return (
    <>
      {steps.map((s, i) => {
        const x = i * (w + gap);
        return (
          <g key={s}>
            <Box x={x} y={53} w={w} label={s} accent={i === accentIndex} />
            {i < steps.length - 1 && <Arrow x1={x + w + 3} y1={70} x2={x + w + gap - 3} y2={70} />}
          </g>
        );
      })}
    </>
  );
}

function Duplicates() {
  const copies = [0, 1, 2, 3, 4];
  return (
    <>
      <Box x={0} y={53} w={86} label="1 real asset" accent />
      {copies.map((i) => (
        <g key={i}>
          <Arrow x1={90} y1={70} x2={196} y2={14 + i * 25} />
          <rect x={200} y={2 + i * 25} width={140} height={22} rx={6} className="v-box" />
          <text x={270} y={17 + i * 25} textAnchor="middle" className="v-label v-small">
            record #{i + 1}
          </text>
        </g>
      ))}
    </>
  );
}

function Bars() {
  // Illustrative shapes only, no real values.
  const h = [38, 62, 48, 80, 56, 94, 70];
  return (
    <>
      <line x1={0} y1={126} x2={340} y2={126} className="v-line" />
      {h.map((v, i) => (
        <rect key={i} x={14 + i * 46} y={126 - v} width={28} height={v} rx={5} className={i === 5 ? "v-bar v-bar-accent" : "v-bar"} />
      ))}
    </>
  );
}

function Crowd() {
  // A dense cluster gets the full physics (accent), sparse dots stay cheap.
  const dots: { x: number; y: number; dense: boolean }[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * 34;
    dots.push({ x: 110 + Math.cos(a) * r, y: 70 + Math.sin(a) * r, dense: true });
  }
  for (let i = 0; i < 16; i++) dots.push({ x: 180 + rnd() * 150, y: 12 + rnd() * 116, dense: false });
  return (
    <>
      <circle cx={110} cy={70} r={46} className="v-heat" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.dense ? 3.2 : 2.6} className={d.dense ? "v-dot v-dot-accent" : "v-dot"} />
      ))}
      <text x={110} y={136} textAnchor="middle" className="v-label v-small">dense: full physics</text>
      <text x={255} y={136} textAnchor="middle" className="v-label v-small">sparse: almost free</text>
    </>
  );
}

function Phone({ rows }: { rows: string[] }) {
  return (
    <>
      <rect x={120} y={2} width={100} height={136} rx={16} className="v-box" />
      <rect x={155} y={9} width={30} height={4} rx={2} className="v-bar" />
      {rows.map((r, i) => (
        <g key={r}>
          <rect x={130} y={22 + i * 28} width={80} height={22} rx={6} className={i === 0 ? "v-box v-accent" : "v-box"} />
          <text x={170} y={37 + i * 28} textAnchor="middle" className={i === 0 ? "v-label v-small v-label-accent" : "v-label v-small"}>
            {r}
          </text>
        </g>
      ))}
    </>
  );
}

const visuals: Record<string, { title: string; body: () => React.ReactElement }> = {
  "311": { title: "How a 311 request gets routed", body: () => <Flow steps={["311 request", "REST API", "Local LLM", "Right staff"]} accentIndex={2} /> },
  duplicates: { title: "One asset, recorded many times", body: Duplicates },
  dashboards: { title: "Request in, dashboard out", body: Bars },
  aislopguard: { title: "Photo to verdict", body: () => <Flow steps={["Phone app", "FastAPI", "ONNX model", "Real or AI?"]} accentIndex={2} /> },
  crowdsim: { title: "Physics where the crowd is", body: Crowd },
  socialdist: { title: "Request path", body: () => <Flow steps={["Browser", "REST API", "Backend", "SQL"]} accentIndex={1} /> },
  moodspace: { title: "Mood log", body: () => <Phone rows={["Today: calm", "Yesterday", "Filter", "Privacy"]} /> },
};

export default function Visual({ id }: { id: string }) {
  const v = visuals[id];
  if (!v) return null;
  const Body = v.body;
  return (
    <figure className="visual">
      <svg viewBox="-4 -4 348 148" role="img" aria-label={v.title}>
        <Defs />
        <Body />
      </svg>
      <figcaption>{v.title}</figcaption>
    </figure>
  );
}
