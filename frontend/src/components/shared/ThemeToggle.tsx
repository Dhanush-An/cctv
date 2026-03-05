import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl transition-all duration-300 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 group relative"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <div className="relative w-5 h-5">
                <Sun className={`w-5 h-5 absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
                <Moon className={`w-5 h-5 absolute inset-0 transition-all duration-500 transform ${theme === 'light' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
            </div>

            {/* Tooltip or Ring Effect */}
            <span className="absolute inset-0 rounded-xl ring-2 ring-indigo-500/0 group-hover:ring-indigo-500/20 transition-all duration-300" />
        </button>
    );
};

export default ThemeToggle;
