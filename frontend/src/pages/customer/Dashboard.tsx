import { useState, useEffect, useMemo } from 'react';
import {
    ShoppingBag, Wrench, DollarSign, CalendarCheck,
    ChevronRight, MapPin, Search, Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import { getProducts, getBookings, SYNC_CHANNEL } from '../../utils/dataStore';
import type { Product, ServiceBooking } from '../../utils/dataStore';
import type { RegisteredCustomer } from '../../utils/customerStore';

const statusStyles: Record<string, string> = {
    Delivered: 'bg-emerald-100 text-emerald-700',
    Installed: 'bg-blue-100 text-blue-700',
    Shipped: 'bg-amber-100 text-amber-700',
    Processing: 'bg-orange-100 text-orange-700',
    Scheduled: 'bg-indigo-100 text-indigo-700',
    Confirmed: 'bg-sky-100 text-sky-700',
    'In Progress': 'bg-violet-100 text-violet-700',
    Completed: 'bg-emerald-100 text-emerald-700',
    Today: 'bg-rose-100 text-rose-600',
};

const recentOrders = [
    { id: '#1045', product: 'Hikvision Dome Camera', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=80', date: 'Apr 24, 2024', amount: 499, status: 'Delivered' },
    { id: '#1044', product: '4 Camera Setup', image: 'https://images.unsplash.com/photo-1524286011011-bb43-47bcf8c8ef2?auto=format&fit=crop&q=80&w=80', date: 'Apr 20, 2024', amount: 599, status: 'Installed' },
    { id: '#1043', product: 'Dahua DVR', image: 'https://images.unsplash.com/photo-1590483734724-383b85ad05ca?auto=format&fit=crop&q=80&w=80', date: 'Apr 12, 2024', amount: 280, status: 'Shipped' },
];

const CustomerDashboard = () => {
    const [trackId, setTrackId] = useState('');
    const { user } = useAuth();
    const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refresh = () => {
            Promise.all([
                getCustomers(),
                getProducts(),
                getBookings()
            ]).then(([custData, prodData, bookData]) => {
                setCustomers(custData);
                setProducts(prodData);
                setBookings(bookData);
            }).finally(() => setLoading(false));
        };

        refresh();
        window.addEventListener('products-updated', refresh);
        window.addEventListener('bookings-updated', refresh);

        SYNC_CHANNEL.onmessage = (e: MessageEvent) => {
            if (e.data.type === 'products-updated' || e.data.type === 'bookings-updated') {
                refresh();
            }
        };

        return () => {
            window.removeEventListener('products-updated', refresh);
            window.removeEventListener('bookings-updated', refresh);
        };
    }, []);

    // Resolve data
    const customerName = useMemo(() => {
        if (!user) return 'Customer';
        const registeredMatch = customers.find(
            (c) => c.email.toLowerCase() === user.toLowerCase()
        );
        const isDemo = user === 'john@example.com';
        return registeredMatch?.name ?? (isDemo ? 'John Doe' : user.split('@')[0]) ?? 'Customer';
    }, [customers, user]);

    const activeBookings = useMemo(() =>
        bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress'),
        [bookings]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-black text-slate-800">Welcome back, {(customerName || 'Customer').split(' ')[0]}! 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Here's what's happening with your account today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Total Orders</p>
                        <p className="text-xl font-black text-slate-800">8</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl p-4 shadow-sm shadow-orange-200 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <Wrench className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Active Installs</p>
                        <p className="text-xl font-black text-white">{activeBookings.length}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl p-4 shadow-sm shadow-emerald-200 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Total Spent</p>
                        <p className="text-xl font-black text-white">₹1,870</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl p-4 shadow-sm shadow-indigo-200 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                        <CalendarCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wide">Pending Bookings</p>
                        <p className="text-xl font-black text-white">{bookings.filter(b => b.status === 'Confirmed').length}</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders + Active Installations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 overflow-hidden">
                    <div className="flex items-center justify-between p-5 pb-3">
                        <h2 className="text-base font-bold text-slate-800">Recent Orders</h2>
                        <button className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-y border-slate-100">
                                    <th className="text-left text-xs font-bold text-slate-500 px-5 py-3">Order ID</th>
                                    <th className="text-left text-xs font-bold text-slate-500 px-2 py-3">Product</th>
                                    <th className="text-left text-xs font-bold text-slate-500 px-2 py-3 hidden sm:table-cell">Date</th>
                                    <th className="text-left text-xs font-bold text-slate-500 px-2 py-3">Amount</th>
                                    <th className="text-left text-xs font-bold text-slate-500 px-2 py-3 pr-5">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-slate-500 text-xs">{order.id}</td>
                                        <td className="px-2 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img src={order.image} alt={order.product} className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0" />
                                                <span className="font-semibold text-slate-800 text-xs whitespace-nowrap">{order.product}</span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3.5 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">{order.date}</td>
                                        <td className="px-2 py-3.5 font-bold text-slate-800 text-xs">₹{order.amount}</td>
                                        <td className="px-2 py-3.5 pr-5">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyles[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Service Bookings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-slate-800">Active Installations</h2>
                        <button className="text-sm text-indigo-600 font-bold hover:underline">View All</button>
                    </div>
                    {activeBookings.length === 0 ? (
                        <p className="text-center text-slate-400 text-xs py-8">No active bookings.</p>
                    ) : (
                        <div className="space-y-3">
                            {activeBookings.slice(0, 3).map((b) => (
                                <div key={b.id} className="p-3.5 border border-slate-100 rounded-xl hover:border-indigo-100 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{b.type}</p>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3" /> {b.address}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${statusStyles[b.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {b.status}
                                        </span>
                                    </div>
                                    {b.technician && (
                                        <p className="text-[10px] text-slate-400 mt-2">👷 {b.technician} · {b.date}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Wishlist from Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-slate-800">Saved Items (Wishlist)</h2>
                    <button className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {products.slice(0, 4).map((item) => (
                        <div key={item.id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <img src={item.image} alt={item.name} className="w-full h-28 object-cover" />
                            <div className="p-3">
                                <p className="font-bold text-slate-800 text-xs mb-1 truncate">{item.name}</p>
                                <div className="flex items-center gap-0.5 mb-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-2.5 h-2.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                    ))}
                                </div>
                                <p className="font-black text-slate-800 text-sm mb-2">₹{item.offerPrice ?? item.price}</p>
                                <button className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors">Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Track Order */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h2 className="text-base font-bold text-slate-800 mb-1">Track Your Order</h2>
                <p className="text-xs text-slate-500 mb-4">Enter your order ID to get real-time status updates.</p>
                <form onSubmit={(e) => { e.preventDefault(); alert(`Tracking: ${trackId}`); }} className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text" value={trackId} onChange={(e) => setTrackId(e.target.value)}
                            placeholder="e.g. #1045"
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        />
                    </div>
                    <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-indigo-200 whitespace-nowrap">Track</button>
                </form>
            </div>
        </div>
    );
};

export default CustomerDashboard;
