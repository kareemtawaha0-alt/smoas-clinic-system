import React, { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService.js";
import { KpiGrid } from "../../ui/components/KpiGrid.jsx";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { format } from "date-fns";

export default function ReceptionistDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.dashboard("receptionist").then(setData).catch(() => setData(null));
  }, []);

  const k = data?.kpis || {};
  const kpis = [
    { label: "Today's Schedule", value: k.appointmentsToday ?? "—", hint: "All doctors" },
    { label: "Pending Payments", value: k.pendingPayments ?? "—", hint: "Unpaid + partial", badge: (k.pendingPayments ?? 0) > 20 ? "Hot" : null, badgeTone: "warning" },
    { label: "New Registrations", value: k.newRegistrations ?? "—", hint: "Today" },
    { label: "Service Level", value: "A", hint: "Sample KPI" }
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <KpiGrid items={kpis} />

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: ".9fr 1.1fr" }}>
        <Card title="Alerts" subtitle="Front desk focus">
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
        </Card>

        <Card title="Daily Schedule" subtitle="Appointments">
          <Table
            columns={[
              { key: "time", header: "Time", render: (r) => format(new Date(r.startAt), "HH:mm") },
              { key: "doctor", header: "Doctor", render: (r) => `Dr. ${r.doctor?.profile?.firstName || ""} ${r.doctor?.profile?.lastName || ""}` },
              { key: "patient", header: "Patient", render: (r) => `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}` }
            ]}
            rows={data?.lists?.schedule || []}
          />
        </Card>
      </div>
    </div>
  );
}
