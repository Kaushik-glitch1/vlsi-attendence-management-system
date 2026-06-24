import React, { useMemo } from "react";
import {
  Download, Plus, Clock, AlertTriangle, ClipboardCheck, Activity, CheckCircle2, XCircle,
  QrCode, ScanFace, Radio, Mail,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar as RBar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { useApi } from "../api/hooks.js";
import { post } from "../api/client.js";
import { Card, CardHead, Chip, Btn, KPI, TipBox, PageHead, Mono, Avatar, Loading } from "../components/primitives.jsx";
import { BLUE, BLUE_2, RED, AMBER, GREEN, COPPER, GRID, MUTED, TITLES } from "../constants";

export default function FacultyDashboard() {
  const { data: sessions } = useApi("/attendance/sessions");
  const todayStr = new Date().toISOString().slice(0, 10);
  const liveSession = useMemo(
    () => (sessions || []).find((s) => s.status === "LIVE" && s.date?.slice(0, 10) === todayStr),
    [sessions, todayStr]
  );
  const rosterPath = liveSession ? `/attendance/sessions/${liveSession.id}` : null;
  const { data: rosterData, setData: setRoster } = useApi(rosterPath);
  const trendPath = liveSession ? `/attendance/trend?courseId=${liveSession.courseId}` : null;
  const { data: trend } = useApi(trendPath);
  const { data: risk } = useApi("/attendance/risk");
  const { data: approvals } = useApi("/approvals");

  const roster = rosterData?.roster || [];
  const present = roster.filter((r) => r.status === "PRESENT" || r.status === "ON_DUTY").length;
  const pendingApprovals = (approvals || []).filter((a) => a.st === "PENDING").length;
  const avgClassAttendance = trend?.length ? Math.round(trend.reduce((a, b) => a + b.a, 0) / trend.length) : null;

  const toggle = async (studentId, current) => {
    const next = current === "PRESENT" || current === "ON_DUTY" ? "ABSENT" : "PRESENT";
    setRoster((prev) => ({ ...prev, roster: prev.roster.map((r) => (r.studentId === studentId ? { ...r, status: next } : r)) }));
    await post(`/attendance/sessions/${liveSession.id}/mark`, { studentId, status: next }).catch(() => {});
  };

  const lockSession = async () => {
    await post(`/attendance/sessions/${liveSession.id}/lock`).catch(() => {});
  };

  return (
    <>
      <PageHead view="dash" titles={TITLES} right={<><Btn icon={Download} variant="ghost" size="sm">Class report</Btn><Btn icon={Plus} variant="primary" size="sm">New session</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Live sessions today" value={(sessions || []).filter((s) => s.status === "LIVE").length} icon={Clock} tone={BLUE} />
        <KPI idx={1} label="Students at risk" value={(risk || []).length} icon={AlertTriangle} tone={RED} />
        <KPI idx={2} label="Pending approvals" value={pendingApprovals} icon={ClipboardCheck} tone={AMBER} />
        <KPI idx={3} label="Avg class attendance" value={avgClassAttendance ?? "—"} unit={avgClassAttendance != null ? "%" : ""} icon={Activity} tone={GREEN} />
      </div>

      <div className="split" style={{ marginTop: 16 }}>
        <Card>
          {liveSession ? (
            <>
              <CardHead
                title={`Mark attendance — ${rosterData?.course?.code || ""} · ${rosterData?.course?.name || ""}`}
                sub={`Live session · ${liveSession.room} · ${liveSession.startTime}–${liveSession.endTime}`}
                right={<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12.5, color: MUTED }}>Present <Mono style={{ color: "var(--ink)", fontWeight: 600 }}>{present}/{roster.length}</Mono></span>
                  <Btn variant="primary" size="sm" icon={CheckCircle2} onClick={lockSession}>Save & lock</Btn>
                </div>} />
              <div className="mark-grid">
                {roster.map((s) => (
                  <button key={s.studentId} className={"mark-card " + ((s.status === "PRESENT" || s.status === "ON_DUTY") ? "on" : "off")} onClick={() => toggle(s.studentId, s.status)}>
                    <Avatar n={s.avatarSeed} size={36} />
                    <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                      <div className="mark-n">{s.name}</div>
                      <div className="mark-id"><Mono>{s.rollNo}</Mono></div>
                    </div>
                    <span className="mark-state">{(s.status === "PRESENT" || s.status === "ON_DUTY") ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</span>
                  </button>
                ))}
              </div>
              <div className="mark-foot">
                <span style={{ color: MUTED, fontSize: 12.5 }}>Methods</span>
                {[["Manual", ClipboardCheck], ["QR", QrCode], ["Face", ScanFace], ["RFID", Radio]].map(([t, I], k) => (
                  <span key={t} className={"method " + (k === 0 ? "on" : "")}><I size={13} />{t}</span>
                ))}
              </div>
            </>
          ) : (
            <Loading label="No live session right now. Start one to mark attendance." />
          )}
        </Card>

        <Card>
          <CardHead title="Risk alerts" sub="Below 75% threshold" right={<Chip tone="red">{(risk || []).length}</Chip>} />
          <div className="risk-list">
            {(risk || []).map((s) => (
              <div key={s.id} className="risk-row">
                <Avatar n={s.avatarSeed} size={34} ring={RED} />
                <div style={{ flex: 1 }}>
                  <div className="risk-n">{s.name}</div>
                  <div className="risk-id"><Mono>{s.rollNo}</Mono></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Mono style={{ color: RED, fontWeight: 600 }}>{s.pct}%</Mono>
                  <div style={{ fontSize: 11, color: MUTED }}>{75 - s.pct}% short</div>
                </div>
              </div>
            ))}
            {(risk || []).length === 0 && <div style={{ color: MUTED, fontSize: 13, padding: "12px 0" }}>No students below threshold.</div>}
          </div>
          <Btn variant="ghost" size="sm" icon={Mail} style={{ width: "100%", justifyContent: "center", marginTop: 12 }}>Notify students &amp; parents</Btn>
        </Card>
      </div>

      {liveSession && (
        <Card style={{ marginTop: 16 }}>
          <CardHead title={`Class attendance — last sessions`} sub={`${rosterData?.course?.code || ""} · ${rosterData?.course?.name || ""}`} right={<Btn variant="ghost" size="sm" icon={Download}>Export</Btn>} />
          <div style={{ height: 230, marginTop: 6 }}>
            <ResponsiveContainer>
              <BarChart data={trend || []} margin={{ left: -18, right: 6, top: 6 }}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: MUTED }} />
                <Tooltip content={<TipBox />} cursor={{ fill: "rgba(66,99,255,.06)" }} />
                <RBar dataKey="a" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {(trend || []).map((d, i) => <Cell key={i} fill={d.a >= 90 ? BLUE : d.a >= 80 ? BLUE_2 : COPPER} />)}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </>
  );
}
