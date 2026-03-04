import {
    Building2,
    MapPin,
    Plus,
    Activity,
    TrendingUp,
    X,
    Edit2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getBranches, addBranch, updateBranch, type Branch } from '../../utils/branchStore';

const Branches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    useEffect(() => {
        const fetchBranches = async () => {
            setLoading(true);
            const data = await getBranches();
            setBranches(data);
            setLoading(false);
        };

        fetchBranches();
        const handler = () => fetchBranches();
        window.addEventListener('branches-updated', handler);
        return () => window.removeEventListener('branches-updated', handler);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const branchData = {
            name: data.get('name') as string,
            location: data.get('location') as string,
            manager: data.get('manager') as string,
            serviceAreas: (data.get('serviceAreas') as string).split(',').map(s => s.trim()),
            staffCount: Number(data.get('staffCount')) || 0,
        };

        if (editingBranch) {
            await updateBranch(editingBranch.id, branchData);
        } else {
            await addBranch(branchData);
        }

        setShowModal(false);
        setEditingBranch(null);
    };

    const openEditModal = (branch: Branch) => {
        setEditingBranch(branch);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingBranch(null);
        setShowModal(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Area & Branch Management</h1>
                    <p className="text-sm text-slate-500 italic">Manage physical locations and geographic service zones.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus className="w-5 h-5" />
                    Add New Branch
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-slate-400 italic font-medium">Loading operational branches...</div>
                ) : branches.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700">No Branches Configured</h3>
                        <p className="text-slate-400 text-sm mt-1 mb-6">Start by adding your first operational center.</p>
                        <button
                            onClick={openAddModal}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-100"
                        >
                            Add Branch
                        </button>
                    </div>
                ) : (
                    branches.map((branch) => (
                        <div key={branch.id} className="card group hover:scale-[1.02] transition-all cursor-pointer border hover:border-indigo-200 relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(branch);
                                }}
                                className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all opacity-0 group-hover:opacity-100 z-10"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl transition-colors">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${branch.status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    {branch.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 italic">{branch.name}</h3>
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {branch.location}
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Service Areas</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {branch.serviceAreas.map((area, i) => (
                                            <span key={i} className="text-[10px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md font-bold italic">
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {branch.manager.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manager</p>
                                            <p className="text-xs font-bold text-slate-700">{branch.manager}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Staff</p>
                                        <p className="text-xs font-bold text-slate-700">{branch.staffCount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="card">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2 italic">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Branch Performance Matrix
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="italic font-medium text-slate-400 text-sm border-b border-slate-50">
                                <th className="pb-4 pl-4">Branch</th>
                                <th className="pb-4">Monthly Revenue</th>
                                <th className="pb-4">Service Score</th>
                                <th className="pb-4">Customer Base</th>
                                <th className="pb-4 pr-4">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((row, i) => (
                                <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-4 font-bold text-slate-700">{row.name}</td>
                                    <td className="py-4 text-sm font-medium italic">{row.revenue}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500" style={{ width: `${parseFloat(row.score) * 10}%` }}></div>
                                            </div>
                                            <span className="text-xs font-black text-slate-400">{row.score}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm font-medium">{row.customerBase} users</td>
                                    <td className="py-4 pr-4">
                                        {row.trendUp ? (
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <TrendingUp className="w-4 h-4 text-rose-500 rotate-180" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {branches.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-400 italic font-medium">No branch data available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8 animate-scale-up">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h2>
                                <p className="text-sm text-slate-500 italic">Configure operational branch details.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Branch Name <span className="text-rose-500">*</span></label>
                                <input name="name" type="text" required defaultValue={editingBranch?.name} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Northside HQ" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Location <span className="text-rose-500">*</span></label>
                                <input name="location" type="text" required defaultValue={editingBranch?.location} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Metro Area, NY" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Manager <span className="text-rose-500">*</span></label>
                                <input name="manager" type="text" required defaultValue={editingBranch?.manager} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Manager Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Service Areas (comma-separated) <span className="text-rose-500">*</span></label>
                                <input name="serviceAreas" type="text" required defaultValue={editingBranch?.serviceAreas.join(', ')} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Area 1, Area 2" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Staff Count</label>
                                <input name="staffCount" type="number" defaultValue={editingBranch?.staffCount || 5} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all">
                                    {editingBranch ? 'Update Branch' : 'Create Branch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Branches;
