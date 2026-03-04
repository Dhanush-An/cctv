import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, DollarSign, CheckCircle2, Star, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getOrders } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';
import { getCustomers } from '../../utils/customerStore';
import type { RegisteredCustomer } from '../../utils/customerStore';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [technicianName, setTechnicianName] = useState<string>('Robert Fox');
    const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);

    useEffect(() => {
        const fetchContext = async () => {
            try {
                // Fetch Technician Name
                const emps = await getEmployees();
                const loggedInEmp = emps.find(emp =>
                    (emp.email && emp.email.toLowerCase() === user?.toLowerCase()) ||
                    emp.mobile === user
                );
                if (loggedInEmp) setTechnicianName(loggedInEmp.name);

                // Fetch Customers for lookup
                const custs = await getCustomers();
                setCustomers(custs);
            } catch (err) {
                console.error(err);
            }
        };
        fetchContext();
    }, [user]);

    useEffect(() => {
        getOrders().then(data => {
            const assigned = data.filter(order =>
                order.technician && technicianName &&
                order.technician.toLowerCase().trim() === technicianName.toLowerCase().trim()
            ).reverse();
            setJobs(assigned);
            setLoading(false);
        });
    }, [technicianName]);

    // Helpers for calculating metrics
    const today = new Date().toISOString().split('T')[0]; // simple YYYY-MM-DD for matching
    const currentMonth = new Date().getMonth();

    // Derived Data
    const todaysJobs = jobs.filter(job => job.date === today && job.status !== 'Delivered');
    const completedJobs = jobs.filter(job => job.status === 'Delivered');

    const monthlyEarnings = completedJobs
        .filter(job => new Date(job.date).getMonth() === currentMonth)
        .reduce((sum, job) => sum + job.total, 0);

    const totalEarnings = completedJobs.reduce((sum, job) => sum + job.total, 0);

    // Mocking area chart data based on completed jobs (simplification)
    const earningsData = [
        { name: 'Jan', amount: 0 }, { name: 'Feb', amount: 0 }, { name: 'Mar', amount: 0 },
        { name: 'Apr', amount: 0 }, { name: 'May', amount: 0 }, { name: 'Jun', amount: 0 },
    ];
    // Populate area chart roughly (this could be fully dynamic, but keeping shape for now)
    completedJobs.forEach(job => {
        if (!job.date) return;
        const d = new Date(job.date);
        const month = d.getMonth();
        if (!isNaN(month) && month >= 0 && month < 6) {
            earningsData[month].amount += (job.total || 0);
        }
    });

    const getCustomerInfo = (email: string) => {
        return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    };

    const recentEarnings = completedJobs.slice(0, 3).map(job => ({
        id: job.id,
        type: (job.items && Array.isArray(job.items) && job.items.length > 0) ? job.items.map(i => i.name).join(', ') : 'Service',
        customer: getCustomerInfo(job.customerEmail)?.name || job.customerName || 'Unknown',
        amount: job.total || 0,
        time: job.date ? new Date(job.date).toLocaleDateString() : 'Unknown'
    }));

    const upcomingSchedule = jobs.filter(job => job.status !== 'Delivered').slice(0, 3).map(job => ({
        id: job.id,
        type: `${job.items && Array.isArray(job.items) && job.items.length > 0 ? job.items[0].name : 'Service'} - ${job.date ? new Date(job.date).toLocaleDateString() : 'Unknown'}`,
        distance: 'Location details in job info'
    }));

    // For Nearby Jobs, we will just pass empty for now or use upcoming if needed
    const nearbyJobs: any[] = [];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading metrics...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Today's Jobs</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-800">{todaysJobs.length}</span>
                            <MapPin className="w-5 h-5 text-teal-400" />
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                        <CalendarDays className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Monthly Earnings</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-800">${monthlyEarnings.toLocaleString()}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                            Current Month
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Jobs Completed</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-800">{completedJobs.length}</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 mb-1">Ratings</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-800">4.7</span>
                            <div className="flex gap-0.5 text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assigned Jobs */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-800">Assigned Jobs Today</h2>
                        <button
                            onClick={() => navigate('/technician/jobs')}
                            className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {jobs.filter(j => j.status !== 'Delivered').slice(0, 4).map((job) => (
                            <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                        {(getCustomerInfo(job.customerEmail)?.name || job.customerName || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">
                                            {getCustomerInfo(job.customerEmail)?.name || job.customerName}
                                        </p>
                                        <p className="text-xs font-semibold text-slate-500">
                                            {job.items && Array.isArray(job.items) && job.items.length > 0 ? job.items[0].name : 'Service'}
                                            <span className="ml-2 font-black text-slate-800">{job.date ? new Date(job.date).toLocaleDateString() : ''}</span>
                                        </p>
                                    </div>
                                </div>
                                <button className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${job.status === 'Processing' ? 'bg-indigo-600 text-white hover:bg-indigo-700' :
                                    job.status === 'Shipped' ? 'bg-amber-500 text-white hover:bg-amber-600' :
                                        'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                    }`}>
                                    {job.status === 'Shipped' ? 'In Progress' : job.status}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/technician/jobs')}
                        className="w-full mt-6 py-3 border border-slate-200 text-indigo-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm"
                    >
                        View All Jobs
                    </button>
                </div>

                {/* Monthly Earnings Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Monthly Earnings</h2>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                    dx={-10}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Total Earnings:</p>
                            <p className="text-2xl font-black text-slate-800">${totalEarnings.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 mb-1">Jobs Completed:</p>
                            <p className="text-2xl font-black text-slate-800">{completedJobs.length}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => navigate('/technician/earnings')}
                            className="flex-1 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all text-sm"
                        >
                            View Details
                        </button>
                        <button className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                            <CalendarDays className="w-4 h-4" /> Jun 2023
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-8">
                    <div className="flex-1 space-y-4">
                        <h3 className="text-sm font-bold text-slate-500">Recent Earnings</h3>
                        {recentEarnings.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{item.type}</p>
                                    <p className="text-xs font-semibold text-slate-500">{item.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-800">${item.amount}</p>
                                    <p className="text-xs font-semibold text-slate-500">{item.time}</p>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => navigate('/technician/earnings')}
                            className="w-full py-2 text-indigo-600 font-bold border border-slate-200 rounded-lg hover:bg-slate-50 text-sm"
                        >
                            View All
                        </button>
                    </div>

                    <div className="flex-1 space-y-4">
                        <h3 className="text-sm font-bold text-slate-500">Upcoming Schedule</h3>
                        {upcomingSchedule.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <span className="text-xs font-bold">O</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800">{item.type}</p>
                                    <p className="text-[10px] font-semibold text-slate-500">{item.distance}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Nearby Jobs</h3>
                    </div>
                    <div className="space-y-3">
                        {nearbyJobs.map(job => (
                            <div key={job.id} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <img src={job.avatar} alt={job.name} className="w-8 h-8 rounded-full object-cover" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">{job.name}</p>
                                        <p className="text-[10px] font-semibold text-slate-500">{job.distance}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-800">${job.price}</p>
                                    <p className="text-[10px] font-semibold text-slate-500">Apr 23</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 border border-slate-200 text-indigo-600 font-bold rounded-lg hover:bg-slate-50 text-sm">View All</button>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-800">Nearby Jobs</h3>
                        <button className="text-slate-400 hover:bg-slate-50 p-1 rounded">▼</button>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-xl relative overflow-hidden min-h-[200px]">
                        {/* Map Placeholder */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="bg-white text-indigo-600 font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform text-sm">View All</button>
                        </div>
                        {/* Fake Pins */}
                        <MapPin className="absolute top-1/4 left-1/4 w-6 h-6 text-indigo-600 fill-white" />
                        <MapPin className="absolute top-1/2 left-1/2 w-6 h-6 text-indigo-600 fill-white" />
                        <MapPin className="absolute bottom-1/3 right-1/4 w-6 h-6 text-indigo-600 fill-white" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
