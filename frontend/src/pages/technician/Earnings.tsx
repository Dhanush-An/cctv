import { useState } from 'react';
import {
    DollarSign,
    TrendingUp,
    Wallet,
    CheckCircle2,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Briefcase
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const mockEarningsData = [
    { name: 'Jan', earnings: 45000 },
    { name: 'Feb', earnings: 52000 },
    { name: 'Mar', earnings: 48000 },
    { name: 'Apr', earnings: 61000 },
    { name: 'May', earnings: 59000 },
    { name: 'Jun', earnings: 68000 },
];

const mockTransactions = [
    { id: 'TRX-9921', date: '2023-10-24', description: 'CCTV Installation - Villa', amount: 4500, status: 'Completed' },
    { id: 'TRX-9920', date: '2023-10-22', description: 'Monthly Maintenance', amount: 1200, status: 'Completed' },
    { id: 'TRX-9919', date: '2023-10-20', description: 'DVR Repair & Setup', amount: 2800, status: 'Processing' },
    { id: 'TRX-9918', date: '2023-10-18', description: 'Office Network Camera', amount: 5500, status: 'Completed' },
    { id: 'TRX-9917', date: '2023-10-15', description: 'Camera Relocation', amount: 800, status: 'Completed' },
];

const Earnings = () => {
    const [timeframe, setTimeframe] = useState('This Month');

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Earnings Overview</h1>
                    <p className="text-slate-500 font-medium">Track your income, payouts, and job statistics.</p>
                </div>

                <div className="relative z-10 flex gap-3">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    >
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Last 3 Months</option>
                        <option>This Year</option>
                    </select>
                    <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: 'Total Earnings',
                        value: '₹68,000',
                        trend: '+12.5%',
                        up: true,
                        icon: DollarSign,
                        color: 'text-emerald-600',
                        bg: 'bg-emerald-50'
                    },
                    {
                        title: 'Pending Payout',
                        value: '₹12,400',
                        trend: 'Processing',
                        up: null,
                        icon: Wallet,
                        color: 'text-amber-600',
                        bg: 'bg-amber-50'
                    },
                    {
                        title: 'Completed Jobs',
                        value: '42',
                        trend: '+4',
                        up: true,
                        icon: Briefcase,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50'
                    },
                    {
                        title: 'Avg. Job Value',
                        value: '₹1,650',
                        trend: '-2.1%',
                        up: false,
                        icon: TrendingUp,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50'
                    }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {stat.trend !== 'Processing' && (
                                <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.trend}
                                </span>
                            )}
                            {stat.trend === 'Processing' && (
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">Pending</span>
                            )}
                        </div>
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.title}</h3>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Revenue Overview</h2>
                            <p className="text-sm text-slate-400 font-medium">Your earnings over the last 6 months</p>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mockEarningsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    tickFormatter={(val) => `₹${val / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F8FAFC' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                                    formatter={(value: any) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Earnings']}
                                />
                                <Bar dataKey="earnings" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Column - Goal/Promo */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-500/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="text-emerald-100 font-bold text-xs uppercase tracking-widest mb-2">Monthly Goal</h3>
                            <p className="text-3xl font-black mb-1">₹80,000</p>
                            <p className="text-sm font-medium text-emerald-50 mb-6">You're 85% there. Keep it up!</p>

                            <div className="w-full bg-black/20 rounded-full h-3 mb-2 overflow-hidden backdrop-blur-sm">
                                <div className="bg-white h-3 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-xs font-bold text-emerald-100 text-right">₹12,000 remaining</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Payout Schedule</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Calendar className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">Next Payout</p>
                                    <p className="text-xs text-slate-500">October 31, 2023</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <DollarSign className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-700 text-sm">Amount</p>
                                    <p className="text-xs text-slate-500 font-medium">₹12,400 processing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-6 md:px-8 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-800">Recent Transactions</h2>
                    <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50">
                                <th className="py-4 px-6 md:px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase">Transaction ID</th>
                                <th className="py-4 px-6 md:px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase">Date</th>
                                <th className="py-4 px-6 md:px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase">Description</th>
                                <th className="py-4 px-6 md:px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase text-right">Amount</th>
                                <th className="py-4 px-6 md:px-8 text-[11px] font-black tracking-widest text-slate-400 uppercase text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {mockTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="py-4 px-6 md:px-8">
                                        <span className="text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">{trx.id}</span>
                                    </td>
                                    <td className="py-4 px-6 md:px-8 text-sm font-medium text-slate-600">{trx.date}</td>
                                    <td className="py-4 px-6 md:px-8 text-sm font-bold text-slate-800">{trx.description}</td>
                                    <td className="py-4 px-6 md:px-8 text-sm font-black text-slate-800 text-right">
                                        ₹{trx.amount.toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-4 px-6 md:px-8 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border
                                            ${trx.status === 'Completed'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-amber-50 text-amber-600 border-amber-100'
                                            }
                                        `}>
                                            {trx.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                            {trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Earnings;
