import React from "react";
import { ClipboardCheck, CheckCircle2, XCircle, Check } from "lucide-react";
import { useApi } from "../api/hooks.js";
import { patch } from "../api/client.js";
import { Card, CardHead, Chip, Btn, KPI, PageHead, Avatar, Mono } from "../components/primitives.jsx";
import { AMBER, MUTED, TITLES } from "../constants";

export default function ApprovalsScreen() {
  const { data: rows, setData } = useApi("/approvals");
  const pending = (rows || []).filter((r) => r.st === "PENDING").length;

  const act = async (id, st) => {
    setData((prev) => (prev || []).map((r) => (r.id === id ? { ...r, st } : r)));
    await patch(`/approvals/${id}`, { status: st }).catch(() => {});
  };

  return (
    <>
      <PageHead view="approvals" titles={TITLES} right={<Chip tone="amber">{pending} pending</Chip>} />
      <div className="grid g3" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Awaiting your action" value={pending} icon={ClipboardCheck} tone={AMBER} />
      </div>
      <Card style={{ marginTop: 16 }} pad={false}>
        <div style={{ padding: "18px 20px 0" }}><CardHead title="Requests routed to you" sub="Approve, reject or comment — every action is logged" /></div>
        <div style={{ padding: "8px 12px 14px" }}>
          {(rows || []).map((r) => (
            <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 13, border: "1px solid var(--line-2)", marginTop: 8 }}>
              <Avatar n={r.avatarSeed} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                  <span className="tc-n">{r.n}</span>
                  <Chip tone={r.type === "LEAVE" ? "copper" : "blue"}>{r.type === "LEAVE" ? "Leave" : "Attendance correction"}</Chip>
                </div>
                <div style={{ fontSize: 12, color: MUTED, marginTop: 3 }}>{r.detail} · <Mono>{new Date(r.date).toLocaleDateString()}</Mono></div>
              </div>
              {r.st === "PENDING" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="ghost" size="sm" icon={XCircle} onClick={() => act(r.id, "REJECTED")}>Reject</Btn>
                  <Btn variant="primary" size="sm" icon={Check} onClick={() => act(r.id, "APPROVED")}>Approve</Btn>
                </div>
              ) : <Chip tone={r.st === "APPROVED" ? "green" : "red"} icon={r.st === "APPROVED" ? CheckCircle2 : XCircle}>{r.st === "APPROVED" ? "Approved" : "Rejected"}</Chip>}
            </div>
          ))}
          {(rows || []).length === 0 && <div style={{ color: MUTED, fontSize: 13, padding: "16px 6px" }}>No requests routed to you.</div>}
        </div>
      </Card>
    </>
  );
}
