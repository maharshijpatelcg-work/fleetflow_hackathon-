import React from 'react';

export default function StatusBadge({ status }) {
    let pillClass = "pill-blue"; // Default

    if (status === "Draft") pillClass = "pill-amber";
    else if (status === "Dispatched") pillClass = "pill-blue";
    else if (status === "Completed") pillClass = "pill-emerald";
    else if (status === "Cancelled") pillClass = "pill-rose";

    return (
        <span className={`status-badge-pill ${pillClass}`}>
            {status}
        </span>
    );
}
