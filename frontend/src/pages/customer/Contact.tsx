import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { addContactMessage } from '../../utils/contactStore';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            await addContactMessage(formData);
            alert('Message sent successfully! Our team will get back to you soon.');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setSending(false);
        }
    };


    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-black text-slate-800 tracking-tight">Get in Touch</h1>
                <p className="text-slate-500 mt-4 text-lg">
                    Have questions about our security solutions? We're here to help you secure what matters most.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Contact Info Cards */}
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                            <Phone className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">Call Us</h3>
                        <p className="text-sm text-slate-500 mb-3">Available Mon-Sat, 9AM-8PM</p>
                        <a href="tel:+919876543210" className="text-lg font-black text-indigo-600 hover:underline">+91 98765 43210</a>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">Email Support</h3>
                        <p className="text-sm text-slate-500 mb-3">Expect a reply within 24 hours</p>
                        <a href="mailto:support@camera.com" className="text-lg font-black text-emerald-600 hover:underline">support@camera.com</a>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-1">Our Location</h3>
                        <p className="text-sm text-slate-500 mb-3">Visit our headquarters</p>
                        <p className="text-slate-800 font-bold">123 Security Plaza, Tech Hub,<br />Chennai, Tamil Nadu 600001</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Send a Message</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium"
                                    placeholder="Need help with installation"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium resize-none"
                                    placeholder="Tell us what you're looking for..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {sending ? (
                                    <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[400px] relative group">
                <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:opacity-0 transition-opacity"></div>
                <iframe
                    title="Office Location"
                    className="w-full h-full rounded-[2rem] grayscale hover:grayscale-0 transition-all duration-700"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.603099159954!2d80.2223!3d13.0674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDA0JzAyLjgiTiA4MMKwMTMnMjAuMyJF!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin"
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default Contact;
