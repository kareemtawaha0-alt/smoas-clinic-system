import React from "react";
import "./modal.css";

export function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="modalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <button className="btn ghost" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modalBody">{children}</div>
        {footer ? <div className="modalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}
