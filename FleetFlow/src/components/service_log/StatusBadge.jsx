import React from 'react';

const StatusBadge = ({ status }) => {
    const getBadgeStyle = (status) => {
        switch (status) {
            case 'Available':
            case 'Completed':
                return 'pill-emerald';
            case 'On Trip':
                return 'pill-blue';
            case 'In Shop':
            case 'Maintenance':
            case 'Open':
                return 'pill-amber';
            case 'Retired':
                return 'bg-slate-100 text-slate-500 border-slate-200';
            case 'Preventative':
                return 'bg-indigo-50 text-indigo-600 border-indigo-200/50';
            case 'Reactive':
                return 'pill-rose';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`status-badge-pill ${getBadgeStyle(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
