import { useState, useRef, useEffect } from 'react';
import { Bell, ShoppingBag, ShoppingCart, Info } from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../utils/notificationStore';
import type { Notification } from '../../utils/notificationStore';

interface NotificationDropdownProps {
    userId: string;
    isWhiteBackground?: boolean;
}

const NotificationDropdown = ({ userId, isWhiteBackground = false }: NotificationDropdownProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (userId) {
            const data = await getNotifications(userId);
            setNotifications(data);
        }
    };

    useEffect(() => {
        fetchNotifications();
        window.addEventListener('notifications-updated', fetchNotifications);
        return () => window.removeEventListener('notifications-updated', fetchNotifications);
    }, [userId]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
        fetchNotifications();
    };

    const handleMarkAllAsRead = async () => {
        if (userId) {
            await markAllAsRead(userId);
            fetchNotifications();
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'Order': return <ShoppingBag className="w-4 h-4" />;
            case 'Payment': return <ShoppingCart className="w-4 h-4" />;
            case 'System': return <Info className="w-4 h-4" />;
            default: return <Bell className="w-4 h-4" />;
        }
    };

    const getColorClass = (type: string) => {
        switch (type) {
            case 'Order': return 'bg-blue-100 text-blue-600';
            case 'Payment': return 'bg-emerald-100 text-emerald-600';
            case 'System': return 'bg-amber-100 text-amber-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="relative" ref={notificationRef}>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-xl transition-all group ${isWhiteBackground
                    ? 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                    : 'text-slate-400 hover:text-indigo-600 hover:bg-white shadow-sm'
                    }`}
            >
                <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform origin-top" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
            </button>

            {showNotifications && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setShowNotifications(false)}
                    ></div>

                    {/* Popup Window */}
                    <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Notifications</h3>
                                <p className="text-xs text-slate-500 font-medium">Keep track of your latest updates.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="p-2 text-slate-400 hover:bg-white rounded-xl transition-colors shadow-sm bg-slate-100"
                                >
                                    <Bell className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-50 p-2">
                            {notifications.length === 0 ? (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Bell className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-800">All Quiet Here</h4>
                                    <p className="text-xs text-slate-400 font-medium max-w-[180px] mx-auto mt-1">
                                        No recent notifications found in your inbox.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className={`m-2 p-4 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer relative group ${!notification.read ? 'bg-indigo-50/20' : ''}`}
                                    >
                                        {!notification.read && (
                                            <div className="absolute left-0 top-4 bottom-4 w-1 bg-indigo-500 rounded-full" />
                                        )}
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${getColorClass(notification.type)}`}>
                                                {getIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${notification.type === 'Order' ? 'text-blue-500' :
                                                            notification.type === 'Payment' ? 'text-emerald-500' :
                                                                'text-amber-500'
                                                        }`}>
                                                        {notification.type}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold italic">
                                                        {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className={`text-sm leading-relaxed ${!notification.read ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
                                                    {notification.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 bg-white">
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="w-full py-3 bg-slate-900 text-white font-bold rounded-2xl text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                            >
                                Close Window
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
