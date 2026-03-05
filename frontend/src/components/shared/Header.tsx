import { Search, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/admin';

    // On mobile, show header even if not dashboard to provide menu toggle
    return (
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-lg md:text-2xl font-bold text-slate-800 truncate">
                    {isDashboard ? 'Welcome, Admin!' : 'Admin Panel'}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-32 md:w-64"
                    />
                </div>

                <NotificationDropdown userId="admin" isWhiteBackground={true} />
            </div>
        </header>
    );
};

export default Header;
