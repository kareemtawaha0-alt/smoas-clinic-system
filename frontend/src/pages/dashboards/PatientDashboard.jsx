import React, { useEffect, useState } from "react";
import { analyticsService } from "../../services/analyticsService.js";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { format } from "date-fns";
import "../../styles/patient.css";

export default function PatientDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    analyticsService.dashboard("patient").then(setData).catch(() => setData(null));
  }, []);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <Card title="Upcoming Appointments" subtitle="Next 10">
          <Table
            columns={[
              { key: "date", header: "Date", render: (r) => format(new Date(r.startAt), "yyyy-MM-dd") },
              { key: "time", header: "Time", render: (r) => format(new Date(r.startAt), "HH:mm") },
              { key: "doctor", header: "Doctor", render: (r) => `Dr. ${r.doctor?.profile?.firstName || ""} ${r.doctor?.profile?.lastName || ""}` }
            ]}
            rows={data?.lists?.upcoming || []}
            emptyText="No upcoming appointments"
          />
        </Card>

        <Card title="Invoices" subtitle="Latest 10">
          <Table
            columns={[
              { key: "invoiceNumber", header: "Invoice" },
              { key: "total", header: "Total", render: (r) => `${r.total} ${r.currency}` },
              { key: "status", header: "Status" }
            ]}
            rows={data?.lists?.invoices || []}
            emptyText="No invoices"
          />
        </Card>
      </div>

      <Card title="Visit Timeline" subtitle="Latest visits">
        <div className="timeline">
          {(data?.lists?.timeline || []).map((t, idx) => (
            <div key={idx} className="tlItem">
              <div className="tlDot" />
              <div className="tlBody">
                <div className="tlTitle">{t.title} <span className={"tlStatus " + t.status}>{t.status}</span></div>
                <div className="tlSub">{format(new Date(t.date), "PPpp")} · {t.subtitle}</div>
              </div>
            </div>
          ))}
          {(!data?.lists?.timeline || data.lists.timeline.length === 0) && <div style={{ opacity: .7 }}>No visits yet</div>}
        </div>
      </Card>
    </div>
  );
}
