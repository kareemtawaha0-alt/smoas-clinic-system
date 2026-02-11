import { useState } from "react";
import { Modal } from "../../ui/components/Modal.jsx";
import { doctorService } from "../../services/doctorService.js";
import { toast } from "../../ui/feedback/toast.jsx";

export default function DoctorCreateModal({ open, onClose, onCreated }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "" });

  async function submit() {
    setBusy(true);
    try {
      await doctorService.create({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        password: form.password
      });
      toast.success("Done", "Doctor account created");
      onCreated?.();
      onClose();
      setForm({ firstName: "", lastName: "", phone: "", email: "", password: "" });
    } catch (e) {
      toast.warning("Error", e?.response?.data?.message || "Failed to create doctor");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Add Doctor"
      onClose={onClose}
      footer={
        <>
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn primary"
            disabled={busy || !form.firstName || !form.lastName || !form.email || !form.password}
            onClick={submit}
          >
            {busy ? "Saving..." : "Create"}
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

      <div className="field">
        <label>Temporary password</label>
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </div>
    </Modal>
  );
}
