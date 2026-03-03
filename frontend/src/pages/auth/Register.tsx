import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { addCustomer, emailExists } from '../../utils/customerStore';
import { sendRegistrationOTP, verifyOTP } from '../../utils/authUtils';

const Register = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [form, setForm] = useState({ name: '', mobile: '', email: '' });
    const [otp, setOtp] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const validate = async () => {
        if (!form.name.trim()) return 'Full name is required.';
        if (!/^\d{10}$/.test(form.mobile)) return 'Enter a valid 10-digit mobile number.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';

        const exists = await emailExists(form.email);
        if (exists) return 'This email is already registered. Please sign in.';

        return null;
    };

    const handleSendOTP = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const err = await validate();
            if (err) {
                setError(err);
                setLoading(false);
                return;
            }

            const { success, otp: newOtp } = await sendRegistrationOTP(form.mobile);
            setLoading(false);

            if (success && newOtp) {
                setGeneratedOTP(newOtp);
                setOtp(newOtp); // Auto-fill
                setStep(2);
            } else {
                setError('Failed to generate OTP. Please try again.');
            }
        } catch (err: any) {
            setError('An error occurred during verification.');
            setLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const isValid = await verifyOTP(form.mobile, otp);

        if (isValid) {
            try {
                await addCustomer({
                    name: form.name.trim(),
                    mobile: form.mobile.trim(),
                    email: form.email.trim().toLowerCase(),
                });
                setSuccess(true);
            } catch (err: any) {
                setError(err.message || 'Failed to finish registration.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Invalid OTP. Please try again.');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1E293B] via-[#2C384A] to-[#1E293B] flex items-center justify-center p-4">
                <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
                    <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-teal-500/30">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-white mb-1">Registration Successful!</h2>
                    <p className="text-slate-400 text-sm mb-6">Your account has been created. You can now sign in.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all text-sm"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E293B] via-[#2C384A] to-[#1E293B] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">

                    <div className="flex flex-col items-center mb-6">
                        <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 mb-4">
                            <span className="text-white font-black text-2xl">C</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight leading-tight">Create Account</h1>
                        <p className="text-slate-400 text-sm mt-1">Register as a customer</p>
                    </div>

                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-300">Full Name</label>
                                <input
                                    type="text" name="name" value={form.name} onChange={handleChange}
                                    placeholder="Your full name" required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-300">Email Address</label>
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="your@email.com" required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-300">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">+91</span>
                                    <input
                                        type="tel" name="mobile"
                                        value={form.mobile}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            setForm(prev => ({ ...prev, mobile: val }));
                                            setError('');
                                        }}
                                        placeholder="10-digit mobile" required
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-medium tracking-wide"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit" disabled={loading || form.mobile.length < 10}
                                className="w-full mt-2 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <>
                                        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 text-center">
                                <p className="text-slate-400 text-sm">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                            <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3 mb-4 text-center">
                                <p className="text-xs text-teal-400 font-medium mb-1">Generated OTP (Auto-filled)</p>
                                <div className="text-xl font-bold text-teal-300 tracking-[0.2em]">{generatedOTP}</div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-300">Enter OTP</label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                                    placeholder="• • • • • •"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all font-mono"
                                />
                                <p className="text-xs text-slate-500 text-center mt-2">Sent to +91 {form.mobile}</p>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Register'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                    className="text-slate-400 hover:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Edit details
                                </button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Register;
