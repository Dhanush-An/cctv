
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../utils/dataStore';
import { getWishlistItems, removeFromWishlist } from '../../utils/wishlistStore';
import type { Product } from '../../utils/dataStore';
import { addToCart } from '../../utils/cartStore';

const Wishlist = () => {
    const { user } = useAuth();
    const [wishlistedProducts, setWishlistedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadWishlist = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [products, wishlistItems] = await Promise.all([
                getProducts(),
                getWishlistItems(user)
            ]);
            const wishProdIds = wishlistItems.map(item => item.productId);
            setWishlistedProducts(products.filter(p => wishProdIds.includes(p.id)));
        } catch (error) {
            console.error('Error loading wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
        window.addEventListener('wishlist-updated', loadWishlist);
        return () => window.removeEventListener('wishlist-updated', loadWishlist);
    }, [user]);

    const handleRemove = async (productId: string) => {
        if (!user) return;
        await removeFromWishlist(productId, user);
        // Event listener will trigger refresh
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            offerPrice: product.offerPrice,
            category: product.category,
        });
        // Optionally remove from wishlist after adding to cart?
        // handleRemove(product.id);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/customer" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-800">My Wishlist</h1>
                    <p className="text-slate-500 text-sm mt-1">Products you've saved for later.</p>
                </div>
            </div>

            {wishlistedProducts.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-slate-300" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
                    <p className="text-slate-500 mb-6 max-w-xs mx-auto">Explore our catalog and save items you're interested in.</p>
                    <Link
                        to="/customer/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-100"
                    >
                        <Package className="w-5 h-5" />
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {wishlistedProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="relative h-48">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <button
                                    onClick={() => handleRemove(product.id)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {product.offerPrice && (
                                    <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                                        SALE
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="mb-4">
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mb-1">{product.category}</p>
                                    <h3 className="font-bold text-slate-800 leading-tight mb-2 truncate">{product.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-black text-slate-800">
                                            ₹{(product.offerPrice || product.price).toLocaleString('en-IN')}
                                        </span>
                                        {product.offerPrice && (
                                            <span className="text-sm text-slate-400 font-bold line-through">₹{product.price.toLocaleString('en-IN')}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-100 transition-all"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
