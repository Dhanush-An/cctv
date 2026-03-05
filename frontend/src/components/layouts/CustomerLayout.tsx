import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { LogOut, User, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import { getCartCount } from '../../utils/cartStore';
import { getOrders, updateOrderPaymentStatus } from '../../utils/orderStore';

import { addNotification } from '../../utils/notificationStore';
import type { Order } from '../../utils/orderStore';
import NotificationDropdown from '../shared/NotificationDropdown';
import ThemeToggle from '../shared/ThemeToggle';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [displayName, setDisplayName] = useState('Customer');
    const [displayEmail, setDisplayEmail] = useState(user ?? '');
    const dropdownRef = useRef<HTMLDivElement>(null);

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


    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
            {/* Top Navbar */}
            <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
                <div className="relative flex items-center h-full px-6">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow">
                            <span className="text-white font-black text-base">C</span>
                        </div>
                        <span className="font-black text-lg text-slate-800 dark:text-white tracking-tight">CAMERA</span>
                    </div>

                    {/* Center: Nav links */}
                    <nav className="hidden md:flex items-center gap-6 mx-auto">
                        <NavLink
                            to="/customer"
                            end
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/customer/products"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
                            }
                        >
                            Products
                        </NavLink>
                        <NavLink
                            to="/customer/services"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
                            }
                        >
                            Services
                        </NavLink>
                        <NavLink
                            to="/customer/contact"
                            className={({ isActive }) =>
                                `text-sm font-semibold transition-all ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`
                            }
                        >
                            Contact
                        </NavLink>

                    </nav>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {/* Cart icon */}
                        <button
                            onClick={() => navigate('/customer/cart')}
                            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <NotificationDropdown userId={user || 'customer@demo.com'} isWhiteBackground={true} />

                        <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1" />

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
                                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{displayName}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{displayEmail}</p>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        {[
                                            { icon: User, label: 'My Profile', to: '/customer/profile' },
                                            { icon: ShoppingBag, label: 'My Orders', to: '/customer/orders' },
                                            { icon: Heart, label: 'Wishlist', to: '/customer/wishlist' },
                                        ].map(({ icon: Icon, label, to }) => (
                                            <NavLink
                                                key={to}
                                                to={to}
                                                onClick={() => setProfileOpen(false)}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                                                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white'
                                                    }`
                                                }
                                            >
                                                <Icon className="w-4 h-4" />
                                                {label}
                                            </NavLink>
                                        ))}
                                    </div>

                                    <div className="border-t border-slate-100 dark:border-slate-800 py-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
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
