import { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, clearCart } from '../../utils/cartStore';
import type { CartItem } from '../../utils/cartStore';
import { getOrders, createOrder } from '../../utils/orderStore';
import { getEmployees } from '../../utils/employeeStore';
import { addNotification } from '../../utils/notificationStore';
import { useAuth } from '../../context/AuthContext';

const CartPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const fetchCart = async () => {
        try {
            const cart = await getCart();
            setItems(cart);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
            // Optionally set items to empty or show an error state
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (id: string) => {
        const updatedItems = await removeFromCart(id);
        setItems(updatedItems);
    };

    const handleQuantity = async (id: string, action: 'inc' | 'dec') => {
        await updateCartQuantity(id, action);
        fetchCart();
    };

    const safeItems = Array.isArray(items) ? items : [];
    const subtotal = safeItems.reduce((sum, item) => {
        const price = Number(item.offerPrice ?? item.price ?? 0);
        const qty = Number(item.quantity ?? 1);
        return sum + (isNaN(price) ? 0 : price) * (isNaN(qty) ? 1 : qty);
    }, 0);
    const shippingFee = safeItems.length > 0 ? 50 : 0;
    const total = subtotal + shippingFee;

    const handleBuyNow = async () => {
        if (safeItems.length === 0) return;
        setPlacingOrder(true);

        try {
            const hasService = safeItems.some(item => (item.category || '').toLowerCase().includes('service'));
            const type = hasService
                ? (safeItems.some(item => !(item.category || '').toLowerCase().includes('service')) ? 'Mixed' : 'Service')
                : 'Product';

            const derivedName = user
                ? (user === 'john@example.com' ? 'John Doe' : user.split('@')[0])
                : 'Demo Customer';

            let assignedTechnician: string | undefined = undefined;

            if (hasService) {
                try {
                    const employees = await getEmployees();
                    const activeTechs = employees.filter(emp => emp.status === 'Active');
                    if (activeTechs.length > 0) {
                        const allOrders = await getOrders();
                        const techOrders = allOrders
                            .filter(o => o.technician && (o.type === 'Service' || o.type === 'Mixed'))
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        if (techOrders.length === 0) {
                            assignedTechnician = activeTechs[0].name;
                        } else {
                            const lastTechName = techOrders[0].technician;
                            const lastTechIndex = activeTechs.findIndex(t => t.name === lastTechName);
                            assignedTechnician = (lastTechIndex === -1 || lastTechIndex === activeTechs.length - 1)
                                ? activeTechs[0].name
                                : activeTechs[lastTechIndex + 1].name;
                        }
                    }
                } catch (techError) {
                    console.warn('Could not assign technician:', techError);
                }
            }

            const order = await createOrder({
                customerName: derivedName,
                customerEmail: user || 'customer@demo.com',
                items: safeItems,
                total: total,
                type: type as 'Product' | 'Service' | 'Mixed',
                technician: assignedTechnician
            });

            // Non-blocking - don't let notification failure cancel checkout
            const orderId = order.id || (order as any)._id || 'new';
            addNotification({
                userId: user || 'customer@demo.com',
                message: `Order #${String(orderId).slice(-4)} placed successfully!`,
                type: 'Order'
            }).catch(err => console.warn('Notification failed (non-critical):', err));

            // Clear cart - also non-blocking
            clearCart().catch(err => console.warn('Clear cart failed (non-critical):', err));

            setItems([]);
            setShowSuccess(true);
        } catch (error) {
            console.error('Error placing order:', error);
            alert(`Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-black text-slate-800 mb-8">Your Cart</h1>

            {safeItems.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-20 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-slate-200 mb-6" />
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                    <p className="text-slate-400 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        onClick={() => navigate('/customer/products')}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-100"
                    >
                        Explore Products
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List (Left Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Price</div>
                                <div className="col-span-2 text-center">Quantity</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Item Rows */}
                            <div className="divide-y divide-slate-50">
                                {safeItems.map(item => (
                                    <div key={item.id} className="grid grid-cols-12 items-center px-6 py-6 group hover:bg-slate-50/50 transition-colors">
                                        {/* Product Info */}
                                        <div className="col-span-6 flex gap-4">
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-2xl border border-slate-100 shadow-sm"
                                                />
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="absolute -top-2 -left-2 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-rose-500 shadow-sm hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                            <div className="min-w-0 pr-4">
                                                <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{item.name}</h3>
                                                <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase tracking-tight">{item.category} | Night Vision</p>
                                                <div className="flex items-center gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                                    ))}
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1">(20)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-span-2 text-center">
                                            <span className="font-bold text-slate-700 text-sm">
                                                ₹{(item.offerPrice ?? item.price).toLocaleString('en-IN')}
                                            </span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="col-span-2 flex justify-center">
                                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                                                <button
                                                    onClick={() => handleQuantity(item.id, 'dec')}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantity(item.id, 'inc')}
                                                    className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Line Total */}
                                        <div className="col-span-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="font-black text-slate-900 text-sm focus:outline-none">
                                                    ₹{((item.offerPrice ?? item.price) * item.quantity).toLocaleString('en-IN')}
                                                </span>
                                                <ChevronRight className="w-3 h-3 text-blue-500 opacity-20" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom Buttons */}
                            <div className="p-6 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
                                <button
                                    onClick={() => navigate('/customer/products')}
                                    className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={placingOrder}
                                    className="px-10 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl transition-all shadow-lg shadow-orange-100 flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {placingOrder && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
                                    {placingOrder ? 'Processing...' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary (Right Column) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 sticky top-24">
                            <h2 className="text-xl font-black text-slate-800 mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Subtotal</span>
                                    <span className="font-black text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-medium text-slate-500">Shipping Fee</span>
                                    <span className="font-black text-slate-800">₹{shippingFee}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-between items-end mb-8">
                                <span className="text-sm font-bold text-slate-800">Order Total</span>
                                <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                disabled={placingOrder}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-[24px] transition-all shadow-xl shadow-blue-100 transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {placingOrder && <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />}
                                {placingOrder ? 'Processing...' : 'Buy Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Order Successful!</h2>
                        <p className="text-slate-500 mb-8">Your order has been placed successfully.</p>
                        <button
                            onClick={() => navigate('/customer')}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-200 cursor-pointer"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
