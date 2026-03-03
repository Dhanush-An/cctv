import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Filter, Wrench, Shield, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';

const statusConfig: Record<string, { icon: any, color: string, bg: string, text: string }> = {
    'Delivered': { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100/50', text: 'Completed' },
    'Processing': { icon: Wrench, color: 'text-amber-700', bg: 'bg-amber-100/50', text: 'In Progress' },
    'Pending': { icon: Clock, color: 'text-blue-700', bg: 'bg-blue-100/50', text: 'Scheduled' },
    'Cancelled': { icon: XCircle, color: 'text-rose-700', bg: 'bg-rose-100/50', text: 'Cancelled' },
};

const CustomerBookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getOrders()
            .then(data => {
                // Filter down to only bookings (Orders that include 'Service' or 'Mixed' categories)
                const allServiceOrders = data.filter(o => o.type === 'Service' || o.type === 'Mixed');

                // Demo auth bypass for local dev
                const myBookings = ['john@example.com', 'customer@demo.com'].includes(user || '')
                    ? allServiceOrders
                    : allServiceOrders.filter(o => o.customerEmail.toLowerCase() === (user || '').toLowerCase());

                setBookings(myBookings.reverse());
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const filteredBookings = bookings.filter(booking => {
        // Map order statuses to booking statuses mentally
        const mapping: Record<string, string> = {
            'Delivered': 'Completed',
            'Shipped': 'Completed', // Treat shipped services as completed for simplicity
            'Processing': 'In Progress',
            'Pending': 'Scheduled',
            'Cancelled': 'Cancelled'
        };

        const interpretedStatus = mapping[booking.status] || 'Scheduled';
        const matchesFilter = filter === 'All' || interpretedStatus === filter;

        const matchesSearch = booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 lg:ml-20 xl:ml-0">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Bookings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your installation and maintenance appointments.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a booking..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="All">All Bookings</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm mt-8">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">No bookings found</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                        {searchQuery || filter !== 'All'
                            ? "We couldn't find any appointments matching your exact search filters."
                            : "You don't have any service appointments scheduled. Need help with installation? Book an expert today."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {filteredBookings.map(booking => {
                        // Normalize order status to booking terminology
                        const bookingStatus = ['Shipped', 'Delivered'].includes(booking.status) ? 'Delivered' : booking.status;
                        const status = statusConfig[bookingStatus] || statusConfig['Pending'];
                        const StatusIcon = status.icon;

                        // Pick out only the items that were services
                        const serviceItems = booking.items.filter(item => (item.category || '').toLowerCase().includes('service') || booking.type === 'Service');
                        const primaryService = serviceItems[0] || booking.items[0];

                        return (
                            <div key={booking.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                {/* Booking Header */}
                                <div className="p-6 border-b border-slate-50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 opacity-50"></div>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/40 ${status.bg} ${status.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="text-xs font-bold tracking-wide">{status.text}</span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">#{booking.id.slice(-6)}</p>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-800 leading-tight mb-2 pr-4">{primaryService.name}</h3>

                                    {serviceItems.length > 1 && (
                                        <p className="text-sm font-medium text-indigo-600 mb-2">
                                            + {serviceItems.length - 1} other service{serviceItems.length > 2 ? 's' : ''}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-700">{booking.date.split(',')[0]}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-700">Standard Slot</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="p-6 bg-slate-50/50 flex-1">
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Service Location</p>
                                                <p className="text-sm font-semibold text-slate-700">Used account default address</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Technician</p>
                                                {booking.technician ? (
                                                    <p className="text-sm font-semibold text-slate-700">{booking.technician}</p>
                                                ) : (
                                                    <p className="text-sm font-semibold text-slate-400 italic">Assigning soon...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Action */}
                                <div className="p-4 border-t border-slate-50 bg-white grid grid-cols-2 gap-3">
                                    <button className="py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all">
                                        Reschedule
                                    </button>
                                    <button className="py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm rounded-xl transition-all">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomerBookings;
