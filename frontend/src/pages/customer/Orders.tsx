
import { useState, useEffect } from 'react';
import { CreditCard, ChevronRight, X, Package, Clock, Search, CheckCircle2, Truck, AlertCircle, Filter, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrders, updateOrderPaymentStatus } from '../../utils/orderStore';
import { getCustomers } from '../../utils/customerStore';
import { addNotification } from '../../utils/notificationStore';
import { getReviews, addReview } from '../../utils/reviewStore';
import type { Review } from '../../utils/reviewStore';
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

    // Modal States
    const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<Order | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    // Review States
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');

    useEffect(() => {
        fetchOrders();
        fetchReviews();
    }, [user]);

    const fetchReviews = async () => {
        const data = await getReviews();
        setReviews(data);
    };

    const fetchOrders = () => {
        setLoading(true);
        Promise.all([
            getOrders(),
            getCustomers()
        ])
            .then(([orderData, customerData]) => {

                const myProfile = customerData.find(c => c.email.toLowerCase() === (user || '').toLowerCase() || c.mobile === user);
                const userIdentities = [(user || '').toLowerCase()];
                if (myProfile) {
                    userIdentities.push(myProfile.email.toLowerCase());
                    userIdentities.push(myProfile.mobile);
                }

                const myOrders = ['john@example.com', 'customer@demo.com'].includes(user || '')
                    ? orderData
                    : orderData.filter(o => userIdentities.includes(o.customerEmail.toLowerCase()));
                setOrders(myOrders.reverse());
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleReviewSubmit = async () => {
        if (!selectedOrderForReview || !user) return;
        setSubmittingReview(true);

        try {
            await addReview({
                user: user.split('@')[0],
                customerEmail: user,
                rating: reviewRating,
                comment: reviewComment,
                type: selectedOrderForReview.type === 'Product' ? 'Product' : 'Service',
                target: selectedOrderForReview.items.map(i => i.name).join(', '),
                technicianName: selectedOrderForReview.technician,
                orderId: selectedOrderForReview.id
            });

            setSelectedOrderForReview(null);
            setReviewComment('');
            setReviewRating(5);
            fetchReviews();

            // Non-blocking notification
            addNotification({
                userId: user,
                message: "Thank you for your feedback! Your review is pending moderation.",
                type: 'System'
            }).catch(err => console.warn('Notification failed (non-critical):', err));
        } catch (error) {
            console.error('Review submission failed:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedOrderForPayment) return;
        setProcessingPayment(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await updateOrderPaymentStatus(selectedOrderForPayment.id, 'Paid');

            const completedOrder = selectedOrderForPayment;
            setSelectedOrderForPayment(null);
            fetchOrders();

            // Non-blocking notification
            addNotification({
                userId: user || 'customer@demo.com',
                message: `Payment for Order #${String(completedOrder.id || '').slice(-4)} successful!`,
                type: 'Payment'
            }).catch(err => console.warn('Notification failed (non-critical):', err));

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };



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
                                        {order.paymentStatus === 'Unpaid' ? (
                                            <button
                                                onClick={() => setSelectedOrderForPayment(order)}
                                                className="px-5 py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-100 shrink-0 flex items-center gap-2"
                                            >
                                                <CreditCard className="w-4 h-4" /> Pay Now
                                            </button>
                                        ) : (
                                            <div className="px-5 py-2.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl shrink-0 flex items-center gap-2 border border-slate-200/50">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Paid
                                            </div>
                                        )}

                                        <button className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0">
                                            View Invoice
                                        </button>

                                        {order.status !== 'Cancelled' && (
                                            <>
                                                {reviews.some(r => r.orderId === order.id) ? (
                                                    <div className="px-5 py-2.5 bg-indigo-50 text-indigo-500 font-bold text-xs rounded-xl shrink-0 flex items-center gap-2 border border-indigo-100">
                                                        <Star className="w-4 h-4 fill-indigo-400 text-indigo-400" /> Reviewed
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedOrderForReview(order)}
                                                        className="px-5 py-2.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-600 font-black text-xs rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-2"
                                                    >
                                                        <Star className="w-4 h-4" /> Rate Order
                                                    </button>
                                                )}
                                            </>
                                        )}
                                        {order.status !== 'Cancelled' && (
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

            {/* Review Modal */}
            {selectedOrderForReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden border border-slate-100">
                        <div className="flex justify-between items-center p-6 border-b border-slate-50">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 tracking-tight">How was your service?</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Order #{selectedOrderForReview.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrderForReview(null)}
                                className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-500 mb-4">Rate your experience</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setReviewRating(star)}
                                            className="group relative p-1 transition-transform active:scale-90"
                                        >
                                            <Star
                                                className={`w-10 h-10 transition-all ${star <= reviewRating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-200 hover:text-amber-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Write your feedback</label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    placeholder="Tell us what you liked (or what we can improve)..."
                                    rows={4}
                                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[20px] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all resize-none shadow-inner"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setSelectedOrderForReview(null)}
                                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
                                >
                                    Not Now
                                </button>
                                <button
                                    onClick={handleReviewSubmit}
                                    disabled={submittingReview}
                                    className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submittingReview ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "Submit My Review"
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

export default CustomerOrders;
