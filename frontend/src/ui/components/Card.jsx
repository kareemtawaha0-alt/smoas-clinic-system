import React from "react";
import "./card.css";

export function Card({ title, subtitle, right, children }) {
  return (
    <div className="card">
      {(title || subtitle || right) && (
        <div className="cardHeader">
          <div>
            {title && <div className="cardTitle">{title}</div>}
            {subtitle && <div className="cardSub">{subtitle}</div>}
          </div>
          {right && <div>{right}</div>}
        </div>
      )}
      <div className="cardBody">{children}</div>
    </div>
  );
}
