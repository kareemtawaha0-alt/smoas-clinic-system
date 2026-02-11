import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../../ui/components/Modal.jsx";
import { invoiceService } from "../../services/invoiceService.js";
import { toast } from "../../ui/feedback/toast.jsx";

export default function InvoicePayModal({ open, onClose, onSaved, invoice }) {
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setAmount("");
  }, [open]);

  const remaining = useMemo(() => {
    if (!invoice) return 0;
    const total = Number(invoice.total || 0);
    const paid = Number(invoice.paidAmount || 0);
    return Math.max(0, total - paid);
  }, [invoice]);

  const canSubmit = useMemo(() => {
    const a = Number(amount);
    return Boolean(invoice?._id && a > 0);
  }, [amount, invoice]);

  async function submit() {
    setBusy(true);
    try {
      await invoiceService.pay(invoice._id, Number(amount));
      toast.success("Recorded", "Payment saved");
      onSaved?.();
      onClose();
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to record payment");
    } finally {
      setBusy(false);
    }
  }

  if (!invoice) return null;

  return (
    <Modal
      open={open}
      title={`Record Payment • ${invoice.invoiceNumber}`}
      onClose={onClose}
      footer={
        <>
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || !canSubmit} onClick={submit}>
            {busy ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <div style={{ opacity: 0.8, marginBottom: 10 }}>
        Remaining: <b>{remaining}</b> {invoice.currency}
      </div>

      <div className="field">
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>

      <div style={{ opacity: 0.75, fontSize: 12 }}>
        * If the paid amount reaches invoice total, status becomes <b>paid</b> automatically.
      </div>
    </Modal>
  );
}
