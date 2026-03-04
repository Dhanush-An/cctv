import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, ShoppingBag, CalendarCheck, Heart, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import { getCartCount } from '../../utils/cartStore';
import { getOrders, updateOrderPaymentStatus } from '../../utils/orderStore';

import { getNotifications, markAsRead, markAllAsRead, addNotification } from '../../utils/notificationStore';
import type { Order } from '../../utils/orderStore';
import type { Notification } from '../../utils/notificationStore';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [displayName, setDisplayName] = useState('Customer');
    const [displayEmail, setDisplayEmail] = useState(user ?? '');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Mandatory Payment Blocker States
    const [blockingOrder, setBlockingOrder] = useState<Order | null>(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        getCartCount().then(setCartCount);
        getCustomers().then(customers => {
            const registeredMatch = customers.find(
                (c) => c.mobile === user || c.email.toLowerCase() === (user ?? '').toLowerCase()
            );
            if (registeredMatch) {
                setDisplayName(registeredMatch.name);
                setDisplayEmail(registeredMatch.email);
            } else {
                setDisplayName('Customer');
                setDisplayEmail(user ?? '');
            }
        });

        // Check for any outstanding payments
        Promise.all([
            getOrders(),
            getCustomers()
        ]).then(([orders, customers]) => {
            const myProfile = customers.find(c => c.email.toLowerCase() === (user || '').toLowerCase() || c.mobile === user);
            const userIdentities = [(user || '').toLowerCase()];
            if (myProfile) {
                userIdentities.push(myProfile.email.toLowerCase());
                userIdentities.push(myProfile.mobile);
            }

            const myOrders = ['john@example.com', 'customer@demo.com'].includes(user || '')
                ? orders
                : orders.filter(o => userIdentities.includes(o.customerEmail.toLowerCase()));

            const unpaidOrder = myOrders.find(o => o.status === 'Delivered' && o.paymentStatus === 'Unpaid');
            if (unpaidOrder) {
                setBlockingOrder(unpaidOrder);
            }
        });
    }, [location, user]);
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fetchNotifications = async () => {
        if (user) {
            const data = await getNotifications(user);
            setNotifications(data);
        }
    };

    useEffect(() => {
        fetchNotifications();
        window.addEventListener('notifications-updated', fetchNotifications);
        return () => window.removeEventListener('notifications-updated', fetchNotifications);
    }, [user]);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setProfileOpen(false);
    };

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllAsRead = async () => {
        if (user) {
            await markAllAsRead(user);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handlePayment = async () => {
        if (!blockingOrder) return;
        setProcessingPayment(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await updateOrderPaymentStatus(blockingOrder.id, 'Paid');
            const completedOrder = blockingOrder;
            setBlockingOrder(null);

            await addNotification({
                userId: user || 'customer@demo.com',
                message: `Payment for Order #${completedOrder.id.slice(-4)} successful!`,
                type: 'Payment'
            });
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setProcessingPayment(false);
        }
    };



    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Top Navbar */}
            <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="relative flex items-center h-full px-6">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow">
                            <span className="text-white font-black text-base">C</span>
                        </div>
                        <span className="font-black text-lg text-slate-800 tracking-tight">CAMERA</span>
                    </div>

                    {/* Center: Nav links */}
                    <nav className="hidden md:flex items-center gap-6 mx-auto">
                        <NavLink
                            to="/customer"
                            end
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/customer/products"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/customer/services"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`
                            }
                        >
                            Services
                        </NavLink>
                        <NavLink
                            to="/customer/contact"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`
                            }
                        >
                            Contact
                        </NavLink>

                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        {/* Cart icon */}
                        <button
                            onClick={() => navigate('/customer/cart')}
                            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={handleNotificationClick}
                                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all group relative"
                            >
                                <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform origin-top" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                                )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={handleMarkAllAsRead}
                                                className="text-[10px] font-bold text-indigo-600 hover:underline px-2 py-1"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-10 text-center">
                                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                                <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className={`px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                                                >
                                                    {!notification.read && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                                    )}
                                                    <div className="flex gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notification.type === 'Order' ? 'bg-blue-100 text-blue-600' :
                                                            notification.type === 'Payment' ? 'bg-emerald-100 text-emerald-600' :
                                                                notification.type === 'Review' ? 'bg-amber-100 text-amber-600' :
                                                                    'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {notification.type === 'Order' ? <ShoppingBag className="w-4 h-4" /> :
                                                                notification.type === 'Payment' ? <ShoppingCart className="w-4 h-4" /> :
                                                                    notification.type === 'Review' ? <Bell className="w-4 h-4" /> : // Changed from Star to Bell as Star is removed
                                                                        <Bell className="w-4 h-4" />
                                                            }
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs leading-relaxed ${!notification.read ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-bold italic">
                                                                {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50">
                                            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                                                View All History
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="w-px h-6 bg-slate-100 mx-1" />

                        {/* Profile dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileOpen((prev) => !prev)}
                                className="hover:opacity-80 transition-opacity"
                                title={displayName}
                            >
                                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                                    {initials}
                                </div>
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-4 border-b border-slate-100 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{displayName}</p>
                                            <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        {[
                                            { icon: User, label: 'My Profile', to: '/customer/profile' },
                                            { icon: ShoppingBag, label: 'My Orders', to: '/customer/orders' },
                                            { icon: CalendarCheck, label: 'My Bookings', to: '/customer/bookings' },
                                            { icon: Heart, label: 'Wishlist', to: '/customer/wishlist' },
                                        ].map(({ icon: Icon, label, to }) => (
                                            <NavLink
                                                key={to}
                                                to={to}
                                                onClick={() => setProfileOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                                                        ? 'bg-indigo-50 text-indigo-600'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                                    }`
                                                }
                                            >
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </NavLink>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full relative">
                <Outlet />
            </main>

            {/* Mandatory Payment Blocker Overlay */}
            {blockingOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300 overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b border-slate-100 text-center w-full">
                            <h2 className="text-[17px] font-bold text-slate-800 w-full text-center">Complete Your Payment</h2>
                        </div>

                        <div className="p-6">
                            {/* Amount Display */}
                            <div className="flex items-center justify-center py-4 mb-2 border-b border-slate-100">
                                <span className="text-slate-600 font-medium mr-2">Amount to Pay:</span>
                                <span className="text-xl font-black text-slate-800">
                                    ₹{blockingOrder.total.toLocaleString('en-IN')}
                                </span>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={handlePayment}
                                disabled={processingPayment}
                                className="relative w-full py-4 bg-[#1A56DB] hover:bg-blue-700 text-white font-bold rounded-xl overflow-hidden group transition-all shrink-0 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
            )}
        </div>
    );
};

export default CustomerLayout;
