import React from "react";

export default function Filter({
  option,
  setSelectedFilter,
  selectedFilter,
  placeholder,
  unsetTdyToggle,
}:any) {
  return (
    <div>
      <select className="form-select selected-filter"
        value={selectedFilter}
        onChange={(e) => {
          setSelectedFilter(e.target.value);
          if (unsetTdyToggle) {
            unsetTdyToggle();
          }
        }}
      >
        {placeholder && (
          <option value='' disabled selected>
            {placeholder}
          </option>
        )}
        {option.map((item:any) => {
          return <option value={item.value}>{item.name}</option>;
        })}
      </select>
    </div>
  );
}
