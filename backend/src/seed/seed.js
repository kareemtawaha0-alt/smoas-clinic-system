import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import DoctorProfile from "../models/DoctorProfile.js";

function p(firstName, lastName) {
  return { firstName, lastName, phone: "+962700000000" };
}

async function run() {
  await connectDB(env.MONGO_URI);

  await Promise.all([User.deleteMany({}), Patient.deleteMany({}), DoctorProfile.deleteMany({})]);

  const mk = async (email, pass, role, profile) => {
    const passwordHash = await bcrypt.hash(pass, 12);
    return User.create({ email, passwordHash, role, profile });
  };

  const admin = await mk("admin@demo.com", "Admin@1234", "admin", p("Amina", "Admin"));
  const doctor = await mk("doctor@demo.com", "Doctor@1234", "doctor", p("Omar", "Doctor"));

  await DoctorProfile.create({ user: doctor._id, specialty: "General Medicine", room: "101" });

  // Create patient entity linked to patient user

  console.log("Seed completed:");
  console.log("admin@demo.com / Admin@1234");
  console.log("doctor@demo.com / Doctor@1234");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
