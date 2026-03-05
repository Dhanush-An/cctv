import {
    ShoppingCart,
    Search,
    Eye,
    Truck,
    UserPlus,
    RotateCcw,
    ChevronRight,
    Filter,
    MoreVertical,
    Clock,
    CheckCircle2,
    X,
    ImagePlus,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus as apiUpdateStatus, assignTechnician as apiAssignTech, refundOrder as apiRefundOrder } from '../../utils/orderStore';
import type { Order } from '../../utils/orderStore';
import { getEmployees, type Employee } from '../../utils/employeeStore';

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchOrders = async () => {
        const data = await getOrders();
        // Sort effectively so newest appear at the top
        setOrders(data.reverse());
    };

    useEffect(() => {
        const loadInitialData = async () => {
            fetchOrders();
            const data = await getEmployees();
            setEmployees(data);
        };
        loadInitialData();
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
        const updated = await apiUpdateStatus(orderId, newStatus);
        if (updated) {
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(updated);
            }
        }
    };

    const assignTechnician = async (orderId: string, technician: string) => {
        const updated = await apiAssignTech(orderId, technician);
        if (updated) {
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
            setShowAssignModal(false);
            if (selectedOrder?.id === orderId) {
                setSelectedOrder(updated);
            }
            window.dispatchEvent(new Event('orderUpdated'));
        }
    };

    const handleRefund = async (orderId: string) => {
        if (confirm('Are you sure you want to process a refund for this order?')) {
            const updated = await apiRefundOrder(orderId);
            if (updated) {
                setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(updated);
                }
            }
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'Shipped': return 'bg-sky-50 text-sky-600 border-sky-100';
            case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Refunded': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchQuery.toLowerCase());

        const orderTypeLower = (o.type || '').toLowerCase();
        const matchesType = filterType === 'all' ||
            (filterType === 'products' && orderTypeLower.includes('product')) ||
            (filterType === 'services' && orderTypeLower.includes('service'));

        const matchesStatus = filterStatus === 'all' || o.status.toLowerCase() === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
                    <p className="text-sm text-slate-500">Track and manage all product orders and service assignments.</p>
                </div>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFilterMenu || filterType !== 'all' || filterStatus !== 'all' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'}`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {showFilterMenu && (
                            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-4 z-50">
                                <div className="px-4 pb-3 border-b border-slate-100 mb-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-800 text-sm">Filter Orders</h3>
                                        {(filterType !== 'all' || filterStatus !== 'all') && (
                                            <button
                                                onClick={() => { setFilterType('all'); setFilterStatus('all'); }}
                                                className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:text-indigo-700"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Type */}
                                <div className="px-4 mb-4">
                                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 block">Order Type</label>
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="products">Products Only</option>
                                        <option value="services">Services Only</option>
                                    </select>
                                </div>

                                {/* Status */}
                                <div className="px-4">
                                    <label className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 block">Status</label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-lg p-2.5 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                    >
                                        <option value="all">Any Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 italic font-medium text-slate-400 text-sm">
                                <th className="pb-4 pl-4">Order ID</th>
                                <th className="pb-4">Customer</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Total</th>
                                <th className="pb-4">Technician</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-4 font-bold text-slate-800 italic">{order.id}</td>
                                    <td className="py-4">
                                        <div>
                                            <p className="font-bold text-slate-800">{order.customerName}</p>
                                            <p className="text-xs text-slate-400 italic">{order.date}</p>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${order.type === 'Service' ? 'bg-purple-50 text-purple-600 border-purple-100' : order.type === 'Product' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                            {order.type || 'Product'}
                                        </span>
                                    </td>
                                    <td className="py-4 font-bold text-slate-800">₹{order.total}</td>
                                    <td className="py-4">
                                        {order.technician ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                                                    {order.technician}
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowAssignModal(true);
                                                }}
                                                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5"
                                            >
                                                <UserPlus className="w-3.5 h-3.5" />
                                                Assign
                                            </button>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setShowImageModal(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <div className="relative group/actions">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowDetailModal(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-all rounded-lg"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Detail Modal */}
            {
                showDetailModal && selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
                        <div className="relative w-full max-w-xl bg-white h-screen shadow-2xl animate-slide-left overflow-y-auto">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 italic">Order Details {selectedOrder.id}</h2>
                                    <p className="text-xs text-slate-500 italic">Manage status and review order items.</p>
                                </div>
                                <button onClick={() => setShowDetailModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${getStatusColor(selectedOrder.status)}`}>
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Current Status</p>
                                            <p className="font-bold text-slate-800">{selectedOrder.status}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedOrder.status === 'Pending' && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'Processing')}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                                            >
                                                Process Order
                                            </button>
                                        )}
                                        {selectedOrder.status === 'Processing' && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'Shipped')}
                                                className="bg-sky-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-sky-700 transition-all"
                                            >
                                                Mark as Shipped
                                            </button>
                                        )}
                                        {selectedOrder.status === 'Shipped' && (
                                            <button
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'Delivered')}
                                                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                            <Truck className="w-4 h-4 text-slate-400" />
                                            Customer Info
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                                            <p className="text-sm text-slate-500 italic">{selectedOrder.customerEmail}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                            Payment
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-800 italic">₹{selectedOrder.total}</p>
                                            <p className={`text-xs font-bold uppercase tracking-widest ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {selectedOrder.paymentStatus}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, i) => (
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
                                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <ImagePlus className="w-4 h-4 text-slate-400" />
                                        Job Photos
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {selectedOrder.startImage ? (
                                            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video relative">
                                                <img src={selectedOrder.startImage} alt="Start" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-2">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Before</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                No Before
                                            </div>
                                        )}

                                        {selectedOrder.completionImage ? (
                                            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video relative">
                                                <img src={selectedOrder.completionImage} alt="Completion" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-2">
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">After</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                No After
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100 flex flex-col gap-3">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                setShowDetailModal(false);
                                                setShowAssignModal(true);
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all border border-slate-200"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            {selectedOrder.technician ? 'Reassign Tech' : 'Assign Technician'}
                                        </button>
                                        <button
                                            onClick={() => handleRefund(selectedOrder.id)}
                                            className="flex-1 flex items-center justify-center gap-2 text-rose-600 bg-rose-50 py-3 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Issue Refund
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder.id, 'Cancelled')}
                                        className="w-full text-xs font-bold text-slate-400 hover:text-rose-500 transition-all uppercase tracking-widest py-2"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* View Images Modal */}
            {
                showImageModal && selectedOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowImageModal(false)}></div>
                        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden p-8 animate-scale-up">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <ImagePlus className="w-5 h-5 text-indigo-600" />
                                        Job Photos
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-1 italic">Order: {selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setShowImageModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {selectedOrder.startImage ? (
                                    <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video relative">
                                        <img src={selectedOrder.startImage} alt="Start" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-3">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">Before</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-sm font-bold uppercase tracking-widest">
                                        No Before Photo
                                    </div>
                                )}

                                {selectedOrder.completionImage ? (
                                    <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video relative">
                                        <img src={selectedOrder.completionImage} alt="Completion" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-3">
                                            <span className="text-xs font-bold text-white uppercase tracking-wider">After</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center aspect-video text-slate-400 text-sm font-bold uppercase tracking-widest">
                                        No After Photo
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Assign Technician Modal */}
            {
                showAssignModal && selectedOrder && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAssignModal(false)}></div>
                        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden p-8 animate-scale-up">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Assign Technician</h2>
                                    <p className="text-xs text-slate-500 mt-1 italic">Order: {selectedOrder.id}</p>
                                </div>
                                <button onClick={() => setShowAssignModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {employees.map((emp) => (
                                    <button
                                        key={emp.id}
                                        onClick={() => assignTechnician(selectedOrder.id, emp.name)}
                                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-100">
                                                <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                            </div>
                                            <span className="font-bold text-slate-700 group-hover:text-indigo-900">{emp.name}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Orders;
