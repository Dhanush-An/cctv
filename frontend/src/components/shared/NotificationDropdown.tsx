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
                <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-bold text-indigo-600 hover:underline px-2 py-1"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-10 text-center">
                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                                <p className="text-xs text-slate-400 font-medium">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleMarkAsRead(notification.id)}
                                    className={`px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                                >
                                    {!notification.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                    )}
                                    <div className="flex gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColorClass(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs leading-relaxed ${!notification.read ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium'}`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-1 font-bold italic">
                                                {new Date(notification.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/50">
                            <button className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                                View History
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
