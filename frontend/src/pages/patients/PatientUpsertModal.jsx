import React, { useEffect, useState } from "react";
import { Modal } from "../../ui/components/Modal.jsx";
import { patientService } from "../../services/patientService.js";
import { toast } from "../../ui/feedback/toast.jsx";

export default function PatientUpsertModal({ open, onClose, onSaved, initial }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  useEffect(() => {
    if (!open) return;
    setForm({
      firstName: initial?.firstName || "",
      lastName: initial?.lastName || "",
      phone: initial?.phone || "",
      email: initial?.email || ""
    });
  }, [open, initial]);

  const isEdit = Boolean(initial?._id);

  async function submit() {
    setBusy(true);
    try {
      if (isEdit) {
        await patientService.update(initial._id, form);
        toast.success("Updated", "Patient updated successfully");
      } else {
        await patientService.create(form);
        toast.success("Created", "Patient created successfully");
      }
      onSaved?.();
      onClose();
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to save patient");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Patient" : "New Patient"}
      onClose={onClose}
      footer={
        <>
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={busy || !form.firstName || !form.lastName} onClick={submit}>
            {busy ? "Saving..." : "Save"}
          </button>
        </>
      }
    >
      <div className="grid2">
        <div className="field">
          <label>First name</label>
          <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div className="field">
          <label>Last name</label>
          <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
    </Modal>
  );
}
