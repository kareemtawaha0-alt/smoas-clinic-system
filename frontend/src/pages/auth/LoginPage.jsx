import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../state/auth/useAuth.js";
import "../../styles/auth.css";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("Admin@1234");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      nav(loc.state?.from || "/dashboard", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="authWrap">
      <div className="authCard">
        <div className="authTitle">SMOAS</div>
        <div className="authSub">Secure login </div>

        <form onSubmit={onSubmit} className="authForm">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {err && <div className="authError">{err}</div>}

          <button className="btn primary" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </button>

          <div className="authHint">
            
          </div>
        </form>
      </div>
    </div>
  );
}
