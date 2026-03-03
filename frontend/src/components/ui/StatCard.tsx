import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
    iconBg: string;
    iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, iconBg, iconColor }) => {
    return (
        <div className="card flex items-center gap-4">
            <div className={`p-4 rounded-2xl ${iconBg}`}>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {trend && (
                    <p className="text-xs font-medium text-emerald-500 mt-1">
                        {trend} <span className="text-slate-400 capitalize">from last month</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default StatCard;
