import { useState, useEffect } from 'react';
import { Shield, Key, Users, AlertCircle, Edit2, Check, X } from 'lucide-react';
import { getEmployees, updateEmployee } from '../../utils/employeeStore';
import { getSystemCredentials, updateSystemCredentials, type SystemStore } from '../../utils/systemStore';
import type { Employee } from '../../utils/employeeStore';

const Settings = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [systemCreds, setSystemCreds] = useState<SystemStore | null>(null);

    // Employee editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ email: '', mobile: '' });

    // System credentials editing state
    const [editingType, setEditingType] = useState<'admin' | 'technician' | null>(null);
    const [systemEditForm, setSystemEditForm] = useState({ email: '', password: '' });

    useEffect(() => {
        setEmployees(getEmployees());
        setSystemCreds(getSystemCredentials());

        const handler = () => setSystemCreds(getSystemCredentials());
        window.addEventListener('system-credentials-updated', handler);
        return () => window.removeEventListener('system-credentials-updated', handler);
    }, []);

    const startEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setEditForm({ email: emp.email, mobile: emp.mobile });
    };

    const cancelEdit = () => {
        setEditingId(null);
    };

    const saveEdit = (id: string) => {
        const updated = updateEmployee(id, editForm);
        if (updated) {
            setEmployees(prev => prev.map(e => e.id === id ? updated : e));
        }
        setEditingId(null);
    };

    const startSystemEdit = (type: 'admin' | 'technician') => {
        if (!systemCreds) return;
        setEditingType(type);
        setSystemEditForm({ ...systemCreds[type] });
    };

    const saveSystemEdit = (type: 'admin' | 'technician') => {
        updateSystemCredentials(type, systemEditForm);
        setEditingType(null);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Shield className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Settings</h1>
                    <p className="text-sm text-slate-500">Manage application credentials and configuration.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* System Accounts */}
                <div className="card h-fit">
                    <div className="flex items-center gap-2 mb-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <Key className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-indigo-900">System Credentials</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Admin Section */}
                        <div className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Login</h3>
                                {editingType === 'admin' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => saveSystemEdit('admin')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingType(null)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => startSystemEdit('admin')} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                    <span className="text-sm font-medium text-slate-500">Email</span>
                                    {editingType === 'admin' ? (
                                        <input
                                            type="email"
                                            value={systemEditForm.email}
                                            onChange={e => setSystemEditForm({ ...systemEditForm, email: e.target.value })}
                                            className="w-48 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    ) : (
                                        <span className="font-mono font-bold text-slate-800 text-sm">{systemCreds?.admin.email}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                    <span className="text-sm font-medium text-slate-500">Password</span>
                                    {editingType === 'admin' ? (
                                        <input
                                            type="text"
                                            value={systemEditForm.password}
                                            onChange={e => setSystemEditForm({ ...systemEditForm, password: e.target.value })}
                                            className="w-48 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    ) : (
                                        <span className="font-mono font-bold text-slate-800 text-sm">{systemCreds?.admin.password}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tech Section */}
                        <div className="p-4 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Demo Technician Info</h3>
                                {editingType === 'technician' ? (
                                    <div className="flex gap-2">
                                        <button onClick={() => saveSystemEdit('technician')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setEditingType(null)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => startSystemEdit('technician')} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                    <span className="text-sm font-medium text-slate-500">Email</span>
                                    {editingType === 'technician' ? (
                                        <input
                                            type="email"
                                            value={systemEditForm.email}
                                            onChange={e => setSystemEditForm({ ...systemEditForm, email: e.target.value })}
                                            className="w-48 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    ) : (
                                        <span className="font-mono font-bold text-slate-800 text-sm">{systemCreds?.technician.email}</span>
                                    )}
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                    <span className="text-sm font-medium text-slate-500">Password</span>
                                    {editingType === 'technician' ? (
                                        <input
                                            type="text"
                                            value={systemEditForm.password}
                                            onChange={e => setSystemEditForm({ ...systemEditForm, password: e.target.value })}
                                            className="w-48 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        />
                                    ) : (
                                        <span className="font-mono font-bold text-slate-800 text-sm">{systemCreds?.technician.password}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mt-6 flex gap-2 items-start p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p>These hardcoded credentials should be replaced with API authentication in a production environment.</p>
                    </div>
                </div>

                {/* Employee Passwords */}
                <div className="card">
                    <div className="flex items-center gap-2 mb-6 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                        <Users className="w-5 h-5 text-teal-600" />
                        <h2 className="text-lg font-bold text-teal-900">Employee Credentials</h2>
                    </div>

                    <p className="text-sm text-slate-500 mb-6 italic">Employees login using their Email as username and Mobile Number as password.</p>

                    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                        {employees.length === 0 ? (
                            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                <p className="text-sm font-medium text-slate-400">No employees registered yet.</p>
                            </div>
                        ) : (
                            employees.map(emp => (
                                <div key={emp.id} className="p-5 border border-slate-100 rounded-2xl hover:border-teal-100 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs group-hover:bg-teal-100 group-hover:text-teal-700 transition-colors">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-sm">{emp.name}</h3>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    {emp.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {editingId === emp.id ? (
                                            <div className="flex gap-2">
                                                <button onClick={() => saveEdit(emp.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button onClick={cancelEdit} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEdit(emp)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Login / Email</span>
                                            {editingId === emp.id ? (
                                                <input
                                                    type="email"
                                                    value={editForm.email}
                                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="w-48 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-slate-700 text-sm truncate max-w-[150px]">{emp.email}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Password / Mobile</span>
                                            {editingId === emp.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.mobile}
                                                    onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                                                    className="w-32 text-right bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                                />
                                            ) : (
                                                <span className="font-mono font-bold text-slate-700 text-sm">{emp.mobile}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
