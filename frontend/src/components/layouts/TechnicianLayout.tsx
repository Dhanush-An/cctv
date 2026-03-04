import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, IndianRupee, Star, LogOut, Shield, Menu, Bell } from 'lucide-react';
import NotificationDropdown from '../shared/NotificationDropdown';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';

const TechnicianLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [technicianName, setTechnicianName] = useState('Technician');

    useEffect(() => {
        const fetchName = async () => {
            if (!user) return;
            try {
                const emps = await getEmployees();
                const current = emps.find(e =>
                    (e.email && e.email.toLowerCase() === user.toLowerCase()) ||
                    e.mobile === user
                );
                if (current) setTechnicianName(current.name);
            } catch (err) {
                console.error('Error fetching technician name:', err);
            }
        };
        fetchName();
    }, [user]);

    const navigation = [
        { name: 'Dashboard', href: '/technician', icon: LayoutDashboard },
        { name: 'My Schedule', href: '/technician/jobs', icon: Calendar },
        { name: 'Earnings', href: '/technician/earnings', icon: IndianRupee },
        { name: 'Performance', href: '/technician/reviews', icon: Star },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col p-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-2 mb-10">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tight">TECH PORTAL</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
                                    `}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Team Support Card */}
                    <div className="mt-6 mb-8 p-5 bg-slate-900 rounded-[24px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
                        <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2 relative z-10">Support</p>
                        <h4 className="text-white text-xs font-bold leading-relaxed mb-4 relative z-10 italic">Need help with a job? Contact dispatch.</h4>
                        <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 relative z-10">
                            Call Center
                        </button>
                    </div>

                    {/* User Profile Area */}
                    <div className="pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-lg shadow-sm">
                                {technicianName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-800 truncate">{technicianName}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Field Tech</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
                    <button
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Current Date</p>
                            <p className="text-xs font-bold text-slate-500 italic">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="w-px h-8 bg-slate-100 hidden sm:block mx-2"></div>
                        <NotificationDropdown userId={user || 'technician'} />
                        <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                            <Bell className="w-5 h-5" />
                        </button>
                        <Link to="/technician/profile" className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center hover:ring-2 hover:ring-indigo-100 transition-all overflow-hidden border border-white">
                            <div className="text-indigo-600 font-black text-sm">{technicianName.charAt(0)}</div>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TechnicianLayout;
