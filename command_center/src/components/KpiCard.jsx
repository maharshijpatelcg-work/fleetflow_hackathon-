import React from 'react';

export default function KpiCard({ title, value, icon, bgClass, iconColorClass }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex items-center border border-gray-100 group">
            <div className={`p-4 rounded-xl mr-5 transition-transform duration-300 group-hover:scale-110 ${bgClass} ${iconColorClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
