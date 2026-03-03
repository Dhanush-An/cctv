import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Bell, LogOut, User, ShoppingBag, CalendarCheck, Heart, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import { getCartCount } from '../../utils/cartStore';

const CustomerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [profileOpen, setProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [displayName, setDisplayName] = useState('Customer');
    const [displayEmail, setDisplayEmail] = useState(user ?? '');
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        <NavLink
                            to="/customer"
                            end
                            className={({ isActive }) =>
                                `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'
                                }`
                            }
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/customer/products"
                            className={({ isActive }) =>
                                `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'
                                }`
                            }
                        >
                            Products
                        </NavLink>
                        {['Services', 'Contact'].map((item) => (
                            item === 'Services' ? (
                                <NavLink
                                    key={item}
                                    to="/customer/services"
                                    className={({ isActive }) =>
                                        `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${isActive ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`
                                    }
                                >
                                    {item}
                                </NavLink>
                            ) : (
                                <a
                                    key={item}
                                    href="#"
                                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-all text-slate-500 hover:text-slate-800"
                                >
                                    {item}
                                </a>
                            )
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="ml-auto flex items-center gap-3">
                        {/* Cart icon */}
                        <button
                            onClick={() => navigate('/customer/cart')}
                            className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </button>

                        {/* Profile dropdown */}
                        <div className="relative pl-3 border-l border-slate-100" ref={dropdownRef}>
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
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
};

export default CustomerLayout;
