import React, { useState } from 'react';
// import './HomePage.css';

function StatusButtons({ selectedstatuss, setSelectedstatuss}:any) {
    const statuss = ["Open", "Closed"];

    const togglestatuss = (index: any) => {
        const newSelectedstatuss = [...selectedstatuss];
        newSelectedstatuss[index] = !newSelectedstatuss[index];
        setSelectedstatuss(newSelectedstatuss);
    };

    return (
        <div>
            {statuss.map((status, index) => (
                <button
                    // value={status}
                    key={status}
                    className={selectedstatuss[index] ? 'selected' : ''}
                    onClick={() => togglestatuss(index)}
                >
                    {status}
                </button>
            ))}
        </div>
    );
}

export default StatusButtons;
