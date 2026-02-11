import React, { useCallback, useEffect, useState } from "react";
import { patientService } from "../../services/patientService.js";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { Pagination } from "../../ui/components/Pagination.jsx";
import { SearchBar } from "../../ui/components/SearchBar.jsx";
import { toast } from "../../ui/feedback/toast.jsx";
import PatientUpsertModal from "./PatientUpsertModal.jsx";

export default function PatientsPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  const [openUpsert, setOpenUpsert] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const res = await patientService.list({ q, page, limit: 10 });
    setData(res);
  }, [q, page]);

  useEffect(() => {
    load().catch(() => toast.warning("Error", "Failed to load patients"));
  }, [load]);

  async function removePatient(row) {
    const ok = window.confirm(`Delete patient: ${row.firstName} ${row.lastName}?`);
    if (!ok) return;
    try {
      await patientService.remove(row._id);
      toast.success("Deleted", "Patient removed");
      load();
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to delete patient");
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card title="Patients" subtitle="Create / edit / delete + search + pagination">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <SearchBar
              value={q}
              onChange={(v) => {
                setPage(1);
                setQ(v);
              }}
              placeholder="Search name, phone, email..."
            />
          </div>
          <button
            className="btn secondary"
            onClick={() => {
              setEditing(null);
              setOpenUpsert(true);
            }}
          >
            + New Patient
          </button>
        </div>
      </Card>

      <Card title="Results">
        <Table
          columns={[
            { key: "name", header: "Name", render: (r) => `${r.firstName} ${r.lastName}` },
            { key: "phone", header: "Phone", render: (r) => r.phone || "—" },
            { key: "email", header: "Email", render: (r) => r.email || "—" },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setEditing(r);
                      setOpenUpsert(true);
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn ghost" onClick={() => removePatient(r)}>
                    Delete
                  </button>
                </div>
              )
            }
          ]}
          rows={data.items || []}
        />
        <Pagination page={data.page} pages={data.pages} onPage={setPage} />
      </Card>

      <PatientUpsertModal
        open={openUpsert}
        initial={editing}
        onClose={() => setOpenUpsert(false)}
        onSaved={() => load()}
      />
    </div>
  );
}
