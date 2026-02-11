import React, { useEffect, useState } from "react";
import "./toast.css";

let push;

export const toast = {
  info(title, message) { push?.({ tone: "info", title, message }); },
  warning(title, message) { push?.({ tone: "warning", title, message }); },
  success(title, message) { push?.({ tone: "success", title, message }); }
};

export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    push = (t) => {
      const id = Math.random().toString(36).slice(2);
      setItems((x) => [{ id, ...t }, ...x].slice(0, 4));
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4000);
    };
    return () => { push = null; };
  }, []);

  return (
    <div className="toasts">
      {items.map((t) => (
        <div key={t.id} className={"toast " + t.tone}>
          <div className="toastTitle">{t.title}</div>
          <div className="toastMsg">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
