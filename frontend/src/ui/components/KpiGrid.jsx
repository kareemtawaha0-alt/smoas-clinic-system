import React from "react";
import { Card } from "./Card.jsx";
import "./kpi.css";

export function KpiGrid({ items }) {
  return (
    <div className="kpiGrid">
      {items.map((k) => (
        <Card key={k.label} title={k.label} subtitle={k.hint} right={k.badge ? <span className={"badge " + k.badgeTone}>{k.badge}</span> : null}>
          <div className="kpiValue">{k.value}</div>
        </Card>
      ))}
    </div>
  );
}
