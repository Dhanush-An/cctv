import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Search } from 'lucide-react';
import { getCustomers } from '../../utils/customerStore';
import type { RegisteredCustomer } from '../../utils/customerStore';

const Customers = () => {
    const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);
    const [search, setSearch] = useState('');

    const load = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers:", error);
            setCustomers([]);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.mobile.includes(search)
    );

    const active = customers.filter((c) => c.status === 'Active').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
                    <p className="text-sm text-slate-500 italic">All self-registered customers appear here automatically.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Customers', value: customers.length, icon: Users, color: 'indigo' },
                    { label: 'Active', value: active, icon: UserCheck, color: 'emerald' },
                    { label: 'Inactive', value: customers.length - active, icon: UserX, color: 'rose' },
                ].map((stat) => (
                    <div key={stat.label} className="card flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search + Table */}
            <div className="card">
                {/* Search */}
                <div className="relative mb-5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or mobile..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                    />
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400 font-semibold text-sm">
                            {customers.length === 0
                                ? 'No customers registered yet.'
                                : 'No customers match your search.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-3 pl-4">Customer</th>
                                    <th className="pb-3">Mobile</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Registered On</th>
                                    <th className="pb-3 pr-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                        <td className="py-3.5 pl-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-black shrink-0">
                                                    {c.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                                                    <p className="text-xs text-slate-400">{c.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-sm text-slate-600 font-medium">{c.mobile}</td>
                                        <td className="py-3.5 text-sm text-slate-600">{c.email}</td>
                                        <td className="py-3.5 text-xs text-slate-400 font-medium">
                                            {new Date(c.registeredAt).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                            })}
                                        </td>
                                        <td className="py-3.5 pr-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${c.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-red-50 text-red-500'
                                                }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;
