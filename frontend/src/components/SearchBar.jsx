import React from "react";

// Reusable search input with an icon, used in Admin complaint/student lists.
const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="input-group">
    <span className="input-group-text bg-white">
      <i className="bi bi-search"></i>
    </span>
    <input
      type="text"
      className="form-control"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default SearchBar;
