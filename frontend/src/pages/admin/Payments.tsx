import {
    CreditCard,
    Search,
    ArrowUpRight,
    DollarSign,
    FileText,
    Download,
    Filter,
    Calendar
} from 'lucide-react';
import { useState } from 'react';

interface Transaction {
    id: string;
    orderId: string;
    customer: string;
    amount: number;
    method: 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash';
    status: 'Successful' | 'Pending' | 'Refunded' | 'Failed';
    date: string;
}

const mockTransactions: Transaction[] = [];

const Payments = () => {
    const [transactions] = useState(mockTransactions);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Payment Management</h1>
                    <p className="text-sm text-slate-500 italic">Track transactions, monitor revenue trends and manage invoices.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all">
                        <Download className="w-4 h-4" />
                        Export Monthly Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-indigo-600 text-white border-none relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-xs font-black uppercase tracking-widest opacity-60">Total Revenue</p>
                        <h2 className="text-3xl font-black mt-1">₹482,950</h2>
                        <div className="flex items-center gap-2 mt-4 text-[10px] font-bold bg-white/10 w-fit px-2 py-1 rounded-lg">
                            <ArrowUpRight className="w-3 h-3" />
                            +12% from last month
                        </div>
                    </div>
                    <DollarSign className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10" />
                </div>

                <div className="card bg-slate-900 text-white border-none">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Active Subscriptions</p>
                    <h2 className="text-3xl font-black mt-1">1,240</h2>
                    <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-indigo-400">
                        <Calendar className="w-3 h-3" />
                        Next billing cycle in 4 days
                    </div>
                </div>

                <div className="card border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/10 transition-all">
                    <FileText className="w-10 h-10 text-slate-300 mb-2 group-hover:text-indigo-400" />
                    <p className="font-bold text-slate-500 italic">Generate Custom Invoice</p>
                </div>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        Recent Transactions
                    </h3>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all" />
                        </div>
                        <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="italic font-medium text-slate-400 text-sm border-b border-slate-50">
                                <th className="pb-4 pl-4">Transaction ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Method</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4">Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-4 font-bold text-slate-700 italic">{txn.id}</td>
                                    <td className="py-4">
                                        <p className="font-bold text-slate-800">{txn.customer}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{txn.date}</p>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <CreditCard className="w-4 h-4 text-slate-300" />
                                            {txn.method}
                                        </div>
                                    </td>
                                    <td className="py-4 font-bold text-slate-800">₹{txn.amount.toLocaleString()}</td>
                                    <td className="py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${txn.status === 'Successful' ? 'bg-emerald-50 text-emerald-600' :
                                            txn.status === 'Refunded' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
