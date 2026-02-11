import React, { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce.js";
import "./search.css";

export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const [v, setV] = useState(value || "");
  const dv = useDebounce(v, 350);

  useEffect(() => onChange(dv), [dv, onChange]);

  return (
    <div className="search">
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder={placeholder} />
      {v && <button className="btn ghost" onClick={() => setV("")}>×</button>}
    </div>
  );
}
