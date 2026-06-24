import React, { useState } from "react";
import { Plus, XCircle, Check, ChevronRight, Upload, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../api/hooks.js";
import { patch, post } from "../api/client.js";
import { Card, CardHead, Chip, Btn, Avatar, Mono, PageHead } from "../components/primitives.jsx";
import { GREEN, MUTED, INK, TITLES, LEAVE_TYPE_LABEL } from "../constants";

const STATUS_TONE = { PENDING: "amber", APPROVED: "green", REJECTED: "red" };

export default function LeaveManagement() {
  const { user } = useAuth();
  const canApprove = user?.role === "FACULTY" || user?.role === "HOD" || user?.role === "ADMIN";
  const { data: rows, setData, refetch } = useApi("/leave");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "CASUAL", fromDate: "", toDate: "", hasDocument: false });

  const act = async (id, status) => {
    setData((prev) => (prev || []).map((r) => (r.id === id ? { ...r, status } : r)));
    await patch(`/leave/${id}`, { status }).catch(() => {});
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    await post("/leave", form).catch(() => {});
    setShowForm(false);
    setForm({ type: "CASUAL", fromDate: "", toDate: "", hasDocument: false });
    refetch();
  };

  const list = rows || [];
  const focusRequest = list.find((r) => r.status === "PENDING") || list[0];

  return (
    <>
      <PageHead view="leave" titles={TITLES} right={!canApprove && <Btn icon={Plus} variant="primary" size="sm" onClick={() => setShowForm((v) => !v)}>Apply for leave</Btn>} />

      {showForm && (
        <Card style={{ marginTop: 16 }}>
          <CardHead title="Apply for leave" sub="Routed to faculty, then HOD" />
          <form onSubmit={submitLeave} style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10, alignItems: "flex-end" }}>
            <div>
              <label className="fld-l">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ height: 40, borderRadius: 9, border: "1px solid var(--line)", padding: "0 10px" }}>
                <option value="CASUAL">Casual Leave</option>
                <option value="MEDICAL">Medical Leave</option>
                <option value="ON_DUTY">On Duty</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="fld-l">From</label>
              <input required type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} style={{ height: 40, borderRadius: 9, border: "1px solid var(--line)", padding: "0 10px" }} />
            </div>
            <div>
              <label className="fld-l">To</label>
              <input required type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} style={{ height: 40, borderRadius: 9, border: "1px solid var(--line)", padding: "0 10px" }} />
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: MUTED, height: 40 }}>
              <input type="checkbox" checked={form.hasDocument} onChange={(e) => setForm({ ...form, hasDocument: e.target.checked })} />
              Document attached
            </label>
            <Btn variant="primary" size="sm">Submit</Btn>
          </form>
        </Card>
      )}

      <div className="split" style={{ marginTop: 16 }}>
        <Card pad={false}>
          <div style={{ padding: "18px 20px 0" }}><CardHead title="Leave requests" sub="Routed through the workflow engine" right={<Chip tone="amber">{list.filter((r) => r.status === "PENDING").length} pending</Chip>} /></div>
          <table className="tbl">
            <thead><tr><th>Student</th><th>Type</th><th>Dates</th><th>Doc</th><th>Status</th>{canApprove && <th></th>}</tr></thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id}>
                  <td><div className="tcell-user"><Avatar n={r.avatarSeed} size={30} /><div><div className="tc-n">{r.n}</div><div className="tc-s"><Mono>{r.id_}</Mono></div></div></div></td>
                  <td><Chip tone={r.type === "MEDICAL" ? "red" : r.type === "ON_DUTY" ? "blue" : "slate"}>{LEAVE_TYPE_LABEL[r.type]}</Chip></td>
                  <td><Mono style={{ fontSize: 12, color: MUTED }}>{new Date(r.from).toLocaleDateString()}–{new Date(r.to).toLocaleDateString()}</Mono><div style={{ fontSize: 11, color: "var(--faint)" }}>{r.days} day{r.days > 1 ? "s" : ""}</div></td>
                  <td>{r.doc ? <Upload size={15} color={GREEN} /> : <span style={{ color: "var(--faint)", fontSize: 12 }}>—</span>}</td>
                  <td><Chip tone={STATUS_TONE[r.status]}>{r.status === "PENDING" ? "Pending" : r.status === "APPROVED" ? "Approved" : "Rejected"}</Chip></td>
                  {canApprove && (
                    <td style={{ textAlign: "right" }}>
                      {r.status === "PENDING" ? (
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button className="btn btn-ghost btn-sm" style={{ width: 30, padding: 0, justifyContent: "center" }} onClick={() => act(r.id, "REJECTED")}><XCircle size={15} color="#DC3A3A" /></button>
                          <button className="btn btn-primary btn-sm" style={{ width: 30, padding: 0, justifyContent: "center" }} onClick={() => act(r.id, "APPROVED")}><Check size={15} /></button>
                        </div>
                      ) : <ChevronRight size={16} color="#c3cad6" />}
                    </td>
                  )}
                </tr>
              ))}
              {list.length === 0 && <tr><td colSpan={6} style={{ color: MUTED, textAlign: "center", padding: 20 }}>No leave requests yet.</td></tr>}
            </tbody>
          </table>
        </Card>

        <Card>
          <CardHead title="Workflow" sub={focusRequest ? `${LEAVE_TYPE_LABEL[focusRequest.type]} · ${focusRequest.n}` : "No active request"} />
          <div style={{ marginTop: 10 }}>
            {(focusRequest?.steps || []).map((step, i) => (
              <div key={step.id} style={{ display: "flex", gap: 12, paddingBottom: i < focusRequest.steps.length - 1 ? 14 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", background: step.done ? GREEN : "#EEF1F6", color: step.done ? "#fff" : "#b6bdc9" }}>{step.done ? <Check size={14} strokeWidth={3} /> : <Mono style={{ fontSize: 11 }}>{i + 1}</Mono>}</span>
                  {i < focusRequest.steps.length - 1 && <span style={{ width: 2, height: 22, background: step.done ? GREEN : "var(--line)", marginTop: 2 }} />}
                </div>
                <div style={{ paddingTop: 3 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: step.done ? INK : MUTED }}>{step.name}</div>
                  <div style={{ fontSize: 11.5, color: MUTED }}>{step.done ? "Completed" : "Pending"}</div>
                </div>
              </div>
            ))}
            {!focusRequest && <div style={{ color: MUTED, fontSize: 13 }}>Nothing routed yet.</div>}
          </div>
          {focusRequest?.doc && (
            <div style={{ marginTop: 8, padding: 12, borderRadius: 11, background: "var(--bg)", border: "1px solid var(--line-2)" }}>
              <div style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 6 }}><BookOpen size={13} />Attachment</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, marginTop: 4 }}>document.pdf</div>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
