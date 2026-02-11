import React, { useCallback, useEffect, useState } from "react";
import { invoiceService } from "../../services/invoiceService.js";
import { Card } from "../../ui/components/Card.jsx";
import { Table } from "../../ui/components/Table.jsx";
import { Pagination } from "../../ui/components/Pagination.jsx";
import { SearchBar } from "../../ui/components/SearchBar.jsx";
import { toast } from "../../ui/feedback/toast.jsx";
import InvoiceGenerateModal from "./InvoiceGenerateModal.jsx";
import InvoicePayModal from "./InvoicePayModal.jsx";

export default function BillingPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });

  const [openGenerate, setOpenGenerate] = useState(false);
  const [openPay, setOpenPay] = useState(false);
  const [paying, setPaying] = useState(null);

  const load = useCallback(async () => {
    const res = await invoiceService.list({ q, page, limit: 10 });
    setData(res);
  }, [q, page]);

  useEffect(() => {
    load().catch(() => toast.warning("Error", "Failed to load invoices"));
  }, [load]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <Card title="Billing & Payments" subtitle="Generate invoices + record payments">
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ minWidth: 260, flex: 1 }}>
            <SearchBar
              value={q}
              onChange={(v) => {
                setPage(1);
                setQ(v);
              }}
              placeholder="Search invoice number..."
            />
          </div>
          <button className="btn secondary" onClick={() => setOpenGenerate(true)}>
            + Generate Invoice
          </button>
        </div>
      </Card>

      <Card title="Invoices">
        <Table
          columns={[
            { key: "invoiceNumber", header: "Invoice" },
            { key: "patient", header: "Patient", render: (r) => `${r.patient?.firstName || ""} ${r.patient?.lastName || ""}` },
            { key: "total", header: "Total", render: (r) => `${r.total} ${r.currency}` },
            { key: "paidAmount", header: "Paid", render: (r) => `${r.paidAmount || 0}` },
            { key: "status", header: "Status" },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setPaying(r);
                      setOpenPay(true);
                    }}
                    disabled={r.status === "paid" || r.status === "void"}
                  >
                    Pay
                  </button>
                </div>
              )
            }
          ]}
          rows={data.items || []}
        />
        <Pagination page={data.page} pages={data.pages} onPage={setPage} />
      </Card>

      <InvoiceGenerateModal
        open={openGenerate}
        onClose={() => setOpenGenerate(false)}
        onSaved={() => load()}
      />

      <InvoicePayModal
        open={openPay}
        invoice={paying}
        onClose={() => setOpenPay(false)}
        onSaved={() => load()}
      />
    </div>
  );
}
