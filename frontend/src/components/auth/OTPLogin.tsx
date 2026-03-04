import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOTP } from '../../utils/authUtils';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { API_URLS } from '../../config';

interface OTPLoginProps {
    onLoginSuccess: (mobile: string, role: string, token: string) => void;
}

const OTPLogin = ({ onLoginSuccess }: OTPLoginProps) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSendOTP = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (mobile.length < 10) {
            setError('Please enter a valid mobile number.');
            return;
        }

        setLoading(true);
        const { success, role, otp: newOtp } = await sendOTP(mobile);
        setLoading(false);

        if (success && role && newOtp) {
            setGeneratedOTP(newOtp);
            setOtp(newOtp); // Auto-fill the OTP input field
            setStep(2);
        } else {
            setError('Mobile number not found in our system. Please check or register.');
        }
    };

    const handleVerifyOTP = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(API_URLS.AUTH.LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp })
            });

            const data = await response.json();
            setLoading(false);

            if (data.success) {
                // Pass the token to the parent callback
                onLoginSuccess(mobile, data.user.role, data.token);
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
            }
        } catch (err: any) {
            setLoading(false);
            console.error('[OTPLogin] Fetch error:', err);
            setError(`Connection error: ${err.message || 'Check your internet or API URL'}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E293B] via-[#2C384A] to-[#1E293B] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-sm relative z-10">
                <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                    {/* Logo + Company Name */}
                    <div className="flex flex-col items-center mb-8 mt-4">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-4">
                            <span className="text-white font-black text-3xl">C</span>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Secure Login</h1>
                        <p className="text-slate-400 text-sm mt-1">Access your dashboard</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-300">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">+91</span>
                                    <input
                                        type="tel"
                                        value={mobile}
                                        onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                                        placeholder="Enter your 10-digit mobile"
                                        required
                                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium tracking-wide"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || mobile.length < 10}
                                className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                ) : (
                                    <>
                                        Send OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">

                            {/* Generated OTP Hint */}
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
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-center text-lg tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono"
                                />
                                <p className="text-xs text-slate-500 text-center mt-2">Sent to +91 {mobile}</p>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 6}
                                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Verifying...' : 'Verify & Login'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setOtp(''); setError(''); }}
                                    className="text-slate-400 hover:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back to edit number
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Footer links if on step 1 */}
                    {step === 1 && (
                        <div className="mt-6 flex flex-col items-center gap-5">
                            <p className="text-slate-400 text-sm">
                                New here?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors"
                                >
                                    Register as Customer
                                </button>
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                            >
                                <ArrowLeft className="w-3 h-3" /> Back to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OTPLogin;
