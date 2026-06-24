import React from "react";
import { Building2, Plus, Briefcase, Award, TrendingUp } from "lucide-react";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, KPI, Avatar, Mono, PageHead } from "../components/primitives.jsx";
import { BLUE, AMBER, GREEN, COPPER, MUTED, INK, TITLES, INTERN_STAGES, INTERN_STAGE_LABEL, INTERN_STAGE_TONE } from "../constants";

export default function InternshipTracking() {
  const { data: interns } = useApi("/internships");
  const list = interns || [];
  const ongoing = list.filter((i) => i.stage === "ONGOING").length;
  const offers = list.filter((i) => i.stage === "OFFER").length;

  return (
    <>
      <PageHead view="intern" titles={TITLES} right={<><Btn icon={Building2} variant="ghost" size="sm">Partners</Btn><Btn icon={Plus} variant="primary" size="sm">Add internship</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Ongoing internships" value={ongoing} icon={Briefcase} tone={BLUE} />
        <KPI idx={1} label="Active offers" value={offers} icon={Award} tone={AMBER} />
        <KPI idx={2} label="Tracked internships" value={list.length} icon={TrendingUp} tone={GREEN} />
        <KPI idx={3} label="Partner companies" value={new Set(list.map((i) => i.co)).size} icon={Building2} tone={COPPER} />
      </div>

      <Card style={{ marginTop: 16 }}>
        <CardHead title="Internship pipeline" sub="Stage by stage" right={<Chip tone="blue">{list.length} students</Chip>} />
        <div className="pipe">
          {INTERN_STAGES.map((stage) => {
            const items = list.filter((i) => i.stage === stage);
            return (
              <div key={stage} className="pipe-col">
                <div className="pipe-h"><span>{INTERN_STAGE_LABEL[stage]}</span><Chip tone={INTERN_STAGE_TONE[stage]}>{items.length}</Chip></div>
                {items.map((it) => (
                  <div key={it.id} className="pipe-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <Avatar n={it.avatarSeed} size={28} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.n}</div>
                        <div style={{ fontSize: 11, color: MUTED }}>{it.role}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 9, paddingTop: 9, borderTop: "1px solid var(--line-2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}><Building2 size={11} />{it.co.split(" ")[0]}</span>
                      <Mono style={{ fontSize: 11.5, fontWeight: 600, color: GREEN }}>{it.stipend}</Mono>
                    </div>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", padding: "20px 0" }}>None yet</div>}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
