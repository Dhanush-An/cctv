import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, DollarSign, Calendar, Bell, LogOut, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';

const TechnicianLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Map the logged-in email to an actual employee name
    const employees = getEmployees();
    const loggedInEmployee = employees.find(emp =>
        (emp.email && emp.email.toLowerCase() === user?.toLowerCase()) ||
        emp.mobile === user
    );
    const displayName = loggedInEmployee ? loggedInEmployee.name : 'Robert (Demo)';
    const firstName = displayName.split(' ')[0];

    // Determine title based on location
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/jobs')) return 'Assigned Jobs';
        if (path.includes('/earnings')) return 'Earnings';
        if (path.includes('/schedule')) return 'Schedule';
        if (path.includes('/reviews')) return 'Reviews';
        if (path.includes('/profile')) return 'Profile';
        return 'Dashboard';
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-[280px] bg-[#2C384A] text-slate-300 flex flex-col fixed h-screen z-20">
                <div className="p-6 flex items-center gap-3 text-white border-b border-[#3A4A5E]">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="font-bold text-lg">C</span>
                    </div>
                    <span className="font-bold tracking-wider text-sm">CAMERA TECHNICIAN</span>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <NavLink
                        to="/technician"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#3A4A5E] text-white' : 'hover:bg-[#3A4A5E]/50 hover:text-white'
                            }`
                        }
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/technician/jobs"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#3A4A5E] text-white' : 'hover:bg-[#3A4A5E]/50 hover:text-white'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-5 h-5" />
                            Assigned Jobs
                        </div>
                    </NavLink>
                    <NavLink
                        to="/technician/earnings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#3A4A5E] text-white' : 'hover:bg-[#3A4A5E]/50 hover:text-white'
                            }`
                        }
                    >
                        <DollarSign className="w-5 h-5" />
                        Earnings
                    </NavLink>
                    <NavLink
                        to="/technician/schedule"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#3A4A5E] text-white' : 'hover:bg-[#3A4A5E]/50 hover:text-white'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5" />
                            Schedule
                        </div>
                    </NavLink>
                    <NavLink
                        to="/technician/reviews"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${isActive ? 'bg-[#3A4A5E] text-white' : 'hover:bg-[#3A4A5E]/50 hover:text-white'
                            }`
                        }
                    >
                        <div className="flex items-center gap-3">
                            <Star className="w-5 h-5" />
                            Reviews
                        </div>
                    </NavLink>
                </nav>

                <div className="p-4 mt-auto border-t border-[#3A4A5E]">
                    <div
                        onClick={() => navigate('/technician/profile')}
                        className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white hover:bg-slate-50 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#6366F1] font-bold text-sm flex items-center justify-center">
                                {firstName.charAt(0)}
                            </div>
                            <div className="text-left flex flex-col justify-center">
                                <p className="text-[13px] font-bold text-[#1E293B] leading-none mb-0.5">{firstName}</p>
                                <p className="text-[11px] text-[#64748B] font-medium leading-none">Technician</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                logout();
                                navigate('/login');
                            }}
                            className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4 text-[#94A3B8] group-hover:text-[#64748B] transition-colors rotate-180" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-[280px] flex-1 flex flex-col">
                <header className="h-20 bg-slate-50 flex items-center justify-between px-8 sticky top-0 z-10 border-b border-slate-200/50">
                    <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50"></span>
                        </button>
                    </div>
                </header>
                <div className="p-8 pb-20">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default TechnicianLayout;
