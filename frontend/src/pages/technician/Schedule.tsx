import { useState, useEffect } from 'react';
import { MapPin, Clock, User, CheckCircle2, Navigation } from 'lucide-react';
import { getOrders } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';
import { getEmployees } from '../../utils/employeeStore';
import { useAuth } from '../../context/AuthContext';

const Schedule = () => {
    const { user: userMobile } = useAuth();
    const [jobs, setJobs] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

    useEffect(() => {
        const loadScheduleData = async () => {
            try {
                setLoading(true);
                const [ordersData, employees] = await Promise.all([
                    getOrders(),
                    Promise.resolve(getEmployees())
                ]);

                // Match technician identity
                const currentTech = employees.find(e =>
                    e.mobile === userMobile ||
                    (e.email && e.email.toLowerCase() === (userMobile || '').toLowerCase())
                );

                let techName = 'Dhanush'; // Default fallback
                if (currentTech) {
                    techName = currentTech.name;
                } else if (userMobile === '6379068722') {
                    techName = 'Rajesh Kumar';
                }

                // Filter by technician and active tab
                const filtered = ordersData.filter(order => {
                    const isAssigned = order.technician && techName &&
                        order.technician.toLowerCase().trim() === techName.toLowerCase().trim();

                    if (!isAssigned) return false;

                    if (activeTab === 'Upcoming') {
                        return order.status !== 'Delivered' && order.status !== 'Cancelled';
                    } else {
                        return order.status === 'Delivered' || order.status === 'Cancelled';
                    }
                }).reverse();

                setJobs(filtered);
            } catch (err) {
                console.error("Error loading schedule:", err);
            } finally {
                setLoading(false);
            }
        };

        loadScheduleData();

        // Fix: Use correct event name from orderStore.ts
        const handleOrderUpdate = () => loadScheduleData();
        window.addEventListener('orders-updated', handleOrderUpdate);
        return () => window.removeEventListener('orders-updated', handleOrderUpdate);
    }, [userMobile, activeTab]);

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header */}
            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">My Schedule</h1>
                    <p className="text-slate-500 font-medium">View and manage your upcoming service appointments.</p>
                </div>

                <div className="relative z-10 bg-slate-50 p-1.5 rounded-2xl flex border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setActiveTab('Upcoming')}
                        className={`px-6 py-2.5 font-black text-sm rounded-xl transition-all ${activeTab === 'Upcoming' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('Past')}
                        className={`px-6 py-2.5 font-bold text-sm rounded-xl transition-all ${activeTab === 'Past' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Past Jobs
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading Schedule...</div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Your Schedule is Clear</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                        You have no upcoming service appointments assigned to you at the moment.
                    </p>
                </div>
            ) : (
                <div className="relative">
                    {/* Event Timeline Line connecting the cards */}
                    <div className="absolute left-8 md:left-24 top-10 bottom-10 w-px bg-slate-200 hidden md:block" />

                    <div className="space-y-8">
                        {jobs.map((job) => (
                            <div key={job.id} className="flex flex-col md:flex-row gap-6 md:gap-12 relative group">

                                {/* Timeline Node (Desktop only) */}
                                <div className="hidden md:flex w-48 shrink-0 flex-col items-end text-right relative z-10 pt-6">
                                    <div className="absolute right-0 top-8 translate-x-1/2 w-4 h-4 rounded-full bg-white border-[4px] border-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)] group-hover:scale-125 transition-transform" />
                                    <p className="text-sm font-black text-slate-800 pr-8">{new Date(job.date).toLocaleDateString()}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pr-8 mt-1">
                                        {new Date(job.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>

                                {/* Job Card */}
                                <div className="flex-1 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 md:p-8 relative overflow-hidden">
                                    {/* Mobile date header */}
                                    <div className="md:hidden flex items-center gap-3 mb-4 pb-4 border-b border-slate-50">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center tracking-tighter">
                                            <span className="text-[10px] uppercase font-bold leading-none">{new Date(job.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-sm font-black leading-none">{new Date(job.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{new Date(job.date).toLocaleDateString(undefined, { weekday: 'long' })}</p>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {new Date(job.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 mb-3">
                                                {job.status}
                                            </span>
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight leading-snug max-w-lg mb-1">
                                                {job.items.map(i => i.name).join(', ')}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Order #{job.id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                                                <User className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Client Info</p>
                                                <p className="text-sm font-bold text-slate-800">{job.customerName}</p>
                                                <p className="text-xs font-medium text-slate-500">{job.customerEmail}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0">
                                                <MapPin className="w-4 h-4 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Service Location</p>
                                                <p className="text-sm font-medium text-slate-600 leading-snug">Service Site (Check Order Details)</p>
                                                <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 mt-1 hover:underline">
                                                    <Navigation className="w-3 h-3" /> Get Directions
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
