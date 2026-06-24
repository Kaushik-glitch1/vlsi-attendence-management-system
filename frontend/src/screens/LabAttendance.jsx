import React from "react";
import { Filter, Plus, FlaskConical, Layers, UserCheck, Cpu, Clock, ChevronRight } from "lucide-react";
import { useApi } from "../api/hooks.js";
import { post } from "../api/client.js";
import { Card, KPI, Btn, PageHead } from "../components/primitives.jsx";
import { BLUE, GREEN, COPPER, AMBER, MUTED, INK, TITLES, img, PHOTO } from "../constants";

function seatRow(present, seats) {
  return Array.from({ length: seats }).map((_, i) => (i < present - 2 ? "on" : i < present ? "late" : "off"));
}

export default function LabAttendance() {
  const { data: labs, refetch } = useApi("/labs");
  const list = labs || [];
  const live = list.filter((l) => l.status === "LIVE");
  const totSeat = list.reduce((a, l) => a + l.seats, 0);
  const totPres = list.reduce((a, l) => a + l.present, 0);

  const openSession = async (id) => {
    await post(`/labs/${id}/sessions`).catch(() => {});
    refetch();
  };

  return (
    <>
      <PageHead view="labs" titles={TITLES} right={<><Btn icon={Filter} variant="ghost" size="sm">All labs</Btn><Btn icon={Plus} variant="primary" size="sm">Open session</Btn></>} />
      <div className="grid g4" style={{ marginTop: 16 }}>
        <KPI idx={0} label="Live sessions" value={live.length} icon={FlaskConical} tone={GREEN} />
        <KPI idx={1} label="Seat occupancy" value={totSeat ? Math.round((totPres / totSeat) * 100) : 0} unit="%" icon={Layers} tone={BLUE} />
        <KPI idx={2} label="Students checked in" value={totPres} icon={UserCheck} tone={COPPER} />
        <KPI idx={3} label="Workstations free" value={totSeat - totPres} icon={Cpu} tone={AMBER} />
      </div>

      <div className="grid g2" style={{ marginTop: 16 }}>
        {list.map((l, i) => {
          const seats = seatRow(l.present, l.seats);
          return (
            <Card key={l.id} pad={false} className="lab-card fade-up" style={{ animationDelay: i * 60 + "ms" }}>
              <span className="lab-photo" style={{ display: "block" }}>
                <img src={img(PHOTO[l.img] || PHOTO.circuit, 600, 240)} alt={l.n} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              {l.status === "LIVE"
                ? <div className="lab-live"><span className="pulse" />Live now</div>
                : <div className="lab-live" style={{ background: "rgba(8,14,30,.55)" }}><Clock size={12} />Scheduled</div>}
              <div className="lab-body">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: INK }}>{l.n}</div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>{l.course}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: INK, fontFamily: "var(--mono)" }}>{l.present}/{l.seats}</div>
                    <div style={{ fontSize: 11, color: MUTED }}>occupied</div>
                  </div>
                </div>
                <div className="seat-grid">
                  {seats.map((s, k) => <span key={k} className="seat" style={{ background: s === "on" ? BLUE : s === "late" ? "#FBE3CF" : "#EAEDF3" }} />)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 13 }}>
                  <span style={{ fontSize: 12, color: MUTED }}>Instructor · <strong style={{ color: INK }}>{l.inst}</strong></span>
                  {l.status !== "LIVE" ? (
                    <Btn variant="ghost" size="sm" onClick={() => openSession(l.id)}>Open session</Btn>
                  ) : (
                    <Btn variant="ghost" size="sm" icon={ChevronRight} style={{ flexDirection: "row-reverse" }}>Roster</Btn>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {list.length === 0 && <Card style={{ color: MUTED, textAlign: "center" }}>No labs configured yet.</Card>}
      </div>
    </>
  );
}
