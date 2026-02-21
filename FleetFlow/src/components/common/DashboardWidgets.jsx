import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const KPICard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => (
    <div className="fleet-card p-5 flex flex-col justify-between h-full hover:border-primary-300 transition-all border-l-4 border-l-transparent hover:border-l-primary-500 group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${colorClass || 'bg-primary-50 text-primary-600'} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trendValue}%
                </div>
            )}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
    </div>
);

export const StatusPill = ({ status }) => {
    const styles = {
        'On Trip': 'bg-blue-50 text-blue-700 border-blue-100',
        'Available': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Warning': 'bg-amber-50 text-amber-700 border-amber-100',
        'Critical': 'bg-red-50 text-red-700 border-red-100',
        'Draft': 'bg-slate-100 text-slate-600 border-slate-200'
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles['Draft']}`}>
            {status}
        </span>
    );
};
