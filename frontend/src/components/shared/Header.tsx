import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const location = useLocation();
    const isDashboard = location.pathname === '/admin';

    // On mobile, show header even if not dashboard to provide menu toggle
    return (
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-4">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-lg md:text-2xl font-bold text-slate-800 dark:text-white truncate">
                    {isDashboard ? 'Welcome, Admin!' : 'Admin Panel'}
                </h1>
            </div>

            <div className="flex items-center gap-2 md:gap-6">
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="w-px h-6 bg-slate-100 dark:bg-slate-800 mx-1 hidden md:block" />
                    <NotificationDropdown userId="admin" isWhiteBackground={true} />
                </div>
            </div>
        </header>
    );
};

export default Header;
