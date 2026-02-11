import React, { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService.js";
import { KpiGrid } from "../../ui/components/KpiGrid.jsx";
import { LineChartCard } from "../../ui/charts/LineChartCard.jsx";
import { Card } from "../../ui/components/Card.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.dashboard("admin").then(setData).catch(() => setData(null));
  }, []);

  const k = data?.kpis || {};
  const kpis = [
    { label: "Patients Today", value: k.patientsToday ?? "—", hint: "New registrations" },
    { label: "Appointments Today", value: k.apptsToday ?? "—", hint: "Booked + completed" },
    { label: "Daily Revenue", value: k.revenueToday != null ? `${k.revenueToday} JOD` : "—", hint: "Paid + partial" },
    { label: "Cancelled %", value: k.cancelledPct != null ? `${k.cancelledPct}%` : "—", hint: "Same-day cancellation", badge: k.cancelledPct > 20 ? "High" : "OK", badgeTone: k.cancelledPct > 20 ? "warning" : "success" }
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <KpiGrid items={kpis} />

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1.25fr .75fr" }}>
        <LineChartCard
          title="Revenue Trend"
          subtitle="Last 7 days"
          data={data?.charts?.revenue7d || []}
        />
        <Card title="Predictive Alerts" subtitle="Operational signals">
          {data?.alerts?.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {data.alerts.map((a, idx) => (
                <div key={idx} style={{ padding: 10, borderRadius: 14, border: "1px solid rgba(255,255,255,.10)", background: "rgba(255,255,255,.04)" }}>
                  <div style={{ fontWeight: 900, opacity: .9 }}>{a.level.toUpperCase()}</div>
                  <div style={{ opacity: .85, marginTop: 4 }}>{a.message}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ opacity: .7 }}>No alerts</div>
          )}
          <div style={{ marginTop: 12, opacity: .7, fontSize: 13 }}>
            Busiest Doctor: {k.busiestDoctor ? `${k.busiestDoctor.name} (${k.busiestDoctor.count})` : "—"}
          </div>
        </Card>
      </div>
    </div>
  );
}
