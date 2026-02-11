import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "../../ui/components/Modal.jsx";
import { patientService } from "../../services/patientService.js";
import { userService } from "../../services/userService.js";
import { appointmentService } from "../../services/appointmentService.js";
import { toast } from "../../ui/feedback/toast.jsx";

function toIso(dtLocal) {
  if (!dtLocal) return "";
  const d = new Date(dtLocal);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString();
}

function fromIsoToLocal(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default function AppointmentUpsertModal({ open, onClose, onSaved, initial }) {
  const [busy, setBusy] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const isEdit = Boolean(initial?._id);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    startAtLocal: "",
    endAtLocal: "",
    reason: ""
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      patient: initial?.patient?._id || initial?.patient || "",
      doctor: initial?.doctor?._id || initial?.doctor || "",
      startAtLocal: fromIsoToLocal(initial?.startAt),
      endAtLocal: fromIsoToLocal(initial?.endAt),
      reason: initial?.reason || ""
    });

    Promise.all([patientService.list({ q: "", page: 1, limit: 50 }), userService.list("doctor")])
      .then(([p, d]) => {
        setPatients(p.items || []);
        setDoctors(d.items || []);
      })
      .catch(() => toast.warning("Error", "Failed to load doctors/patients"));
  }, [open, initial]);

  const canSubmit = useMemo(() => {
    return Boolean(form.patient && form.doctor && form.startAtLocal && form.endAtLocal);
  }, [form]);

  async function submit() {
    setBusy(true);
    try {
      const payload = {
        patient: form.patient,
        doctor: form.doctor,
        startAt: toIso(form.startAtLocal),
        endAt: toIso(form.endAtLocal),
        reason: form.reason
      };

      if (isEdit) {
        await appointmentService.update(initial._id, payload);
        toast.success("Updated", "Appointment updated");
      } else {
        await appointmentService.create(payload);
        toast.success("Booked", "Appointment created");
      }
      onSaved?.();
      onClose();
    } catch (e) {
      const msg = e?.response?.data?.message || "Booking failed";
      toast.warning("Error", msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Appointment" : "Book Appointment"}
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
      <div className="grid2">
        <div className="field">
          <label>Patient</label>
          <select value={form.patient} onChange={(e) => setForm({ ...form, patient: e.target.value })}>
            <option value="">Select</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Doctor</label>
          <select value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })}>
            <option value="">Select</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.profile?.firstName || ""} {d.profile?.lastName || ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid2">
        <div className="field">
          <label>Start</label>
          <input type="datetime-local" value={form.startAtLocal} onChange={(e) => setForm({ ...form, startAtLocal: e.target.value })} />
        </div>
        <div className="field">
          <label>End</label>
          <input type="datetime-local" value={form.endAtLocal} onChange={(e) => setForm({ ...form, endAtLocal: e.target.value })} />
        </div>
      </div>

      <div className="field">
        <label>Reason</label>
        <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
      </div>

      <div style={{ opacity: 0.75, fontSize: 12 }}>
        * Conflict detection is enforced by backend (you'll get a clear error if overlaps happen).
      </div>
    </Modal>
  );
}
