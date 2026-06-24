import React from "react";
import { CalendarDays, Download, Users, UserCheck, AlertTriangle, Award, MoreHorizontal } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, KPI, TipBox, PageHead, Mono, Avatar, Bar } from "../components/primitives.jsx";
import { BLUE, GREEN, AMBER, COPPER, RED, GRID, MUTED, INK, TITLES } from "../constants";

const BAND_DEFS = [
  ["≥ 90%", "ge90", GREEN],
  ["75–90%", "75to90", BLUE],
  ["60–75%", "60to75", AMBER],
  ["< 60%", "lt60", RED],
];

export default function HODDashboard() {
  const { data: overview } = useApi("/reports/overview");
  const { data: trend } = useApi("/attendance/trend");
  const { data: faculty } = useApi("/reports/faculty-performance");

  const bands = overview?.bands || {};
  const maxBand = Math.max(1, ...BAND_DEFS.map(([, key]) => bands[key] || 0));
  const facultyOntime = (faculty || []).length
    ? Math.round((faculty.reduce((a, f) => a + f.ontime, 0) / faculty.length))
    : 0;

  return (
    <>
      <PageHead view="dash" titles={TITLES} right={<><Btn icon={CalendarDays} variant="ghost" size="sm">This semester</Btn><Btn icon={Download} variant="primary" size="sm">Department report</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Department attendance" value={overview?.deptAttendancePct ?? "—"} unit="%" icon={Users} tone={BLUE} />
        <KPI idx={1} label="Faculty on-time" value={facultyOntime} unit="%" icon={UserCheck} tone={GREEN} />
        <KPI idx={2} label="Low-attendance students" value={overview?.lowAttendance ?? "—"} icon={AlertTriangle} tone={AMBER} />
        <KPI idx={3} label="Placement offers" value={overview?.totalOffers ?? "—"} icon={Award} tone={COPPER} />
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <Card>
          <CardHead title="Department attendance trend" sub="All VLSI cohorts · last 8 weeks" right={<Chip tone="blue">Live</Chip>} />
          <div style={{ height: 240, marginTop: 6 }}>
            <ResponsiveContainer>
              <BarChart data={trend || []} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <Tooltip content={<TipBox />} cursor={{ fill: "rgba(66,99,255,.06)" }} />
                <RBar dataKey="a" radius={[6, 6, 0, 0]} maxBarSize={56} fill={BLUE} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Attendance distribution" sub="Students by band" />
          <div className="dist-list">
            {BAND_DEFS.map(([t, key, c]) => (
              <div key={key} className="dist-row">
                <span className="dist-t">{t}</span>
                <div className="dist-bar"><div style={{ width: ((bands[key] || 0) / maxBand * 100) + "%", background: c, height: "100%", borderRadius: 6 }} /></div>
                <Mono style={{ width: 28, textAlign: "right", color: INK }}>{bands[key] || 0}</Mono>
              </div>
            ))}
          </div>
          <div className="dist-foot"><Mono style={{ fontSize: 22, fontWeight: 600, color: INK }}>{overview?.totalStudents ?? "—"}</Mono><span>students enrolled · VLSI</span></div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }} pad={false}>
        <div style={{ padding: "18px 20px 0" }}><CardHead title="Faculty performance" sub="On-time marking &amp; sessions delivered" right={<Btn variant="ghost" size="sm" icon={MoreHorizontal} />} /></div>
        <table className="tbl">
          <thead><tr><th>Faculty</th><th>Sessions</th><th>On-time</th><th>Marking compliance</th></tr></thead>
          <tbody>
            {(faculty || []).map((f) => (
              <tr key={f.n}>
                <td><div className="tcell-user"><Avatar n={f.avatarSeed} size={32} /><div><div className="tc-n">{f.n}</div></div></div></td>
                <td><Mono>{f.cls}</Mono></td>
                <td><Mono style={{ color: f.ontime >= 95 ? GREEN : AMBER }}>{f.ontime}%</Mono></td>
                <td style={{ width: 220 }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Bar pct={f.ontime} color={f.ontime >= 95 ? GREEN : AMBER} /><Mono style={{ fontSize: 12, color: MUTED }}>{f.ontime}%</Mono></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
