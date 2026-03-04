
import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Trash2, CheckCircle, Clock, Reply, Search, Filter } from 'lucide-react';
import { getContactMessages, updateMessageStatus, deleteMessage } from '../../utils/contactStore';
import type { ContactMessage } from '../../utils/contactStore';


const AdminContacts = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Read' | 'Replied'>('All');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();
        const handler = () => fetchMessages();
        window.addEventListener('contact-messages-updated', handler);
        return () => window.removeEventListener('contact-messages-updated', handler);
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const data = await getContactMessages();
        setMessages(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, status: ContactMessage['status']) => {
        await updateMessageStatus(id, status);
        if (selectedMessage?.id === id) {
            setSelectedMessage(prev => prev ? { ...prev, status } : null);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteMessage(id);
            if (selectedMessage?.id === id) setSelectedMessage(null);
        }
    };

    const filteredMessages = messages.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'All' || m.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: ContactMessage['status']) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Read': return 'bg-slate-100 text-slate-700 border-slate-200';
            case 'Replied': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Contact Messages</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage inquiries from your customers</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-600 font-bold text-sm">
                            {messages.filter(m => m.status === 'New').length} New
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Message List */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value as any)}
                                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none"
                            >
                                <option value="All">All Status</option>
                                <option value="New">New</option>
                                <option value="Read">Read</option>
                                <option value="Replied">Replied</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="max-h-[600px] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-slate-400 italic">Loading messages...</div>
                            ) : filteredMessages.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 italic font-medium">No messages found</div>
                            ) : (
                                filteredMessages.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={() => {
                                            setSelectedMessage(m);
                                            if (m.status === 'New') handleStatusUpdate(m.id, 'Read');
                                        }}
                                        className={`p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative ${selectedMessage?.id === m.id ? 'bg-indigo-50/50' : ''}`}
                                    >
                                        {m.status === 'New' && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                        )}
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-slate-800 text-sm truncate max-w-[150px]">{m.name}</h3>
                                            <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                                {new Date(m.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-600 truncate mb-2">{m.subject}</p>
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getStatusColor(m.status)}`}>
                                                {m.status}
                                            </span>
                                            <p className="text-[10px] text-slate-400 italic truncate max-w-[100px]">{m.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Message Details */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-6">
                            {/* Message Header */}
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-100">
                                            {selectedMessage.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-800">{selectedMessage.name}</h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Mail className="w-3.5 h-3.5" />
                                                <span>{selectedMessage.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedMessage.id, 'Replied')}
                                            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                        >
                                            <Reply className="w-3.5 h-3.5" /> Mark Replied
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedMessage.id)}
                                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                            title="Delete Message"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Subject</label>
                                    <p className="text-lg font-bold text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        {selectedMessage.subject}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Message Content</label>
                                    <div className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[200px] whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Received on {new Date(selectedMessage.date).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className={`w-3.5 h-3.5 ${selectedMessage.status === 'Replied' ? 'text-emerald-500' : 'text-slate-200'}`} />
                                        <span className="font-bold uppercase tracking-tight">ID: {selectedMessage.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-slate-50/30">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6">
                                <MessageSquare className="w-10 h-10" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Select a message</h2>
                            <p className="text-slate-500 mt-2 max-w-sm">
                                Click on a message from the list on the left to view its full details and respond.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContacts;
