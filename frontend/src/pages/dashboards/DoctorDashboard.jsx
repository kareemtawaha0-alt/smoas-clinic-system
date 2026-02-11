import React, { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService.js";
import { KpiGrid } from "../../ui/components/KpiGrid.jsx";
import { LineChartCard } from "../../ui/charts/LineChartCard.jsx";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.dashboard("doctor").then(setData).catch(() => setData(null));
  }, []);

  const k = data?.kpis || {};
  const kpis = [
    { label: "My Appointments Today", value: k.myAppointmentsToday ?? "—", hint: "Schedule load" },
    { label: "Pending Diagnoses", value: k.pendingDiagnoses ?? "—", hint: "Completed w/o notes" },
    { label: "Unique Patients", value: k.uniquePatients ?? "—", hint: "Across history" },
    { label: "Care Quality", value: "98%", hint: "Sample KPI (customizable)" }
  ];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <KpiGrid items={kpis} />

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1.1fr .9fr" }}>
        <Card title="Today's Appointments" subtitle="My schedule">
          <Table
            columns={[
              { key: "time", header: "Time", render: (r) => format(new Date(r.startAt), "HH:mm") },
              { key: "patient", header: "Patient", render: (r) => `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}` },
              { key: "phone", header: "Phone", render: (r) => r.patient?.phone || "—" }
            ]}
            rows={data?.lists?.myToday || []}
            emptyText="No appointments"
          />
        </Card>

        <LineChartCard title="Patient Trend" subtitle="Appointments (14 days)" data={data?.charts?.appt14d || []} />
      </div>
    </div>
  );
}
