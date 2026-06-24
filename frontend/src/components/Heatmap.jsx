import React from "react";
import { HEAT_C, MUTED } from "../constants";

function colorFor(status) {
  if (status === "ABSENT") return HEAT_C[0];
  if (status === "LATE") return HEAT_C[1];
  if (status === "PRESENT" || status === "ON_DUTY") return HEAT_C[3];
  return "#F8F9FB";
}

export default function Heatmap({ days = [] }) {
  const byDate = new Map(days.map((d) => [d.date, d.status]));
  const today = new Date();
  const mondayOffset = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const cols = [];
  for (let wk = 15; wk >= 0; wk--) {
    const col = [];
    for (let dow = 0; dow < 6; dow++) {
      const d = new Date(today);
      d.setDate(d.getDate() - wk * 7 - mondayOffset + dow);
      const key = d.toISOString().slice(0, 10);
      col.push({ key, status: byDate.get(key) });
    }
    cols.push(col);
  }

  return (
    <div>
      <div className="heat">
        {cols.map((col, wk) => (
          <div key={wk} className="heat-col">
            {col.map((cell) => (
              <div key={cell.key} className="heat-cell" title={cell.status || "No record"} style={{ background: colorFor(cell.status) }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 12, fontSize: 11, color: MUTED }}>
        {[["Present", HEAT_C[3]], ["Late", HEAT_C[1]], ["Absent", HEAT_C[0]]].map(([t, c]) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: c, border: "1px solid rgba(11,18,32,.08)" }} />{t}
          </span>
        ))}
      </div>
    </div>
  );
}
