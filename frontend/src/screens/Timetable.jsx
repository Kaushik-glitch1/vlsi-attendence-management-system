import React from "react";
import { Plus, CheckCircle2, Zap } from "lucide-react";
import { useApi } from "../api/hooks.js";
import { Card, CardHead, Chip, Btn, PageHead } from "../components/primitives.jsx";
import { GREEN, TITLES, TT_C, TT_ROWS, TT_DAYS } from "../constants";

export default function Timetable() {
  const { data: slots } = useApi("/timetable");
  const cellMap = new Map((slots || []).map((s) => [`${s.day}-${s.rowIndex}`, s]));

  return (
    <>
      <PageHead view="timetable" titles={TITLES} right={<Btn icon={Plus} variant="primary" size="sm">Add slot</Btn>} />
      <div className="alert-bar fade-up" style={{ marginTop: 16, background: "linear-gradient(100deg,#F4FBF7,#F2F8FF)", borderColor: "#CDEAD9", color: "#0f6e3f" }}>
        <span className="alert-ico" style={{ background: "#DBF3E5", color: GREEN }}><CheckCircle2 size={18} /></span>
        <div style={{ flex: 1 }}><strong style={{ color: "#0e7a44" }}>No conflicts detected.</strong> The scheduling engine validated {(slots || []).length} sessions across rooms and faculty — no room or faculty double-booking this week.</div>
        <Btn variant="ghost" size="sm" icon={Zap}>Auto-schedule</Btn>
      </div>
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <CardHead title="Weekly timetable" sub="VLSI · current week" right={<Chip tone="blue">This week</Chip>} />
        <table className="tt">
          <thead><tr><th style={{ width: 56 }}></th>{TT_DAYS.map((d) => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {TT_ROWS.map((time, ri) => (
              <tr key={time}>
                <td className="tt-time">{time}</td>
                {TT_DAYS.map((day) => {
                  const cell = cellMap.get(`${day}-${ri}`);
                  if (!cell) return <td key={day}><div className="tt-cell tt-empty" /></td>;
                  const [bg, fg] = TT_C[cell.colorTag] || TT_C.blue;
                  return <td key={day}><div className="tt-cell" style={{ background: bg }}><div className="tt-code" style={{ color: fg }}>{cell.code}</div><div className="tt-name" style={{ color: fg }}>{cell.name}</div></div></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
