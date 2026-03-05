import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, saveOrderImages } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';
import { getCustomers } from '../../utils/customerStore';
import type { RegisteredCustomer } from '../../utils/customerStore';
import { Clock, MapPin, Truck, CheckCircle2, User as UserIcon, ImagePlus, X, Upload, MoreVertical, ShoppingCart, Phone } from 'lucide-react';

const Jobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImageJobId, setActiveImageJobId] = useState<string | null>(null);
    const [stagedImage, setStagedImage] = useState<string | null>(null);
    const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
    const [pendingStatus, setPendingStatus] = useState<Order['status']>('Pending');
    const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);

    // Get real name
    const [technicianName, setTechnicianName] = useState<string>('');

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const emps = await getEmployees();
                const loggedInEmp = emps.find(e =>
                    (e.email && e.email.toLowerCase() === user?.toLowerCase()) ||
                    e.mobile === user
                );

                if (loggedInEmp) {
                    setTechnicianName(loggedInEmp.name);
                } else {
                    // Not found, maybe an admin looking or mock user. Turn off loading anyway.
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchEmployee();

        // Fetch all customers for lookup
        const loadCustomers = async () => {
            const data = await getCustomers();
            setCustomers(data);
        };
        loadCustomers();
    }, [user]);

    useEffect(() => {
        if (!technicianName) return;

        const loadJobs = async () => {
            const data = await getOrders();
            const assigned = data.filter(order =>
                order.technician && technicianName &&
                order.technician.toLowerCase().trim() === technicianName.toLowerCase().trim()
            ).reverse();
            setJobs(assigned);
            setLoading(false);
        };

        loadJobs();

        const handleOrderUpdate = () => loadJobs();
        window.addEventListener('orderUpdated', handleOrderUpdate);
        window.addEventListener('orders-updated', handleOrderUpdate);
        return () => {
            window.removeEventListener('orderUpdated', handleOrderUpdate);
            window.removeEventListener('orders-updated', handleOrderUpdate);
        };
    }, [technicianName]);

    const getCustomerInfo = (email: string) => {
        return customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    };

    const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
        // Simple state machine for technician jobs: Pending -> Processing -> Delivered
        let nextStatus: Order['status'] = 'Processing';
        if (currentStatus === 'Pending') nextStatus = 'Processing';
        else if (currentStatus === 'Processing') nextStatus = 'Delivered';

        if (currentStatus === 'Delivered') return;

        // Transitions requiring images:
        // 1. Pending -> Processing (Start of work)
        // 2. Processing -> Delivered (Completion of work)
        setActiveImageJobId(orderId);
        setPendingStatus(nextStatus);
        setStagedImage(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setStagedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const confirmImageUpload = async () => {
        if (!activeImageJobId || !stagedImage) return;

        // 1. Save the image to the order
        if (pendingStatus === 'Processing') {
            // "Before" photo
            await saveOrderImages(activeImageJobId, stagedImage, undefined);
        } else if (pendingStatus === 'Delivered') {
            // "After" photo
            await saveOrderImages(activeImageJobId, undefined, stagedImage);
        }

        // 2. Update the status
        const updated = await updateOrderStatus(activeImageJobId, pendingStatus);
        if (updated) {
            setJobs(prev => prev.map(job => job.id === activeImageJobId ? updated : job));
        }

        // 3. Reset Modal
        setActiveImageJobId(null);
        setStagedImage(null);
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading your schedule...</div>;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {!Array.isArray(jobs) || jobs.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm mt-8">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-indigo-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">No Active Jobs</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                        You have no service tasks currently assigned to your queue. Enjoy your free time!
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map(job => (
                        <div key={job.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                                                    {job.status}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                    #{job.id}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800">
                                                {job.items.map(i => i.name).join(', ')}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setViewingOrder(job)}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                <UserIcon className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Customer details</p>
                                                <p className="text-sm font-bold text-slate-700">
                                                    {getCustomerInfo(job.customerEmail)?.name || job.customerName}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Phone className="w-3 h-3 text-indigo-400" />
                                                    {getCustomerInfo(job.customerEmail)?.mobile || 'Login ID: ' + job.customerEmail}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                <MapPin className="w-4 h-4 text-rose-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Service Location</p>
                                                <p className="text-sm font-bold text-slate-700">Account Default</p>
                                                <p className="text-xs text-slate-500">Contact customer for address</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-64 flex flex-col justify-between p-6 bg-slate-900 rounded-[20px] text-white">
                                    <div className="w-full h-px bg-slate-800 my-6"></div>

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Job Photos</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {job.startImage ? (
                                                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-video relative">
                                                    <img src={job.startImage} alt="Start of Job" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-2">
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Before</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-slate-700 bg-slate-800/50 aspect-video flex flex-col items-center justify-center gap-1">
                                                    <ImagePlus className="w-4 h-4 text-slate-500" />
                                                    <span className="text-[10px] text-slate-500 font-bold">No Photo</span>
                                                </div>
                                            )}

                                            {job.completionImage ? (
                                                <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-800 aspect-video relative">
                                                    <img src={job.completionImage} alt="Completion of Job" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-2">
                                                        <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">After</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-xl border border-slate-700 bg-slate-800/50 aspect-video flex flex-col items-center justify-center gap-1">
                                                    <ImagePlus className="w-4 h-4 text-slate-500" />
                                                    <span className="text-[10px] text-slate-500 font-bold">No Photo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-slate-800 my-6"></div>

                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time Assigned</p>
                                        <div className="flex items-center gap-2 mb-6">
                                            <Clock className="w-4 h-4 text-indigo-400" />
                                            <span className="text-sm font-bold">{job.date}</span>
                                        </div>

                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items Included</p>
                                        <ul className="text-xs text-slate-300 space-y-1 font-medium mb-6">
                                            {job.items.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                                                    {item.quantity}x {item.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {job.status !== 'Delivered' ? (
                                        <button
                                            onClick={() => handleStatusUpdate(job.id, job.status)}
                                            className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
                                        >
                                            <Truck className="w-4 h-4" />
                                            Update Status
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 bg-white/10 text-emerald-400 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-emerald-500/30">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Job Completed
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Upload Modal */}
            {activeImageJobId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveImageJobId(null)}></div>
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-scale-up">
                        <button
                            onClick={() => setActiveImageJobId(null)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-50 rounded-xl"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
                                <ImagePlus className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 mb-1">Upload Work Photo</h2>
                            <p className="text-sm font-medium text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                                {pendingStatus === 'Delivered'
                                    ? 'Provide a photo of the completed work to finish this job.'
                                    : 'Provide a photo of the workspace to start your work.'}
                            </p>
                        </div>

                        {stagedImage ? (
                            <div className="mb-8">
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 aspect-video relative group">
                                    <img src={stagedImage} alt="Staged Upload" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                                            Replace Photo
                                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <label className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-indigo-50 text-slate-400 group-hover:text-indigo-500 transition-colors">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Click to browse or take photo</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        )}

                        <button
                            onClick={confirmImageUpload}
                            disabled={!stagedImage}
                            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${stagedImage
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Upload & Continue
                        </button>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {viewingOrder && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewingOrder(null)}></div>
                    <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl animate-slide-left overflow-y-auto">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 italic">Order Details {viewingOrder.id}</h2>
                                <p className="text-xs text-slate-500 italic">Review customer details and required items.</p>
                            </div>
                            <button onClick={() => setViewingOrder(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-100">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Current Status</p>
                                    <p className="font-bold text-slate-800">{viewingOrder.status}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <UserIcon className="w-4 h-4 text-slate-400" />
                                        Customer Info
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-800">
                                            {getCustomerInfo(viewingOrder.customerEmail)?.name || viewingOrder.customerName}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 italic">
                                            <Phone className="w-3 h-3 text-indigo-400" />
                                            {getCustomerInfo(viewingOrder.customerEmail)?.mobile || viewingOrder.customerEmail}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                        Payment
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="font-bold text-slate-800 italic">₹{viewingOrder.total}</p>
                                        <p className={`text-xs font-bold uppercase tracking-widest ${viewingOrder.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {viewingOrder.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Required Items</h3>
                                <div className="space-y-3">
                                    {viewingOrder.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-2 rounded-xl border border-slate-100">
                                                    <ShoppingCart className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{item.name}</p>
                                                    <p className="text-xs text-slate-400 italic">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-slate-800">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Job Photos</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {viewingOrder.startImage ? (
                                        <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video">
                                            <img src={viewingOrder.startImage} alt="Start" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            No Before Photo
                                        </div>
                                    )}

                                    {viewingOrder.completionImage ? (
                                        <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video">
                                            <img src={viewingOrder.completionImage} alt="Completion" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-xs font-bold uppercase tracking-widest">
                                            No After Photo
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;
