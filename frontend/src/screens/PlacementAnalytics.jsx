import React from "react";
import { CalendarDays, Download, Award, GraduationCap, TrendingUp, Activity, MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, KPI, TipBox, Avatar, Mono, PageHead } from "../components/primitives.jsx";
import { BLUE, GREEN, COPPER, AMBER, GRID, MUTED, INK, TITLES } from "../constants";

const PKG_C = ["#BBD0FF", "#4263FF", "#1E2A6B", "#E0853D"];

export default function PlacementAnalytics() {
  const { data: placed } = useApi("/placements");
  const { data: companies } = useApi("/placements/companies");

  const placedList = placed || [];
  const companyList = companies || [];
  const totalOffers = companyList.reduce((a, c) => a + c.offers, 0);
  const ctcValues = placedList.map((p) => parseFloat(p.ctc) || 0);
  const highestCtc = ctcValues.length ? Math.max(...ctcValues) : 0;
  const avgCtc = ctcValues.length ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(1) : 0;

  const pkgBands = [
    { name: "12–18 LPA", value: ctcValues.filter((c) => c >= 12 && c < 18).length },
    { name: "18–24 LPA", value: ctcValues.filter((c) => c >= 18 && c < 24).length },
    { name: "24–30 LPA", value: ctcValues.filter((c) => c >= 24 && c < 30).length },
    { name: "30+ LPA", value: ctcValues.filter((c) => c >= 30).length },
  ].filter((b) => b.value > 0);

  const offerTrendByYear = [{ y: new Date().getFullYear().toString(), o: placedList.length }];

  return (
    <>
      <PageHead view="placement" titles={TITLES} right={<><Btn icon={CalendarDays} variant="ghost" size="sm">This batch</Btn><Btn icon={Download} variant="primary" size="sm">Placement report</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Total offers" value={totalOffers} icon={Award} tone={BLUE} />
        <KPI idx={1} label="Recently placed" value={placedList.length} icon={GraduationCap} tone={GREEN} />
        <KPI idx={2} label="Highest CTC" value={highestCtc || "—"} unit="LPA" icon={TrendingUp} tone={COPPER} />
        <KPI idx={3} label="Average CTC" value={avgCtc || "—"} unit="LPA" icon={Activity} tone={AMBER} />
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <Card>
          <CardHead title="Offers this cycle" sub="VLSI department" right={<Chip tone="green" icon={TrendingUp}>Live</Chip>} />
          <div style={{ height: 240, marginTop: 6 }}>
            <ResponsiveContainer>
              <LineChart data={offerTrendByYear} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="y" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <Tooltip content={<TipBox unit="" />} />
                <Line type="monotone" dataKey="o" stroke={BLUE} strokeWidth={2.6} dot={{ r: 4, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Package bands" sub="Offer distribution" />
          {pkgBands.length > 0 ? (
            <>
              <div style={{ height: 170, marginTop: 4 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pkgBands} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={2} stroke="none">
                      {pkgBands.map((e, i) => <Cell key={i} fill={PKG_C[i % PKG_C.length]} />)}
                    </Pie>
                    <Tooltip content={<TipBox unit="" />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginTop: 6 }}>
                {pkgBands.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, padding: "4px 0" }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: PKG_C[i % PKG_C.length] }} />
                    <span style={{ flex: 1, color: MUTED }}>{b.name}</span>
                    <Mono style={{ color: INK, fontWeight: 600 }}>{b.value}</Mono>
                  </div>
                ))}
              </div>
            </>
          ) : <div style={{ color: MUTED, fontSize: 13, padding: "30px 0", textAlign: "center" }}>No placements recorded yet.</div>}
        </Card>
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        <Card>
          <CardHead title="Top recruiters" sub="By offers made this cycle" right={<Btn variant="ghost" size="sm" icon={MoreHorizontal} />} />
          <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
            {companyList.map((c, i) => (
              <div key={i} className="co-tile">
                <span className="co-mark" style={{ background: c.c }}>{c.n[0]}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{c.n}</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>Top CTC <Mono>{c.ctc}</Mono></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Mono style={{ fontSize: 16, fontWeight: 600, color: INK }}>{c.offers}</Mono>
                  <div style={{ fontSize: 11, color: MUTED }}>offers</div>
                </div>
              </div>
            ))}
            {companyList.length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No recruiter activity yet.</div>}
          </div>
        </Card>
        <Card pad={false}>
          <div style={{ padding: "18px 20px 0" }}><CardHead title="Recently placed" sub="Confirmed offers" right={<Chip tone="green">Confirmed</Chip>} /></div>
          <table className="tbl">
            <thead><tr><th>Student</th><th>Company</th><th>CTC</th></tr></thead>
            <tbody>
              {placedList.map((p, i) => (
                <tr key={i}>
                  <td><div className="tcell-user"><Avatar n={p.avatarSeed} size={32} /><div><div className="tc-n">{p.n}</div><div className="tc-s">{p.role}</div></div></div></td>
                  <td style={{ fontWeight: 500 }}>{p.co}</td>
                  <td><Mono style={{ color: GREEN, fontWeight: 600 }}>{p.ctc}</Mono></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
