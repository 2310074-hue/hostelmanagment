import React from "react";

// Reusable <select> filter. `options` is an array of strings; first entry acts as "All".
const FilterDropdown = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="form-label small text-muted mb-1">{label}</label>}
    <select className="form-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default FilterDropdown;
