import React, { useState } from "react";
import {
  CircuitBoard, X, ChevronRight, ChevronDown, Menu, Search, CalendarDays, Bell, LogOut,
  UserCheck, Settings, Activity,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useApi } from "../api/hooks.js";
import { post } from "../api/client.js";
import { NAV, TITLES, ROLE_META, MUTED, INK } from "../constants";
import { Mono, Avatar } from "../components/primitives.jsx";

export function Sidebar({ view, setView, open, setOpen }) {
  const { user, logout } = useAuth();
  return (
    <>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <aside className={"side " + (open ? "side-open" : "")}>
        <div className="side-brand">
          <span className="logo-mark"><CircuitBoard size={17} strokeWidth={2.2} /></span>
          <span className="side-brand-t">VLSI<span style={{ opacity: .5 }}>·AMS</span></span>
          <button className="side-x" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>

        <nav className="side-nav">
          {NAV.map((g) => (
            <div key={g.group} className="nav-group">
              <div className="nav-label">{g.group}</div>
              {g.items.map((it) => (
                <button key={it.key} className={"nav-item " + (view === it.key ? "on" : "")}
                  onClick={() => { setView(it.key); setOpen(false); }}>
                  <it.icon size={17} strokeWidth={2.1} />
                  <span>{it.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="side-foot">
          <div className="role-switch" style={{ cursor: "default" }}>
            <img src={`https://i.pravatar.cc/120?img=${user?.avatarSeed || 1}`} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
              <div className="rs-n">{user?.name}</div>
              <div className="rs-r">{ROLE_META[user?.role]?.label}</div>
            </div>
            <button onClick={logout} title="Sign out" style={{ color: "rgba(255,255,255,.6)" }}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ setOpen, view }) {
  const { user, logout } = useAuth();
  const [bell, setBell] = useState(false);
  const [menu, setMenu] = useState(false);
  const { data: notifications, setData, refetch } = useApi("/notifications");
  const unread = (notifications || []).filter((n) => !n.read).length;

  const openBell = async () => {
    setBell(!bell);
    setMenu(false);
    if (!bell && unread > 0) {
      await post("/notifications/read-all").catch(() => {});
      setData((prev) => (prev || []).map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <header className="top">
      <button className="top-burger" onClick={() => setOpen(true)}><Menu size={20} /></button>
      <div className="top-crumb"><span style={{ color: MUTED }}>VLSI Department</span><ChevronRight size={14} color="#cdd3dd" /><span style={{ fontWeight: 600, color: INK }}>{(TITLES[view] || [""])[0]}</span></div>
      <div className="top-search"><Search size={16} color={MUTED} /><input placeholder="Search students, courses, projects…" /><span className="kbd">/</span></div>
      <div className="top-right">
        <div className="top-date"><CalendarDays size={15} color={MUTED} /><Mono style={{ fontSize: 12.5 }}>{new Date().toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</Mono></div>
        <div style={{ position: "relative" }}>
          <button className="icon-btn" onClick={openBell}><Bell size={18} />{unread > 0 && <span className="dot-red" />}</button>
          {bell && (
            <div className="pop">
              <div className="pop-h">Notifications<span className="chip chip-blue" style={{ fontSize: 10 }}>{(notifications || []).length}</span></div>
              {(notifications || []).length === 0 && <div className="pop-row" style={{ color: MUTED, fontSize: 12.5 }}>No notifications yet</div>}
              {(notifications || []).map((n) => (
                <div key={n.id} className="pop-row">
                  <span className="pop-ico" style={{ color: "#4263FF", background: "#4263FF16" }}><Bell size={15} /></span>
                  <div><div className="pop-t">{n.title}</div><div className="pop-s">{n.body}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <button className="top-user" onClick={() => { setMenu(!menu); setBell(false); }}>
            <img src={`https://i.pravatar.cc/120?img=${user?.avatarSeed || 1}`} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            <div className="tu-meta"><div className="tu-n">{user?.name}</div><div className="tu-r">{ROLE_META[user?.role]?.label}</div></div>
            <ChevronDown size={15} color={MUTED} />
          </button>
          {menu && (
            <div className="pop pop-sm">
              <div className="pm-head"><img src={`https://i.pravatar.cc/120?img=${user?.avatarSeed || 1}`} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} /><div><div className="tu-n">{user?.name}</div><div className="tu-r"><Mono>{user?.email}</Mono></div></div></div>
              {[["Profile", UserCheck], ["Settings & Security", Settings], ["Activity log", Activity]].map(([t, I]) => (
                <button key={t} className="pm-i"><I size={15} />{t}</button>
              ))}
              <button className="pm-i pm-danger" onClick={logout}><LogOut size={15} />Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
