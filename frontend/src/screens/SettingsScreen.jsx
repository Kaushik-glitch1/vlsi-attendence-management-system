import React, { useState } from "react";
import { ShieldCheck, Mail, CheckCircle2, Cpu, Phone, Building2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../api/hooks.js";
import { patch, del } from "../api/client.js";
import { Card, CardHead, Chip, Btn, Mono, PageHead } from "../components/primitives.jsx";
import { COPPER, BLUE, GREEN, TITLES, ROLE_META } from "../constants";

const RBAC = [
  { r: "HOD", scope: "Department", perms: "Approve · Reports · Config", c: COPPER },
  { r: "Faculty", scope: "Assigned classes", perms: "Mark · Approve · View", c: BLUE },
  { r: "Lab Instructor", scope: "Assigned labs", perms: "Mark lab attendance", c: "#0EA5E9" },
  { r: "Student", scope: "Self", perms: "View · Apply leave", c: GREEN },
  { r: "Parent", scope: "Ward", perms: "View only", c: "#8B5CF6" },
];

const DEVICE_ICON = { "MacBook Pro · Chrome": Cpu, "iPhone 15 · Claude app": Phone };

export default function SettingsScreen() {
  const { user, setUser } = useAuth();
  const [mfa, setMfa] = useState(user?.mfaEnabled ?? true);
  const [push, setPush] = useState(user?.pushEnabled ?? true);
  const [sms, setSms] = useState(user?.smsEnabled ?? false);
  const { data: devices, refetch } = useApi("/settings/devices");

  const update = async (field, value, setter) => {
    setter(value);
    const updated = await patch("/settings/security", { [field]: value }).catch(() => null);
    if (updated) setUser((u) => ({ ...u, ...updated }));
  };

  const revoke = async (id) => {
    await del(`/settings/devices/${id}`).catch(() => {});
    refetch();
  };

  return (
    <>
      <PageHead view="settings" titles={TITLES} right={<Btn icon={ShieldCheck} variant="ghost" size="sm">Security log</Btn>} />
      <div className="split" style={{ marginTop: 16 }}>
        <div style={{ display: "grid", gap: 16 }}>
          <Card>
            <CardHead title="Profile" sub="Your identity across the platform" />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
              <img src={`https://i.pravatar.cc/120?img=${user?.avatarSeed || 1}`} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} style={{ width: 58, height: 58, borderRadius: 14, objectFit: "cover", background: "#e7eaf0" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>{user?.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{ROLE_META[user?.role]?.label}</div>
              </div>
              <Chip tone="blue"><Mono>{user?.email}</Mono></Chip>
            </div>
          </Card>

          <Card>
            <CardHead title="Security" sub="Multi-factor & access" />
            <div style={{ marginTop: 4 }}>
              <div className="set-row">
                <div><div className="set-t">Multi-factor authentication</div><div className="set-s">Authenticator app + email OTP</div></div>
                <button className={"toggle " + (mfa ? "" : "off")} onClick={() => update("mfaEnabled", !mfa, setMfa)}><span /></button>
              </div>
              <div className="set-row">
                <div><div className="set-t">Password</div><div className="set-s">Managed by your institute account</div></div>
                <Btn variant="ghost" size="sm">Change</Btn>
              </div>
              <div className="set-row">
                <div><div className="set-t">Single sign-on</div><div className="set-s">Institute SSO connected</div></div>
                <Chip tone="green" icon={CheckCircle2}>Connected</Chip>
              </div>
            </div>
          </Card>

          <Card>
            <CardHead title="Notifications" sub="Where alerts are delivered" />
            <div style={{ marginTop: 4 }}>
              <div className="set-row"><div><div className="set-t">Email alerts</div><div className="set-s">Shortage, approvals, timetable</div></div><Chip tone="green" icon={Mail}>On</Chip></div>
              <div className="set-row"><div><div className="set-t">Push notifications</div><div className="set-s">Real-time in-app & mobile</div></div><button className={"toggle " + (push ? "" : "off")} onClick={() => update("pushEnabled", !push, setPush)}><span /></button></div>
              <div className="set-row"><div><div className="set-t">SMS alerts</div><div className="set-s">Architecture ready · gateway pending</div></div><button className={"toggle " + (sms ? "" : "off")} onClick={() => update("smsEnabled", !sms, setSms)}><span /></button></div>
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <Card>
            <CardHead title="Active sessions" sub="Devices signed in" right={<ShieldCheck size={16} color={GREEN} />} />
            <div style={{ marginTop: 6 }}>
              {(devices || []).map((d) => {
                const Icon = DEVICE_ICON[d.deviceName] || Building2;
                return (
                  <div key={d.id} className="device-row">
                    <span className="device-ico"><Icon size={17} /></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 7 }}>{d.deviceName}{d.current && <Chip tone="green">This device</Chip>}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{d.location} · {new Date(d.lastActiveAt).toLocaleString()}</div>
                    </div>
                    {!d.current && <button className="btn btn-ghost btn-sm" onClick={() => revoke(d.id)}>Revoke</button>}
                  </div>
                );
              })}
              {(devices || []).length === 0 && <div style={{ color: "var(--muted)", fontSize: 13 }}>No active sessions.</div>}
            </div>
          </Card>

          <Card>
            <CardHead title="Role-based access" sub="Permission matrix" />
            <div style={{ marginTop: 6 }}>
              {RBAC.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 0", borderBottom: i < RBAC.length - 1 ? "1px solid var(--line-2)" : "none" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: r.c, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{r.r}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.perms}</div>
                  </div>
                  <Chip tone="slate">{r.scope}</Chip>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
