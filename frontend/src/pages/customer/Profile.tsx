import { useState, useEffect } from 'react';
import { User, MapPin, Edit2, Shield, Calendar, Key, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getCustomers } from '../../utils/customerStore';
import type { RegisteredCustomer } from '../../utils/customerStore';

const Profile = () => {
    const { user } = useAuth();
    const [customerInfo, setCustomerInfo] = useState<RegisteredCustomer | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', mobile: '', address: '' });

    // For demo purposes, generating mock demo info if it's the default unregistered mock user
    const [mockAddress, setMockAddress] = useState('123 Cyber Street, Tech Park, City 40001');

    useEffect(() => {
        getCustomers().then(data => {
            const match = data.find(c => c.email.toLowerCase() === (user || '').toLowerCase());
            if (match) {
                setCustomerInfo(match);
                setEditForm({ name: match.name, mobile: match.mobile, address: match.address || mockAddress });
            } else {
                // Mock user logic for 'john@example.com' or standard 'customer@demo.com' login bypasses
                setEditForm({
                    name: user === 'john@example.com' ? 'John Doe' : 'Demo Customer',
                    mobile: '9876543210',
                    address: mockAddress
                });
            }
        }).finally(() => setLoading(false));
    }, [user, mockAddress]);

    const handleSave = () => {
        // Here we'd map an API update call. For the demo, we'll optimistically update state.
        if (customerInfo) {
            setCustomerInfo({ ...customerInfo, ...editForm, address: editForm.address });
        } else {
            setMockAddress(editForm.address);
        }
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const displayName = customerInfo?.name || editForm.name;
    const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header section */}
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar */}
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 transform rotate-[-3deg] group-hover:rotate-0 transition-transform duration-300">
                            <span className="text-white font-black text-5xl">{initials}</span>
                        </div>
                        <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left pt-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{displayName}</h1>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors flex items-center justify-center md:justify-start gap-2 border border-slate-200"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-200"
                                    >
                                        <Check className="w-4 h-4" /> Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-indigo-400" />
                            {customerInfo?.address || editForm.address}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Active Account
                            </span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Member since {customerInfo?.registeredAt ? new Date(customerInfo.registeredAt).getFullYear() : '2024'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-indigo-500" /> Personal Details
                    </h2>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            ) : (
                                <p className="text-slate-800 font-semibold">{displayName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="flex items-center gap-3">
                                <p className="text-slate-800 font-semibold">{user}</p>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">Primary</span>
                            </div>
                            {isEditing && <p className="text-xs text-amber-500 mt-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Email cannot be changed</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.mobile}
                                    onChange={e => setEditForm({ ...editForm, mobile: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            ) : (
                                <p className="text-slate-800 font-semibold">{customerInfo?.mobile || editForm.mobile}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-teal-500" /> Account Security
                    </h2>

                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <p className="text-slate-800 font-semibold tracking-widest">••••••••</p>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm">
                                Change Password
                            </button>
                            <button className="w-full py-3 bg-white hover:bg-rose-50 border border-slate-200 text-rose-500 hover:border-rose-200 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2">
                                <X className="w-4 h-4" /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Shipping & Delivery */}
                <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                    <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-rose-500" /> Shipping Address
                    </h2>

                    <div className="space-y-2 max-w-2xl">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Delivery Location</label>
                        {isEditing ? (
                            <textarea
                                value={editForm.address}
                                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                            />
                        ) : (
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 mb-1">{displayName} (Home)</p>
                                    <p className="text-slate-500 text-sm leading-relaxed">{customerInfo?.address || editForm.address}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
