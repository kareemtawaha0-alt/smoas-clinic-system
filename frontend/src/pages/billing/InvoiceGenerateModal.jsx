import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../../ui/components/Modal.jsx";
import { appointmentService } from "../../services/appointmentService.js";
import { invoiceService } from "../../services/invoiceService.js";
import { toast } from "../../ui/feedback/toast.jsx";
import { format } from "date-fns";

export default function InvoiceGenerateModal({ open, onClose, onSaved }) {
  const [busy, setBusy] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("JOD");
  const [items, setItems] = useState([{ name: "Consultation", qty: 1, unitPrice: 20 }]);

  useEffect(() => {
    if (!open) return;
    setAppointmentId("");
    setTax(0);
    setCurrency("JOD");
    setItems([{ name: "Consultation", qty: 1, unitPrice: 20 }]);

    appointmentService
      .list({ q: "", page: 1, limit: 50 })
      .then((d) => setAppointments(d.items || []))
      .catch(() => toast.warning("Error", "Failed to load appointments"));
  }, [open]);

  const canSubmit = useMemo(() => {
    return Boolean(
      appointmentId &&
        items.length > 0 &&
        items.every((i) => i.name && Number(i.qty) > 0 && Number(i.unitPrice) >= 0)
    );
  }, [appointmentId, items]);

  function updateItem(idx, patch) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function addRow() {
    setItems((prev) => [...prev, { name: "", qty: 1, unitPrice: 0 }]);
  }

  function removeRow(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function submit() {
    setBusy(true);
    try {
      await invoiceService.generate({
        appointmentId, // ✅ REQUIRED
        items: items.map((i) => ({
          name: i.name,
          price: Number(i.unitPrice),        // ✅ backend expects "price"
          qty: Number(i.qty) || 1            // ✅ number (optional but send it)
        })),
        tax: Number(tax) || 0,
        currency
      });

      toast.success("Generated", "Invoice created");
      onSaved?.();
      onClose();
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to generate invoice");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Generate Invoice"
      onClose={onClose}
      footer={
        <>
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={busy || !canSubmit} onClick={submit}>
            {busy ? "Generating..." : "Generate"}
          </button>
        </>
      }
    >
      <div className="field">
        <label>Appointment</label>
        <select value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)}>
          <option value="">Select appointment</option>
          {appointments.map((a) => (
            <option key={a._id} value={a._id}>
              {format(new Date(a.startAt), "PPpp")} • Dr. {a.doctor?.profile?.firstName || ""}{" "}
              {a.doctor?.profile?.lastName || ""} • {a.patient?.firstName || ""} {a.patient?.lastName || ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid2">
        <div className="field">
          <label>Tax</label>
          <input type="number" value={tax} onChange={(e) => setTax(e.target.value)} />
        </div>
        <div className="field">
          <label>Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="JOD">JOD</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>

      <div style={{ fontWeight: 800, margin: "8px 0 6px" }}>Items</div>
      <div style={{ display: "grid", gap: 8 }}>
        {items.map((it, idx) => (
          <div key={idx} className="grid2">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Name</label>
              <input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 10, alignItems: "end" }}>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Qty</label>
                <input type="number" value={it.qty} onChange={(e) => updateItem(idx, { qty: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Unit price</label>
                <input
                  type="number"
                  value={it.unitPrice}
                  onChange={(e) => updateItem(idx, { unitPrice: e.target.value })}
                />
              </div>
              <button className="btn ghost" onClick={() => removeRow(idx)} disabled={items.length === 1}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div>
          <button className="btn secondary" onClick={addRow}>
            + Add item
          </button>
        </div>
      </div>
    </Modal>
  );
}

