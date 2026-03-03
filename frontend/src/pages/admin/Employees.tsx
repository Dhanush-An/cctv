import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Briefcase, Mail, Phone, CalendarDays, MapPin, X, Check, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getEmployees, saveEmployee, toggleEmployeeStatus, deleteEmployee } from '../../utils/employeeStore';
import type { Employee } from '../../utils/employeeStore';

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const loadData = () => {
        setEmployees(getEmployees());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);

        const newEmployee = {
            name: data.get('name') as string,
            mobile: data.get('mobile') as string,
            email: data.get('email') as string,
            address: data.get('address') as string,
            dateOfJoining: data.get('dateOfJoining') as string,
        };

        saveEmployee(newEmployee);
        loadData();
        setShowAddModal(false);
    };

    const handleToggleStatus = (id: string) => {
        toggleEmployeeStatus(id);
        loadData();
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this employee?')) {
            deleteEmployee(id);
            loadData();
        }
    };

    const filtered = employees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.mobile.includes(search) ||
            emp.id.toLowerCase().includes(search.toLowerCase())
    );

    const activeCount = employees.filter(e => e.status === 'Active').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Employee Management</h1>
                    <p className="text-sm text-slate-500 italic">Manage your staff details and records.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Employee
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card flex items-center gap-4 border-l-4 border-l-indigo-600">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Staff</p>
                        <p className="text-2xl font-black text-slate-800">{employees.length}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 border-l-4 border-l-emerald-500">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Members</p>
                        <p className="text-2xl font-black text-slate-800">{activeCount}</p>
                    </div>
                </div>
                <div className="card flex items-center gap-4 border-l-4 border-l-amber-500">
                    <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Inactive</p>
                        <p className="text-2xl font-black text-slate-800">{employees.length - activeCount}</p>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="card overflow-hidden !px-0 !pb-0">
                <div className="px-6 pb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, email or mobile..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white transition-all"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/30">
                        <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium text-sm">
                            {employees.length === 0 ? 'No employees are added yet.' : 'No employees match your search.'}
                        </p>
                        {employees.length === 0 && (
                            <button onClick={() => setShowAddModal(true)} className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                + Add First Employee
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                    <th className="py-4 pl-6">Employee Profile</th>
                                    <th className="py-4">Contact Info</th>
                                    <th className="py-4">Location</th>
                                    <th className="py-4">Joined Date</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filtered.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-100">
                                                    {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                                                    <p className="text-[11px] text-slate-500 font-medium">{emp.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    {emp.mobile}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    {emp.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-start gap-1.5 text-xs text-slate-600 max-w-[200px]">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                                <span className="truncate">{emp.address}</span>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                                                {new Date(emp.dateOfJoining).toLocaleDateString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                }`}>
                                                {emp.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-6">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(emp.id)}
                                                    className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                                                >
                                                    {emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp.id)}
                                                    className="px-3 py-1.5 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Add New Employee</h2>
                                <p className="text-xs text-slate-500 mt-1">Enter the official details to register a new staff member.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:bg-white rounded-xl transition-colors shadow-sm bg-slate-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAdd} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Col */}
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Name <span className="text-rose-500">*</span></label>
                                        <input name="name" type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="e.g. John Doe" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Mobile Number <span className="text-rose-500">*</span></label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-slate-500 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl">
                                                +91
                                            </span>
                                            <input name="mobile" type="tel" pattern="[0-9]{10}" required className="w-full bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="10-digit number" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email Address <span className="text-rose-500">*</span></label>
                                        <input name="email" type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="name@company.com" />
                                    </div>
                                </div>
                                {/* Right Col */}
                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date of Joining <span className="text-rose-500">*</span></label>
                                        <input name="dateOfJoining" type="date" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" />
                                    </div>
                                    <div className="space-y-1.5 h-full">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Full Address <span className="text-rose-500">*</span></label>
                                        <textarea name="address" rows={4} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all resize-none" placeholder="Enter complete residential address..."></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100">
                                    <Check className="w-4 h-4" />
                                    Save Employee
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Employees;
