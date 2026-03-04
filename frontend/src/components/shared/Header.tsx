import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';


const Header = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/admin';

    if (!isDashboard) return null;

    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Welcome, Admin!</h1>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-64"
                    />
                </div>

                <NotificationDropdown userId="admin" isWhiteBackground={true} />
            </div>
        </header>
    );
};

export default Header;
