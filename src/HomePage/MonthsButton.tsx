import React, { useState } from 'react';
// import './HomePage.css';

function MonthButtons({ selectedMonths, setSelectedMonths, unsetTdyToggle}:any) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const toggleMonth = (index: any) => {
        unsetTdyToggle();
        const newSelectedMonths = [...selectedMonths];
        newSelectedMonths[index] = !newSelectedMonths[index];
        setSelectedMonths(newSelectedMonths);
    };

    return (
        <div>
            {months.map((month, index) => (
                <button
                    key={month}
                    className={selectedMonths[index] ? 'selected' : ''}
                    onClick={() => toggleMonth(index)}
                >
                    {month}
                </button>
            ))}
        </div>
    );
}

export default MonthButtons;
