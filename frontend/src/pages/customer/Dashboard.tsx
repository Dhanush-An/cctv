import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag, Wrench, DollarSign, CalendarCheck,
    ChevronRight, MapPin, Search, Star, Package, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import { getProducts, getBookings, SYNC_CHANNEL } from '../../utils/dataStore';
import { getOrders, updateOrderPaymentStatus } from '../../utils/orderStore';
import { addNotification } from '../../utils/notificationStore';
import { getWishlistItems } from '../../utils/wishlistStore';
import { addToCart } from '../../utils/cartStore';
import type { Product, ServiceBooking } from '../../utils/dataStore';

import type { RegisteredCustomer } from '../../utils/customerStore';
import type { Order } from '../../utils/orderStore';

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

const CustomerDashboard = () => {
    const [trackId, setTrackId] = useState('');
    const { user } = useAuth();
    const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);

    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);


    // Modal States
    const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const refreshData = () => {
        Promise.all([
            getCustomers(),
            getProducts(),
            getBookings(),
            getOrders()
        ]).then(([custData, prodData, bookData, orderData]) => {
            setCustomers(custData);


            const myProfile = custData.find(c => c.email.toLowerCase() === (user || '').toLowerCase() || c.mobile === user);
            const userIdentities = [(user || '').toLowerCase()];
            if (myProfile) {
                userIdentities.push(myProfile.email.toLowerCase());
                userIdentities.push(myProfile.mobile);
            }

            const myOrders = ['john@example.com', 'customer@demo.com'].includes(user || '')
                ? orderData
                : orderData.filter(o => userIdentities.includes(o.customerEmail.toLowerCase()));
            setOrders(myOrders.reverse());

            const myBookings = ['john@example.com', 'customer@demo.com'].includes(user || '')
                ? bookData
                : bookData.filter(b => b.customerName === (myProfile?.name || ''));
            setBookings(myBookings.reverse());

            // Fetch wishlist items
            getWishlistItems(user || '').then(wishItems => {
                const wishProdIds = wishItems.map(wi => wi.productId);
                setWishlistProducts(prodData.filter(p => wishProdIds.includes(p.id)));
            });
        }).finally(() => setLoading(false));

    };

    useEffect(() => {
        refreshData();

        const hProducts = () => refreshData();
        const hBookings = () => refreshData();
        const hOrders = () => refreshData();

        window.addEventListener('products-updated', hProducts);
        window.addEventListener('bookings-updated', hBookings);
        window.addEventListener('orders-updated', hOrders);
        window.addEventListener('wishlist-updated', refreshData);

        SYNC_CHANNEL.onmessage = (e: MessageEvent) => {
            if (['products-updated', 'bookings-updated', 'orders-updated', 'wishlist-updated'].includes(e.data.type)) {
                refreshData();
            }
        };

        return () => {
            window.removeEventListener('products-updated', hProducts);
            window.removeEventListener('bookings-updated', hBookings);
            window.removeEventListener('orders-updated', hOrders);
            window.removeEventListener('wishlist-updated', refreshData);
        };

    }, [user]);

    // Resolve data
    const customerName = useMemo(() => {
        if (!user) return 'Customer';
        const registeredMatch = customers.find(
            (c) => c.email.toLowerCase() === user.toLowerCase() || c.mobile === user
        );
        const isDemo = user === 'john@example.com';
        return registeredMatch?.name ?? (isDemo ? 'John Doe' : user.split('@')[0]) ?? 'Customer';
    }, [customers, user]);

    const totalSpent = useMemo(() => {
        return orders
            .filter(o => o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + o.total, 0);
    }, [orders]);

    const activeBookings = useMemo(() =>
        bookings.filter(b => b.status === 'Confirmed' || b.status === 'In Progress'),
        [bookings]);

    const handlePayment = async () => {
        if (!selectedOrderForPayment) return;
        setProcessingPayment(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await updateOrderPaymentStatus(selectedOrderForPayment.id, 'Paid');

            const orderToReview = selectedOrderForPayment;
            setSelectedOrderForPayment(null);
            refreshData(); // Refresh local list

            // Non-blocking notification - don't crash payment on notification failure
            if (orderToReview) {
                addNotification({
                    userId: user || 'customer@demo.com',
                    message: `Payment for Order #${String(orderToReview.id || '').slice(-4)} successful!`,
                    type: 'Payment'
                }).catch(err => console.warn('Notification failed (non-critical):', err));
            }

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const handleTrackOrder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackId.trim()) return;
        const found = orders.find(o =>
            o.id?.toLowerCase().includes(trackId.toLowerCase()) ||
            String(o.id).endsWith(trackId.replace('#', ''))
        );
        if (found) {
            alert(`Order ${found.id}\nStatus: ${found.status}\nTotal: ₹${found.total.toLocaleString('en-IN')}\nDate: ${found.date}`);
        } else {
            alert(`No order found matching "${trackId}". Please check the order ID.`);
        }
    };



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
                        <p className="text-xl font-black text-slate-800">{orders.length}</p>
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
                        <p className="text-xl font-black text-white">₹{totalSpent.toLocaleString()}</p>
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
                        <Link to="/customer/orders" className="flex items-center gap-1 text-sm text-indigo-600 font-bold hover:underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
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
                                {orders.slice(0, 4).map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3.5 font-bold text-slate-500 text-xs">{order.id}</td>
                                        <td className="px-2 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                                                    <Package className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <span className="font-semibold text-slate-800 text-xs truncate max-w-[150px]">
                                                    {order.items.map(i => i.name).join(', ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-2 py-3.5 text-slate-400 text-xs hidden sm:table-cell whitespace-nowrap">
                                            {order.date}
                                        </td>
                                        <td className="px-2 py-3.5 font-black text-slate-800 text-xs">₹{order.total.toLocaleString('en-IN')}</td>
                                        <td className="px-2 py-3.5 pr-2">
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${statusStyles[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3.5 pr-5 text-right w-24">
                                            {order.paymentStatus === 'Unpaid' ? (
                                                <button
                                                    onClick={() => setSelectedOrderForPayment(order)}
                                                    className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-[11px] rounded-xl shadow-sm whitespace-nowrap transition-all"
                                                >
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg whitespace-nowrap">
                                                    Paid
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-8 text-center text-slate-500 text-xs">
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Service Bookings */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-slate-800">Active Installations</h2>
                        <Link to="/customer/bookings" className="text-sm text-indigo-600 font-bold hover:underline">View All</Link>
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
                    <Link to="/customer/wishlist" className="text-sm text-indigo-600 font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-3.5 h-3.5" /></Link>
                </div>
                {wishlistProducts.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs text-center border-2 border-dashed border-slate-100 rounded-xl">
                        Your wishlist is empty.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {wishlistProducts.slice(0, 4).map((item) => (
                            <div key={item.id} className="border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <img src={item.image} alt={item.name} className="w-full h-28 object-cover" />
                                <div className="p-3">
                                    <p className="font-bold text-slate-800 text-xs mb-1 truncate">{item.name}</p>
                                    <div className="flex items-center gap-0.5 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-2.5 h-2.5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                        ))}
                                    </div>
                                    <p className="font-black text-slate-800 text-sm mb-2">₹{(item.offerPrice ?? item.price).toLocaleString('en-IN')}</p>
                                    <button
                                        onClick={() => addToCart({
                                            id: item.id,
                                            name: item.name,
                                            image: item.image,
                                            price: item.price,
                                            offerPrice: item.offerPrice,
                                            category: item.category,
                                        })}
                                        className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Track Order */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h2 className="text-base font-bold text-slate-800 mb-1">Track Your Order</h2>
                <p className="text-xs text-slate-500 mb-4">Enter your order ID to get real-time status updates.</p>
                <form onSubmit={handleTrackOrder} className="flex gap-3">
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

            {/* Payment Modal */}
            {selectedOrderForPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">

                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-100">
                            <h2 className="text-[17px] font-bold text-slate-800">Complete Your Payment</h2>
                            <button
                                onClick={() => setSelectedOrderForPayment(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Amount Display */}
                            <div className="flex items-center justify-center py-4 mb-2 border-b border-slate-100">
                                <span className="text-slate-600 font-medium mr-2">Amount to Pay:</span>
                                <span className="text-xl font-black text-slate-800">
                                    ₹{selectedOrderForPayment.total.toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => setSelectedOrderForPayment(null)}
                                    className="flex-1 py-3 bg-slate-500 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors shrink-0"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={processingPayment}
                                    className="flex-[1.5] relative py-3 bg-[#1A56DB] hover:bg-blue-700 text-white font-bold rounded-xl overflow-hidden group transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                    {processingPayment ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        "Pay Now"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDashboard;
