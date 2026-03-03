import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Calendar,
    Users,
    HardHat,
    CreditCard,
    Star,
    Settings,
    ChevronDown,
    Camera,
    MapPin,
    LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Package, label: 'Products', path: '/admin/products' },
        {
            icon: ShoppingCart,
            label: 'Orders',
            path: '/admin/orders',
            hasSubmenu: true
        },
        { icon: Calendar, label: 'Services', path: '/admin/services' },
        {
            icon: Users,
            label: 'Customers',
            path: '/admin/customers',
            hasSubmenu: true
        },
        { icon: HardHat, label: 'Employees', path: '/admin/employees' },
        { icon: MapPin, label: 'Area & Branch', path: '/admin/branches' },
        { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
        { icon: Star, label: 'Reviews', path: '/admin/reviews' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];


    return (
        <div className="w-[240px] h-screen bg-sidebar text-slate-300 flex flex-col fixed left-0 top-0">
            {/* Fixed Header */}
            <div className="p-6 flex items-center gap-3 shrink-0">
                <div className="bg-indigo-500 p-2 rounded-lg">
                    <Camera className="text-white w-6 h-6" />
                </div>
                <span className="font-bold text-xl text-white tracking-tight uppercase">Camera <span className="text-slate-400 font-medium">Admin</span></span>
            </div>

            {/* Scrollable Navigation */}
            <nav className="flex-1 px-4 py-4 overflow-y-auto custom-scrollbar">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.label}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                        : 'hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {item.hasSubmenu && (
                                        <ChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Fixed Footer */}
            <div className="p-4 border-t border-slate-800 shrink-0 space-y-2">
                <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                        alt="Admin"
                        className="w-10 h-10 rounded-full border-2 border-slate-700"
                    />
                    <div>
                        <p className="text-sm font-semibold text-white">Admin</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Logout</span>
                </button>
            </div>
        </div>
    );

};

export default Sidebar;
