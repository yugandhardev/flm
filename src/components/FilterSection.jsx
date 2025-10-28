// src/components/Filters.jsx
import React from "react";

const FilterSection = ({ filters, handleFilters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-4 rounded-lg shadow mb-6">
      <input
        type="text"
        placeholder="Search company..."
        className="border rounded px-3 py-2"
        name="name"
        value={filters.name}
        onChange={(e) => handleFilters(e.target)}
      />
      <input
        type="text"
        placeholder="Filter by location"
        className="border rounded px-3 py-2"
        name="country"
        value={filters.country}
        onChange={(e) => handleFilters(e.target)}
      />
      <input
        type="text"
        placeholder="Filter by industry"
        className="border rounded px-3 py-2"
        name="industry"
        value={filters.industry}
        onChange={(e) => handleFilters(e.target)}
      />
      <select
        className="border rounded px-3 py-2"
        name="sortOrder"
        value={filters.sortOrder}
        onChange={(e) => handleFilters(e.target)}
      >
        <option value="">Sort by name</option>
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>
    </div>
  );
};

export default FilterSection;
