import React from "react";
import {
  Filter, Download, GraduationCap, Users, Building2, UserCheck, ClipboardCheck, CalendarDays,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Btn, TipBox, PageHead } from "../components/primitives.jsx";
import { COPPER, GRID, MUTED, INK, TITLES } from "../constants";

const REPORTS = [
  { t: "Individual student report", s: "Per-student register & trend", icon: GraduationCap, c: "#4263FF" },
  { t: "Class report", s: "Section-wise attendance summary", icon: Users, c: "#15A05A" },
  { t: "Department report", s: "All cohorts, KPIs & charts", icon: Building2, c: COPPER },
  { t: "Faculty report", s: "Marking compliance & punctuality", icon: UserCheck, c: "#8B5CF6" },
  { t: "Attendance register", s: "Statutory register, date-wise", icon: ClipboardCheck, c: "#0EA5E9" },
  { t: "Semester report", s: "Eligibility & consolidated marks", icon: CalendarDays, c: "#D98A0B" },
];

export default function Reports() {
  const { data: trend } = useApi("/attendance/trend");

  return (
    <>
      <PageHead view="reports" titles={TITLES} right={<><Btn icon={Filter} variant="ghost" size="sm">Date range</Btn><Btn icon={Download} variant="primary" size="sm">Generate all</Btn></>} />
      <div className="grid g3" style={{ marginTop: 16 }}>
        {REPORTS.map((r, i) => (
          <Card key={i} className="fade-up" style={{ animationDelay: i * 45 + "ms" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <span style={{ width: 42, height: 42, borderRadius: 11, background: r.c + "16", color: r.c, display: "grid", placeItems: "center" }}><r.icon size={20} /></span>
            </div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: INK, marginTop: 13 }}>{r.t}</div>
            <div style={{ fontSize: 12.5, color: MUTED, marginTop: 4, minHeight: 34 }}>{r.s}</div>
            <div style={{ display: "flex", gap: 7, marginTop: 12, paddingTop: 13, borderTop: "1px solid var(--line-2)" }}>
              {["PDF", "Excel", "CSV"].map((f) => (
                <button key={f} className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center", gap: 5 }}><Download size={12} />{f}</button>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ marginTop: 16 }}>
        <CardHead title="Department attendance overview" sub="Auto-generated · last 8 weeks" right={<Btn variant="ghost" size="sm" icon={Download}>Export PDF</Btn>} />
        <div style={{ height: 240, marginTop: 6 }}>
          <ResponsiveContainer>
            <AreaChart data={trend || []} margin={{ left: -18, right: 8, top: 8 }}>
              <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COPPER} stopOpacity={0.26} /><stop offset="100%" stopColor={COPPER} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
              <Tooltip content={<TipBox />} />
              <Area type="monotone" dataKey="a" stroke={COPPER} strokeWidth={2.4} fill="url(#rg)" dot={{ r: 3, fill: COPPER, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
