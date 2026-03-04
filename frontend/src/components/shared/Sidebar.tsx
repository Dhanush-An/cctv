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
    LogOut,
    MessageSquare
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { role, logout } = useAuth();
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
        { icon: MessageSquare, label: 'Contact Us', path: '/admin/messages' },
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
            <div className="p-4 shrink-0">
                <div className="bg-white rounded-[2rem] p-2 flex items-center justify-between shadow-sm border border-slate-100/50">
                    <div className="flex items-center gap-3 ml-1">
                        <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                            A
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">Admin</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                {role === 'admin' ? 'Super Admin' : role || 'User'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all mr-1 group/logout"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 opacity-60 group-hover/logout:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

        </div>
    );

};

export default Sidebar;
