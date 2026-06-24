import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { BLUE, INK, MUTED, av, pctColor } from "../constants";

export const Mono = ({ children, style }) => <span style={{ fontFamily: "var(--mono)", ...style }}>{children}</span>;

export const Eyebrow = ({ children }) => <div className="eyebrow">{children}</div>;

export const Card = ({ children, className = "", style, pad = true }) => (
  <div className={"card " + className} style={{ ...(pad ? {} : { padding: 0 }), ...style }}>{children}</div>
);

export const CardHead = ({ title, sub, right }) => (
  <div className="card-head">
    <div>
      <div className="card-title">{title}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
    {right}
  </div>
);

export const Chip = ({ tone = "slate", children, icon: Icon }) => (
  <span className={"chip chip-" + tone}>{Icon && <Icon size={12} strokeWidth={2.4} />}{children}</span>
);

export const Btn = ({ children, variant = "ghost", size = "md", icon: Icon, onClick, style, disabled }) => (
  <button className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""}`} onClick={onClick} style={style} disabled={disabled}>
    {Icon && <Icon size={size === "sm" ? 14 : 15} strokeWidth={2.2} />}{children}
  </button>
);

export const Avatar = ({ n, size = 34, ring }) => (
  <img src={av(n || 1)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
    style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", background: "#dfe3ea",
      boxShadow: ring ? `0 0 0 2px #fff, 0 0 0 3px ${ring}` : "0 0 0 1px rgba(11,18,32,.06)" }} />
);

export const AvatarGroup = ({ ids, size = 28 }) => (
  <div style={{ display: "flex" }}>
    {ids.map((n, i) => <div key={i} style={{ marginLeft: i ? -10 : 0, position: "relative", zIndex: ids.length - i,
      borderRadius: "50%", boxShadow: "0 0 0 2px #fff" }}><Avatar n={n} size={size} /></div>)}
  </div>
);

export const Bar = ({ pct, color }) => (
  <div className="bar"><div className="bar-fill" style={{ width: pct + "%", background: color || BLUE }} /></div>
);

export const KPI = ({ label, value, unit, delta, up, icon: Icon, tone = BLUE, idx = 0 }) => (
  <Card className="kpi fade-up" style={{ animationDelay: idx * 60 + "ms" }}>
    <div className="kpi-top">
      <span className="kpi-ico" style={{ color: tone, background: tone + "14" }}><Icon size={17} strokeWidth={2.2} /></span>
      {delta != null && (
        <span className={"kpi-delta " + (up ? "up" : "down")}>
          {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{delta}
        </span>
      )}
    </div>
    <div className="kpi-val"><Mono>{value}</Mono>{unit && <span className="kpi-unit">{unit}</span>}</div>
    <div className="kpi-label">{label}</div>
  </Card>
);

export const Gauge = ({ value }) => {
  const c = pctColor(value);
  return (
    <div style={{ position: "relative", width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <RadialBarChart innerRadius="74%" outerRadius="100%" data={[{ v: value }]} startAngle={220} endAngle={-40}>
          <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={c} /><stop offset="100%" stopColor={c} stopOpacity={0.7} /></linearGradient></defs>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: "#EEF1F6" }} dataKey="v" cornerRadius={20} fill="url(#gg)" angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 10 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 30, fontWeight: 600, color: INK, lineHeight: 1 }}>{value}<span style={{ fontSize: 16, color: MUTED }}>%</span></div>
        <div style={{ fontSize: 11, color: MUTED, marginTop: 4, textTransform: "uppercase", letterSpacing: ".06em" }}>Overall</div>
      </div>
    </div>
  );
};

export const TipBox = ({ active, payload, label, unit = "%" }) =>
  active && payload && payload.length ? (
    <div style={{ background: INK, color: "#fff", padding: "7px 10px", borderRadius: 8, fontSize: 12, boxShadow: "0 8px 24px rgba(11,18,32,.28)" }}>
      <div style={{ opacity: .7, marginBottom: 2 }}>{label}</div>
      <Mono style={{ fontWeight: 600 }}>{payload[0].value}{unit}</Mono>
    </div>
  ) : null;

export const PageHead = ({ view, titles, right }) => {
  const [t, s] = titles[view] || ["", ""];
  return (
    <div className="page-head">
      <div>
        <h1 className="page-title">{t}</h1>
        <p className="page-sub">{s}</p>
      </div>
      <div className="page-actions">{right}</div>
    </div>
  );
};

export const Empty = ({ icon: Icon, t, s }) => (
  <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 24px" }}>
    <span style={{ width: 46, height: 46, borderRadius: 12, background: "var(--primary-soft)", color: BLUE, display: "grid", placeItems: "center", marginBottom: 14 }}><Icon size={22} /></span>
    <div style={{ fontWeight: 600, color: INK }}>{t}</div>
    <div style={{ color: MUTED, fontSize: 13, marginTop: 4, maxWidth: 360 }}>{s}</div>
  </Card>
);

export const Loading = ({ label = "Loading…" }) => (
  <Card style={{ textAlign: "center", color: MUTED, fontSize: 13, padding: "30px 0" }}>{label}</Card>
);
