import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';
import type { Employee } from '../../utils/employeeStore';
import { Mail, Phone, MapPin, Calendar, Award, Shield, Key } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const emps = getEmployees();
        const loggedInEmp = emps.find(e =>
            (e.email && e.email.toLowerCase() === user?.toLowerCase()) ||
            e.mobile === user
        );
        if (loggedInEmp) {
            setEmployee(loggedInEmp);
        }
    }, [user]);

    if (!employee) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center gap-6 animate-pulse">
                    <div className="w-24 h-24 bg-slate-200 rounded-full shrink-0" />
                    <div className="space-y-3 flex-1">
                        <div className="h-6 bg-slate-200 rounded w-1/3" />
                        <div className="h-4 bg-slate-200 rounded w-1/4" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header Card */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-28 h-28 bg-indigo-100 text-indigo-600 rounded-[28px] flex items-center justify-center font-black text-4xl shadow-lg shadow-indigo-100 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform">
                        {employee.name.charAt(0)}
                    </div>
                    <div className="text-center md:text-left flex-1 min-w-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-100">
                            <Shield className="w-3.5 h-3.5" />
                            {employee.status} Employee
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2 truncate">
                            {employee.name}
                        </h1>
                        <p className="text-slate-500 font-medium">Senior Installation Technician</p>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 shrink-0">
                        <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 text-sm">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Information */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                        <h2 className="text-lg font-black text-slate-800 mb-6">Contact Information</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> Email Address
                                </label>
                                <p className="font-bold text-slate-700">{employee.email}</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" /> Mobile Number
                                </label>
                                <p className="font-bold text-slate-700">{employee.mobile}</p>
                            </div>

                            <div className="sm:col-span-2 space-y-1 mt-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3" /> Home Address
                                </label>
                                <p className="font-medium text-slate-600 leading-relaxed max-w-lg">
                                    {employee.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[24px] p-8 shadow-sm border border-slate-100">
                        <h2 className="text-lg font-black text-slate-800 mb-6">Security Settings</h2>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Account PIN</p>
                                    <p className="text-xs text-slate-500 font-medium">Used for secure login to the dashboard.</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 font-bold rounded-lg transition-colors text-xs shadow-sm">
                                Change PIN
                            </button>
                        </div>
                    </div>
                </div>

                {/* Employment Details Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-800 mb-5">Employment Details</h3>

                        <div className="space-y-5">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Key className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Employee ID</p>
                                    <p className="font-bold text-slate-700 text-sm">{employee.id}</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date of Joining</p>
                                    <p className="font-bold text-slate-700 text-sm">
                                        {new Date(employee.dateOfJoining).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                    <Award className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Certifications</p>
                                    <p className="font-bold text-slate-700 text-sm">Advanced CCTV Installs</p>
                                    <p className="text-xs text-slate-500 mt-1">Network Security Alarms</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
