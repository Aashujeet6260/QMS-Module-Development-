import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, CircleDot } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const lowerStatus = status.toLowerCase();
    
    const statusConfig = {
        open: { text: 'Open', color: 'blue', icon: <CircleDot size={12} /> },
        investigation: { text: 'Investigation', color: 'orange', icon: <AlertTriangle size={12} /> },
        closed: { text: 'Closed', color: 'green', icon: <CheckCircle size={12} /> },
        low: { text: 'Low', color: 'gray', icon: <ShieldAlert size={12} /> },
        medium: { text: 'Medium', color: 'orange', icon: <ShieldAlert size={12} /> },
        high: { text: 'High', color: 'red', icon: <ShieldAlert size={12} /> },
    };

    const config = statusConfig[lowerStatus] || { text: status, color: 'gray', icon: <CircleDot size={12} /> };

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-700',
        orange: 'bg-orange-100 text-orange-700',
        green: 'bg-green-100 text-green-700',
        gray: 'bg-slate-100 text-slate-700',
        red: 'bg-red-100 text-red-700',
    };

    const className = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${colorClasses[config.color]}`;
    
    return (
        <span className={className}>
            {config.icon}
            {config.text}
        </span>
    );
};

export default StatusBadge;