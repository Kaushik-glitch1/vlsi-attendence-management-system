import React from "react";
import { Filter, Plus, FolderKanban, Target, AlertTriangle, Activity, CalendarDays, Cpu, Users } from "lucide-react";
import { useApi } from "../api/hooks.js";
import { Card, KPI, Btn, Chip, Bar, Mono, Avatar, PageHead } from "../components/primitives.jsx";
import { BLUE, GREEN, RED, COPPER, MUTED, INK, TITLES, img, PHOTO, PROJECT_TAG_LABEL, PROJECT_TAG_TONE } from "../constants";

export default function ProjectTracking() {
  const { data: projects } = useApi("/projects");
  const list = projects || [];
  const onTrack = list.filter((p) => p.prog >= 60).length;
  const atRisk = list.filter((p) => p.prog < 45).length;
  const avgCompletion = list.length ? Math.round(list.reduce((a, p) => a + p.prog, 0) / list.length) : 0;

  return (
    <>
      <PageHead view="projects" titles={TITLES} right={<><Btn icon={Filter} variant="ghost" size="sm">All stages</Btn><Btn icon={Plus} variant="primary" size="sm">New project</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Active projects" value={list.length} icon={FolderKanban} tone={BLUE} />
        <KPI idx={1} label="On track" value={onTrack} icon={Target} tone={GREEN} />
        <KPI idx={2} label="At risk" value={atRisk} icon={AlertTriangle} tone={RED} />
        <KPI idx={3} label="Avg completion" value={avgCompletion} unit="%" icon={Activity} tone={COPPER} />
      </div>

      <div className="grid g3" style={{ marginTop: 16 }}>
        {list.map((p, i) => (
          <Card key={p.id} pad={false} className="fade-up" style={{ overflow: "hidden", animationDelay: i * 50 + "ms" }}>
            <span style={{ display: "block", height: 110, background: "#0e1730" }}>
              <img src={img(PHOTO[p.img] || PHOTO.code, 480, 180)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
            <div style={{ padding: 15 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Chip tone={PROJECT_TAG_TONE[p.tag]}>{PROJECT_TAG_LABEL[p.tag]}</Chip>
                <span style={{ fontSize: 11.5, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}><CalendarDays size={12} />Due <Mono>{new Date(p.due).toLocaleDateString()}</Mono></span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: INK, marginTop: 10, lineHeight: 1.3, minHeight: 38 }}>{p.t}</div>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}><Cpu size={13} color={MUTED} />{p.stage}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <Bar pct={p.prog} color={p.prog >= 60 ? GREEN : p.prog >= 45 ? COPPER : RED} />
                <Mono style={{ fontSize: 12.5, color: INK, fontWeight: 600 }}>{p.prog}%</Mono>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 13, paddingTop: 13, borderTop: "1px solid var(--line-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar n={p.leadAvatarSeed} size={26} />
                  <span style={{ fontSize: 12, color: INK, fontWeight: 500 }}>{p.lead}</span>
                </div>
                <span style={{ fontSize: 11.5, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{p.team}</span>
              </div>
            </div>
          </Card>
        ))}
        {list.length === 0 && <Card style={{ color: MUTED, textAlign: "center" }}>No projects yet.</Card>}
      </div>
    </>
  );
}
