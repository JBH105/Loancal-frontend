import React, { useState } from 'react';
// import './HomePage.css';

function YearButtons({ selectedYears, setSelectedYears, unsetTdyToggle}:any) {
    const years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "2031", "2032", "2033", "2034"];

    const toggleYears = (index: any) => {
        unsetTdyToggle()
        const newSelectedYears = [...selectedYears];
        newSelectedYears[index] = !newSelectedYears[index];
        setSelectedYears(newSelectedYears);
    };

    return (
        <div>
            {years.map((year, index) => (
                <button
                    value={year}
                    key={year}
                    className={selectedYears[index] ? 'selected' : ''}
                    onClick={() => toggleYears(index)}
                >
                    {year}
                </button>
            ))}
        </div>
    );
}

export default YearButtons;
