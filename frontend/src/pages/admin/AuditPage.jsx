import React, { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { Pagination } from "../../ui/components/Pagination.jsx";
import { format } from "date-fns";

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  useEffect(() => {
    api.get("/audit", { params: { page, limit: 10 } }).then(({ data }) => setData(data));
  }, [page]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card title="Audit Logs" subtitle="Track every change (create/update/delete/login/payment)">
        <Table
          columns={[
            { key: "createdAt", header: "Time", render: (r) => format(new Date(r.createdAt), "PPpp") },
            { key: "actorRole", header: "Role" },
            { key: "action", header: "Action" },
            { key: "entity", header: "Entity" },
            { key: "entityId", header: "Entity ID" }
          ]}
          rows={data.items || []}
        />
        <Pagination page={data.page} pages={data.pages} onPage={setPage} />
      </Card>
    </div>
  );
}
