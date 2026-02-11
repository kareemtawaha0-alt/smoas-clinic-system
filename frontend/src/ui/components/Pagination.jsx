import React from "react";
import "./pagination.css";

export function Pagination({ page, pages, onPage }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className="pager">
      <button className="btn secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</button>
      <div className="pagerInfo">Page {page} / {pages}</div>
      <button className="btn secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}
