import { useState, useEffect } from 'react';
import { Package, Clock, Filter, Search, ChevronRight, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrders } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';

const statusConfig: Record<string, { icon: any, color: string, bg: string }> = {
    'Delivered': { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-100/50' },
    'Shipped': { icon: Truck, color: 'text-blue-700', bg: 'bg-blue-100/50' },
    'Processing': { icon: Package, color: 'text-amber-700', bg: 'bg-amber-100/50' },
    'Pending': { icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
    'Cancelled': { icon: AlertCircle, color: 'text-rose-700', bg: 'bg-rose-100/50' },
};

const CustomerOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Fetch all orders from backend
        // Note: For now we'll fetch all and filter client side. In prod, backend should filter by customer email
        getOrders()
            .then(data => {
                // For demo logic: 'Demo Customer' or 'john@example.com' owns all orders temporarily on this local setup
                // In production, we'd filter tightly: `data.filter(o => o.customerEmail === user)`
                const myOrders = ['john@example.com', 'customer@demo.com'].includes(user || '')
                    ? data
                    : data.filter(o => o.customerEmail.toLowerCase() === (user || '').toLowerCase());

                // Sort by date descending (assuming string format parses nicely or just reverse array for now)
                setOrders(myOrders.reverse());
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [user]);

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'All' || order.status === filter;
        const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Orders</h1>
                    <p className="text-slate-500 text-sm mt-1">View and track your previous purchases.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
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
                            <option value="All">All Orders</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    </div>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm">
                    <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No orders found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        {searchQuery || filter !== 'All'
                            ? "We couldn't find any orders matching your filters."
                            : "You haven't placed any orders yet. Once you do, they'll appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => {
                        const status = statusConfig[order.status] || statusConfig['Pending'];
                        const StatusIcon = status.icon;

                        return (
                            <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                {/* Order Header */}
                                <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Order ID</p>
                                            <p className="font-bold text-slate-800 text-sm">{order.id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date Placed</p>
                                            <p className="font-semibold text-slate-700 text-sm">{order.date.split(',')[0]}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                                            <p className="font-black text-slate-800 text-sm">₹{order.total.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/40 ${status.bg} ${status.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            <span className="text-xs font-bold tracking-wide">{order.status}</span>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors sm:hidden group-hover:block">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center overflow-hidden">
                                                    {/* In a real app we'd pass the image down too, but we fallback to a placeholder if not present via the interface */}
                                                    <Package className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">{item.category || 'Product'}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className="font-black text-slate-800 text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                                                    <p className="text-xs font-bold text-slate-400 mt-0.5">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action row */}
                                    <div className="mt-6 pt-5 border-t border-slate-50 flex flex-wrap items-center gap-3">
                                        {order.status === 'Delivered' && (
                                            <button className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors shrink-0">
                                                Write a Review
                                            </button>
                                        )}
                                        <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0">
                                            View Invoice
                                        </button>
                                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                            <button className="px-5 py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs transition-colors shrink-0 ml-auto">
                                                Need Help?
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomerOrders;
