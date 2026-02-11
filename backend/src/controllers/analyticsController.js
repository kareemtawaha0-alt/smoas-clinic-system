import Appointment from "../models/Appointment.js";
import Invoice from "../models/Invoice.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export async function adminDashboard(req, res, next) {
  try {
    const todayFrom = startOfDay();
    const todayTo = endOfDay();

    const [patientsToday, apptsToday, cancelledToday, revenueTodayAgg, busiestAgg] = await Promise.all([
      Patient.countDocuments({ createdAt: { $gte: todayFrom, $lte: todayTo } }),
      Appointment.countDocuments({ startAt: { $gte: todayFrom, $lte: todayTo } }),
      Appointment.countDocuments({ status: "cancelled", startAt: { $gte: todayFrom, $lte: todayTo } }),
      Invoice.aggregate([
        { $match: { issuedAt: { $gte: todayFrom, $lte: todayTo }, status: { $in: ["paid", "partial"] } } },
        { $group: { _id: null, revenue: { $sum: "$paidAmount" } } }
      ]),
      Appointment.aggregate([
        { $match: { startAt: { $gte: todayFrom, $lte: todayTo }, status: { $ne: "cancelled" } } },
        { $group: { _id: "$doctor", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
    ]);

    const revenueToday = revenueTodayAgg[0]?.revenue || 0;

    let busiestDoctor = null;
    if (busiestAgg[0]?._id) {
      const doc = await User.findById(busiestAgg[0]._id).select("profile role");
      busiestDoctor = doc ? { id: doc._id, name: `${doc.profile.firstName} ${doc.profile.lastName}`, count: busiestAgg[0].count } : null;
    }

    const cancelledPct = apptsToday ? Math.round((cancelledToday / apptsToday) * 100) : 0;

    // Predictive alert: If cancellation rate > 20% today, warn
    const alerts = [];
    if (cancelledPct > 20) alerts.push({ level: "warning", message: "High cancellation rate today. Consider confirming appointments via reminders." });
    if (revenueToday === 0 && apptsToday > 0) alerts.push({ level: "info", message: "Appointments exist but no payments recorded yet." });

    // Trend: last 7 days revenue
    const last7 = await Invoice.aggregate([
      { $match: { issuedAt: { $gte: new Date(Date.now() - 7 * 86400000) }, status: { $in: ["paid", "partial"] } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$issuedAt" } }, revenue: { $sum: "$paidAmount" } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      kpis: {
        patientsToday,
        apptsToday,
        revenueToday,
        busiestDoctor,
        cancelledPct
      },
      charts: {
        revenue7d: last7.map((x) => ({ date: x._id, value: x.revenue }))
      },
      alerts
    });
  } catch (e) {
    next(e);
  }
}

export async function doctorDashboard(req, res, next) {
  try {
    const doctorId = req.user._id;
    const from = startOfDay();
    const to = endOfDay();

    const [myToday, pendingDiagnoses, patientsCountAgg] = await Promise.all([
      Appointment.find({ doctor: doctorId, startAt: { $gte: from, $lte: to }, status: { $ne: "cancelled" } })
        .populate("patient", "firstName lastName phone")
        .sort({ startAt: 1 })
        .limit(50),
      Appointment.countDocuments({ doctor: doctorId, status: "completed", notes: { $in: [null, ""] } }),
      Appointment.aggregate([
        { $match: { doctor: doctorId, status: { $ne: "cancelled" } } },
        { $group: { _id: "$patient", visits: { $sum: 1 } } },
        { $count: "patients" }
      ])
    ]);

    const patientsUnique = patientsCountAgg[0]?.patients || 0;

    // Trend: appointments last 14 days
    const apptTrend = await Appointment.aggregate([
      { $match: { doctor: doctorId, startAt: { $gte: new Date(Date.now() - 14 * 86400000) }, status: { $ne: "cancelled" } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$startAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      kpis: {
        myAppointmentsToday: myToday.length,
        pendingDiagnoses,
        uniquePatients: patientsUnique
      },
      lists: { myToday },
      charts: { appt14d: apptTrend.map((x) => ({ date: x._id, value: x.count })) }
    });
  } catch (e) {
    next(e);
  }
}

export async function receptionistDashboard(req, res, next) {
  try {
    const from = startOfDay();
    const to = endOfDay();

    const [schedule, pendingPayments, newPatients] = await Promise.all([
      Appointment.find({ startAt: { $gte: from, $lte: to }, status: { $ne: "cancelled" } })
        .populate("patient", "firstName lastName phone")
        .populate("doctor", "profile.firstName profile.lastName")
        .sort({ startAt: 1 })
        .limit(100),
      Invoice.countDocuments({ status: { $in: ["unpaid", "partial"] } }),
      Patient.countDocuments({ createdAt: { $gte: from, $lte: to } })
    ]);

    const alerts = [];
    if (pendingPayments > 20) alerts.push({ level: "warning", message: "Many pending payments. Consider calling patients or sending SMS reminders." });

    res.json({
      kpis: { appointmentsToday: schedule.length, pendingPayments, newRegistrations: newPatients },
      lists: { schedule },
      alerts
    });
  } catch (e) {
    next(e);
  }
}

export async function patientDashboard(req, res, next) {
  try {
    // In a real system, Patient user maps to Patient model. Here: patientId provided via query or stored in User.
    const patientId = req.user.patientId;
    if (!patientId) throw createError(404, "Patient profile not linked to this account");

    const now = new Date();

    const [upcoming, invoices] = await Promise.all([
      Appointment.find({ patient: patientId, startAt: { $gte: now }, status: { $ne: "cancelled" } })
        .populate("doctor", "profile.firstName profile.lastName")
        .sort({ startAt: 1 })
        .limit(10),
      Invoice.find({ patient: patientId }).sort({ issuedAt: -1 }).limit(10)
    ]);

    // Timeline: last 20 visits
    const visits = await Appointment.find({ patient: patientId, startAt: { $lte: now } })
      .populate("doctor", "profile.firstName profile.lastName")
      .sort({ startAt: -1 })
      .limit(20);

    res.json({
      kpis: { upcomingAppointments: upcoming.length, openInvoices: invoices.filter(i => i.status !== "paid" && i.status !== "void").length },
      lists: { upcoming, invoices, timeline: visits.map(v => ({ date: v.startAt, title: "Visit", subtitle: `Dr. ${v.doctor?.profile?.firstName || ""} ${v.doctor?.profile?.lastName || ""}`, status: v.status })) }
    });
  } catch (e) {
    next(e);
  }
}
