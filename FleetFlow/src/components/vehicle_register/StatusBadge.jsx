import React from 'react';

export default function StatusBadge({ status }) {
    const isAvailable = status === 'Available';

    return (
        <span className={`px-4 py-1.5 inline-flex text-sm leading-5 font-bold rounded-lg ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
}
