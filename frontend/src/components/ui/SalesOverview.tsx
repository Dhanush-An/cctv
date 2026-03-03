import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface SalesData {
    name: string;
    sales: number;
    bookings: number;
}

interface SalesOverviewProps {
    data?: SalesData[];
}

const defaultData: SalesData[] = [
    { name: 'Jan', sales: 12000, bookings: 10000 },
    { name: 'Feb', sales: 18000, bookings: 14000 },
    { name: 'Mar', sales: 15000, bookings: 12000 },
    { name: 'Apr', sales: 24000, bookings: 19000 },
    { name: 'May', sales: 20000, bookings: 16000 },
    { name: 'Jun', sales: 32000, bookings: 24000 },
    { name: 'Jul', sales: 38000, bookings: 28000 },
];

const SalesOverview = ({ data = defaultData }: SalesOverviewProps) => {
    return (
        <div className="card h-[400px]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Sales Overview</h2>
                    <p className="text-sm text-slate-500">Monthly sales and bookings performance</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                        <span className="text-xs font-medium text-slate-600">Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-medium text-slate-600">Bookings</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSales)"
                    />
                    <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorBookings)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SalesOverview;
