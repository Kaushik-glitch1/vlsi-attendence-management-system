import React from "react";
import {
  Download, QrCode, AlertTriangle, CalendarCheck, Activity, Clock, ListChecks,
  TrendingUp, Filter, Check,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
} from "recharts";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, KPI, Gauge, TipBox, PageHead, Mono, Bar } from "../components/primitives.jsx";
import Heatmap from "../components/Heatmap.jsx";
import { BLUE, GREEN, AMBER, COPPER, GRID, MUTED, INK, TITLES, pctColor, img, PHOTO } from "../constants";

export default function StudentDashboard() {
  const { data: profile } = useApi("/students/me");
  const { data: subjects } = useApi("/attendance/subjects");
  const { data: trend } = useApi("/attendance/trend");
  const { data: today } = useApi("/attendance/today");
  const { data: heatmap } = useApi("/attendance/heatmap");
  const { data: leave } = useApi("/leave");
  const { data: projects } = useApi("/projects");

  const subjList = subjects || [];
  const atRisk = subjList.filter((s) => s.pct < 75);
  const overallPct = profile?.overallPct ?? 0;
  const pendingLeave = (leave || []).filter((l) => l.status === "PENDING").length;
  const lastWeek = (trend || [])[trend?.length - 1]?.a;

  return (
    <>
      <PageHead view="dash" titles={TITLES} right={<><Btn icon={Download} variant="ghost" size="sm">Export</Btn><Btn icon={QrCode} variant="primary" size="sm">Scan to mark</Btn></>} />

      {atRisk.length > 0 && (
        <div className="alert-bar fade-up">
          <span className="alert-ico"><AlertTriangle size={18} /></span>
          <div style={{ flex: 1 }}>
            <strong>Attendance shortage in {atRisk.length} course{atRisk.length > 1 ? "s" : ""}.</strong> {atRisk.map((s) => s.name).join(", ")} {atRisk.length > 1 ? "are" : "is"} below the 75% threshold required to sit the end-semester exam.
          </div>
          <Btn variant="danger" size="sm">Request review</Btn>
        </div>
      )}

      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Overall attendance" value={overallPct} unit="%" icon={CalendarCheck} tone={GREEN} />
        <KPI idx={1} label="Latest week" value={lastWeek ?? "—"} unit={lastWeek != null ? "%" : ""} icon={Activity} tone={BLUE} />
        <KPI idx={2} label="Classes today" value={(today || []).length} icon={Clock} tone={COPPER} />
        <KPI idx={3} label="Pending leave" value={pendingLeave} icon={ListChecks} tone={AMBER} />
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <Card>
          <CardHead title="Attendance trend" sub="Weekly attendance · current semester" right={<Chip tone="green" icon={TrendingUp}>Healthy</Chip>} />
          <div style={{ height: 230, marginTop: 6 }}>
            <ResponsiveContainer>
              <AreaChart data={trend || []} margin={{ left: -18, right: 6, top: 6 }}>
                <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.28} /><stop offset="100%" stopColor={BLUE} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <Tooltip content={<TipBox />} />
                <Area type="monotone" dataKey="a" stroke={BLUE} strokeWidth={2.4} fill="url(#ar)" dot={{ r: 3, fill: BLUE, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Standing" sub="Eligibility status" />
          <Gauge value={overallPct} />
          <div className="standing-rows">
            <div><span>Required</span><Mono>75%</Mono></div>
            <div><span>Buffer</span><Mono style={{ color: overallPct >= 75 ? GREEN : "#DC3A3A" }}>{overallPct - 75 >= 0 ? "+" : ""}{overallPct - 75}%</Mono></div>
          </div>
        </Card>
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <Card>
          <CardHead title="Subject-wise attendance" sub="Per-course percentage this semester" right={<Btn variant="ghost" size="sm" icon={Filter}>Filter</Btn>} />
          <div className="subj-list">
            {subjList.map((s) => (
              <div key={s.code} className="subj">
                <div className="subj-code"><Mono>{s.code}</Mono></div>
                <div className="subj-name">{s.name}</div>
                <div className="subj-bar"><Bar pct={s.pct} color={pctColor(s.pct)} /></div>
                <div className="subj-pct" style={{ color: pctColor(s.pct) }}><Mono>{s.pct}%</Mono></div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Today" sub="Today's timetable" />
          <div className="today-list">
            {(today || []).length === 0 && <div style={{ color: MUTED, fontSize: 13, padding: "12px 0" }}>No classes scheduled today.</div>}
            {(today || []).map((c) => (
              <div key={c.id} className="today-row">
                <Mono className="today-t">{c.t}</Mono>
                <span className={"today-line " + (c.status === "PRESENT" ? "done" : "")} />
                <div style={{ flex: 1 }}>
                  <div className="today-name">{c.name}</div>
                  <div className="today-meta"><Mono>{c.code}</Mono> · {c.room} · {c.fac}</div>
                </div>
                {c.status === "PRESENT"
                  ? <Chip tone="green" icon={Check}>Present</Chip>
                  : <Chip tone="slate">Upcoming</Chip>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ marginTop: 16 }}>
        <CardHead title="Attendance heatmap" sub="Last 16 weeks · daily attendance" right={<Chip tone="blue">Semester {profile?.semester ?? "—"}</Chip>} />
        <div style={{ marginTop: 10 }}><Heatmap days={heatmap || []} /></div>
      </Card>

      <div className="grid g3" style={{ marginTop: 16 }}>
        {(projects || []).slice(0, 3).map((p) => (
          <Card key={p.id} pad={false} className="proj-mini">
            <span style={{ display: "block", height: 96, background: "#0e1730", position: "relative", overflow: "hidden" }}>
              <img src={img(PHOTO[p.img] || PHOTO.code, 480, 200)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
            <div style={{ padding: 14 }}>
              <Chip tone="blue">{p.stage}</Chip>
              <div className="proj-mini-t">{p.t}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                <Bar pct={p.prog} color={COPPER} />
                <Mono style={{ marginLeft: 10, fontSize: 12.5, color: INK }}>{p.prog}%</Mono>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
