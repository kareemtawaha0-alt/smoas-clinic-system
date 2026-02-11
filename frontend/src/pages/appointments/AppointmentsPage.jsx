import React, { useCallback, useEffect, useState } from "react";
import { appointmentService } from "../../services/appointmentService.js";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { Pagination } from "../../ui/components/Pagination.jsx";
import { SearchBar } from "../../ui/components/SearchBar.jsx";
import { toast } from "../../ui/feedback/toast.jsx";
import { format } from "date-fns";
import AppointmentUpsertModal from "./AppointmentUpsertModal.jsx";

export default function AppointmentsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  const [openUpsert, setOpenUpsert] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const res = await appointmentService.list({ q, page, limit: 10 });
    setData(res);
  }, [q, page]);

  useEffect(() => {
    load().catch(() => toast.warning("Error", "Failed to load appointments"));
  }, [load]);

  async function cancelAppt(row) {
    const ok = window.confirm("Cancel this appointment?");
    if (!ok) return;
    try {
      await appointmentService.cancel(row._id);
      toast.success("Cancelled", "Appointment cancelled");
      load();
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to cancel appointment");
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card title="Appointments" subtitle="Book / edit / cancel + backend conflict detection">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <SearchBar
              value={q}
              onChange={(v) => {
                setPage(1);
                setQ(v);
              }}
              placeholder="Search by reason..."
            />
          </div>
          <button
            className="btn secondary"
            onClick={() => {
              setEditing(null);
              setOpenUpsert(true);
            }}
          >
            + Book Appointment
          </button>
        </div>
      </Card>

      <Card title="Schedule">
        <Table
          columns={[
            { key: "startAt", header: "Start", render: (r) => format(new Date(r.startAt), "PPpp") },
            { key: "doctor", header: "Doctor", render: (r) => `Dr. ${r.doctor?.profile?.firstName || ""} ${r.doctor?.profile?.lastName || ""}` },
            { key: "patient", header: "Patient", render: (r) => `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}` },
            { key: "status", header: "Status" },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn ghost" onClick={() => { setEditing(r); setOpenUpsert(true); }}>
                    Edit
                  </button>
                  <button className="btn ghost" onClick={() => cancelAppt(r)} disabled={r.status === "cancelled"}>
                    Cancel
                  </button>
                </div>
              )
            }
          ]}
          rows={data.items || []}
        />
        <Pagination page={data.page} pages={data.pages} onPage={setPage} />
      </Card>

      <AppointmentUpsertModal
        open={openUpsert}
        initial={editing}
        onClose={() => setOpenUpsert(false)}
        onSaved={() => load()}
      />
    </div>
  );
}
