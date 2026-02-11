import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/auth/useAuth.js";
import { getSocket } from "../../services/socket.js";
import { ToastHost, toast } from "../feedback/toast.jsx";
import "./appShell.css";

const navByRole = {
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/doctors", label: "Doctors" },
    { to: "/patients", label: "Patients" },
    { to: "/appointments", label: "Appointments" },
    { to: "/billing", label: "Billing" },
    { to: "/audit", label: "Audit" }
  ],
  doctor: [
    { to: "/doctor", label: "Dashboard" },
    { to: "/appointments", label: "Appointments" }
  ]
};



export function AppShell() {
  const { user, logout } = useAuth();
  const nav = navByRole[user?.role] || navByRole.patient;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const s = getSocket();
    s.on("notify", (n) => toast.info(n.title, n.message));
    return () => s.off("notify");
  }, []);

  return (
    <div className="shell">
      <aside className={"sidebar " + (mobileOpen ? "open" : "")}>
        <div className="brand">
          <div className="logo">SMOAS</div>
          <div className="role">{user?.role?.toUpperCase()}</div>
        </div>

        <nav className="nav">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => "navItem " + (isActive ? "active" : "")}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div className="userMini">
            <div className="userName">{user?.profile?.firstName} {user?.profile?.lastName}</div>
            <div className="userEmail">{user?.email}</div>
          </div>

          <button
            className="btn secondary"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="btn ghost mobileOnly" onClick={() => setMobileOpen((v) => !v)}>
            ☰
          </button>
          <div className="topbarTitle">Smart Medical Operations & Analytics</div>
          <div className="topbarRight" />
        </header>

        <div className="content">
          <Outlet />
        </div>
      </main>

      <ToastHost />
    </div>
  );
}
