import { useEffect, useState } from "react";
import { Card } from "../../ui/components/Card.jsx";
import { toast } from "../../ui/feedback/toast.jsx";
import { doctorService } from "../../services/doctorService.js";
import DoctorCreateModal from "./DoctorCreateModal.jsx";

export default function DoctorsPage() {
  const [data, setData] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  async function load() {
    try {
      const res = await doctorService.list();
      setData(res);
    } catch (e) {
      toast.warning("Error", "Failed to load doctors");
    }
  }

  useEffect(() => { load(); }, []);

  const doctors = data?.items || [];

  return (
    <div className="page">
      <div className="pageHeader">
        <div>
          <h2>Doctors</h2>
          <div className="muted">Add new doctors and view the list.</div>
        </div>
        <div className="actions">
          <button className="btn secondary" onClick={() => setOpenCreate(true)}>+ Add Doctor</button>
        </div>
      </div>

      <Card title="Doctors">
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr><td colSpan="3" className="muted">No doctors yet.</td></tr>
              ) : doctors.map((d) => (
                <tr key={d._id}>
                  <td>Dr. {d.profile?.firstName} {d.profile?.lastName}</td>
                  <td>{d.email}</td>
                  <td>{d.profile?.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <DoctorCreateModal open={openCreate} onClose={() => setOpenCreate(false)} onCreated={load} />
    </div>
  );
}
