import React, { useState } from "react";
import {
  CircuitBoard, Mail, Lock, Eye, ShieldCheck, ChevronRight,
  Building2, Check, QrCode, ListChecks, GraduationCap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Eyebrow } from "../components/primitives.jsx";
import { img, PHOTO, DEMO_ACCOUNTS, DEMO_PASSWORD } from "../constants";

function Photo({ src, alt, style }) {
  return (
    <span style={{ display: "block", background: "#0e1730", position: "relative", overflow: "hidden", ...style }}>
      <img src={src} alt={alt} loading="lazy"
        onError={(e) => { e.currentTarget.style.opacity = 0; }}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </span>
  );
}

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("student@vlsi.ac.in");
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [pick, setPick] = useState("STUDENT");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const choosePersona = (acc) => {
    setPick(acc.role);
    setEmail(acc.email);
    setPassword(DEMO_PASSWORD);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login-brand">
        <Photo src={img(PHOTO.circuit, 900, 1200)} alt="" style={{ position: "absolute", inset: 0 }} />
        <div className="login-brand-tint" />
        <div className="login-brand-inner">
          <div className="logo logo-lg"><span className="logo-mark"><CircuitBoard size={20} strokeWidth={2.2} /></span><span>VLSI<span style={{ opacity: .55 }}>·AMS</span></span></div>
          <div style={{ flex: 1 }} />
          <Eyebrow>Department of VLSI Design</Eyebrow>
          <h2 className="login-h">One platform for attendance, labs, projects and placements.</h2>
          <p className="login-p">Real-time tracking across CMOS design, verification and physical-design labs — with leave workflows, risk alerts and recruiter analytics built in.</p>
          <div className="login-feats">
            {[["Six attendance modes", QrCode], ["Workflow approvals", ListChecks], ["Placement analytics", GraduationCap], ["Audit & RBAC", ShieldCheck]].map(([t, I]) => (
              <div key={t} className="login-feat"><I size={15} strokeWidth={2.2} />{t}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <div className="logo" style={{ marginBottom: 26 }}><span className="logo-mark"><CircuitBoard size={18} strokeWidth={2.2} /></span><span>VLSI<span style={{ opacity: .5 }}>·AMS</span></span></div>
          <h1 style={{ fontSize: 23, fontWeight: 700, color: "var(--ink)", letterSpacing: "-.01em" }}>Sign in to your workspace</h1>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 6, marginBottom: 24 }}>Use your institute email or pick a demo account below.</p>

          <label className="fld-l">Institute email</label>
          <div className="fld"><Mail size={16} color="var(--muted)" /><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required /></div>
          <label className="fld-l" style={{ marginTop: 14 }}>Password</label>
          <div className="fld"><Lock size={16} color="var(--muted)" /><input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required /><Eye size={16} color="var(--muted)" /></div>

          {error && <div style={{ marginTop: 12, padding: "9px 12px", background: "var(--red-soft)", color: "#b62c2c", borderRadius: 9, fontSize: 12.5 }}>{error}</div>}

          <div className="login-row">
            <span style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--muted)", fontSize: 12.5 }}><ShieldCheck size={14} color="#15A05A" /> MFA enabled</span>
            <span style={{ color: "#4263FF", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Forgot password?</span>
          </div>

          <Eyebrow>Continue as — demo accounts</Eyebrow>
          <p style={{ fontSize: 11.5, color: "var(--faint)", margin: "-4px 0 10px" }}>Shared demo password: <strong>{DEMO_PASSWORD}</strong></p>
          <div className="role-grid">
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.role} type="button" className={"role-card " + (pick === acc.role ? "on" : "")} onClick={() => choosePersona(acc)}>
                <img src={`https://i.pravatar.cc/120?img=${acc.avatarSeed}`} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                <div>
                  <div className="role-card-n">{acc.label}</div>
                  <div className="role-card-s">{acc.name}</div>
                </div>
                {pick === acc.role && <span className="role-card-tick"><Check size={13} strokeWidth={3} /></span>}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", height: 46, marginTop: 18, fontSize: 14.5 }} disabled={submitting}>
            {submitting ? "Signing in…" : "Continue"}<ChevronRight size={17} />
          </button>
          <div className="sso-row">
            <button type="button" className="sso"><span style={{ fontWeight: 700, color: "#4285F4" }}>G</span> Google SSO</button>
            <button type="button" className="sso"><Building2 size={15} /> Institute SSO</button>
          </div>
          <p style={{ textAlign: "center", color: "var(--faint)", fontSize: 11.5, marginTop: 18 }}>Protected by session &amp; device tracking · SOC-ready audit logs</p>
        </form>
      </div>
    </div>
  );
}
