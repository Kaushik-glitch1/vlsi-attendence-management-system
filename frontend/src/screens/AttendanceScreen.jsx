import React, { useState } from "react";
import {
  Filter, Download, ClipboardCheck, QrCode, ScanFace, MapPin, Radio, Fingerprint,
  CheckCircle2, ShieldCheck, Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, PageHead, Mono, Loading } from "../components/primitives.jsx";
import { MUTED, INK, TITLES, STATUS_LABEL, STATUS_TONE, METHOD_LABEL } from "../constants";

const METHODS = [
  { k: "manual", t: "Manual", s: "Roll call", icon: ClipboardCheck, c: "#4263FF" },
  { k: "qr", t: "QR Code", s: "Scan to mark", icon: QrCode, c: "#15A05A" },
  { k: "face", t: "Face", s: "Recognition", icon: ScanFace, c: "#E0853D" },
  { k: "geo", t: "Geo-fence", s: "Location lock", icon: MapPin, c: "#0EA5E9" },
  { k: "rfid", t: "RFID", s: "Tap card", icon: Radio, c: "#8B5CF6" },
  { k: "bio", t: "Biometric", s: "Integration ready", icon: Fingerprint, c: "#64748B" },
];

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [method, setMethod] = useState("qr");
  const isStudent = user?.role === "STUDENT";
  const { data: register, loading: regLoading } = useApi(isStudent ? "/attendance/register" : "/attendance/sessions");
  const { data: log } = useApi("/audit");

  return (
    <>
      <PageHead view="attendance" titles={TITLES} right={<><Btn icon={Filter} variant="ghost" size="sm">Filter</Btn><Btn icon={Download} variant="primary" size="sm">Export register</Btn></>} />
      <Card style={{ marginTop: 16 }}>
        <CardHead title="Capture method" sub="Six modes supported across classrooms and labs" right={<Chip tone="green" icon={CheckCircle2}>Biometric ready</Chip>} />
        <div className="grid g3" style={{ gap: 11, marginTop: 8 }}>
          {METHODS.map((m) => (
            <button key={m.k} className="mark-card" onClick={() => setMethod(m.k)}
              style={{ borderColor: method === m.k ? m.c : "var(--line)", background: method === m.k ? m.c + "0D" : "#fff", boxShadow: method === m.k ? "0 0 0 1px " + m.c + " inset" : "none" }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", color: m.c, background: m.c + "16" }}><m.icon size={19} /></span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div className="mark-n">{m.t}</div>
                <div className="mark-id">{m.s}</div>
              </div>
              {method === m.k && <CheckCircle2 size={18} color={m.c} />}
            </button>
          ))}
        </div>
      </Card>

      <div className="split" style={{ marginTop: 16 }}>
        <Card pad={false}>
          <div style={{ padding: "18px 20px 0" }}>
            <CardHead title={isStudent ? "My register" : "Sessions I taught"} sub="Recent activity" right={<Chip tone="blue">{isStudent ? `Sem ${1}` : "Recent"}</Chip>} />
          </div>
          {regLoading ? <Loading /> : (
            <table className="tbl">
              {isStudent ? (
                <>
                  <thead><tr><th>Date</th><th>Course</th><th>Method</th><th>Status</th></tr></thead>
                  <tbody>
                    {(register || []).map((r, i) => (
                      <tr key={i}>
                        <td><Mono style={{ color: MUTED }}>{new Date(r.date).toLocaleDateString()}</Mono></td>
                        <td><div><div className="tc-n">{r.name}</div><div className="tc-s"><Mono>{r.code}</Mono></div></div></td>
                        <td><Chip tone="slate">{METHOD_LABEL[r.method]}</Chip></td>
                        <td><Chip tone={STATUS_TONE[r.status]}>{STATUS_LABEL[r.status]}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>
                  <thead><tr><th>Date</th><th>Course</th><th>Room</th><th>Status</th></tr></thead>
                  <tbody>
                    {(register || []).map((s) => (
                      <tr key={s.id}>
                        <td><Mono style={{ color: MUTED }}>{new Date(s.date).toLocaleDateString()}</Mono></td>
                        <td><div className="tc-n"><Mono>{s.course.code}</Mono> · {s.course.name}</div></td>
                        <td>{s.room}</td>
                        <td><Chip tone={s.locked ? "green" : "amber"}>{s.locked ? "Locked" : s.status}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          )}
        </Card>

        <Card>
          <CardHead title="Audit log" sub="Immutable activity trail" right={<ShieldCheck size={16} color="#15A05A" />} />
          <div style={{ marginTop: 8 }}>
            {(log || []).map((l, i) => (
              <div key={l.id} style={{ display: "flex", gap: 12, paddingBottom: i < log.length - 1 ? 16 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: "#4263FF16", color: "#4263FF", display: "grid", placeItems: "center", flexShrink: 0 }}><Lock size={14} /></span>
                  {i < log.length - 1 && <span style={{ width: 2, flex: 1, background: "var(--line)", marginTop: 4 }} />}
                </div>
                <div style={{ paddingTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: INK, lineHeight: 1.3 }}>{l.action.replaceAll("_", " ")}</div>
                  <div style={{ fontSize: 11.5, color: MUTED, marginTop: 2 }}>{l.actor} · <Mono>{new Date(l.time).toLocaleTimeString()}</Mono></div>
                </div>
              </div>
            ))}
            {(log || []).length === 0 && <div style={{ color: MUTED, fontSize: 13 }}>No activity recorded yet.</div>}
          </div>
        </Card>
      </div>
    </>
  );
}
