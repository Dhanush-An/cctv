import { useState, useMemo, useEffect } from 'react';
import { Star, ShoppingCart, Eye, Search, SlidersHorizontal, Camera, X, IndianRupee } from 'lucide-react';
import { getProducts, SYNC_CHANNEL } from '../utils/dataStore';
import type { Product } from '../utils/dataStore';
import { addToCart } from '../utils/cartStore';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/wishlistStore';
import { useAuth } from '../context/AuthContext';
import { Heart } from 'lucide-react';


const CATEGORIES = ['All Products', 'IP Cameras', 'Analog Cameras', 'Storage', 'Cables & PWR'];

const RATINGS = [4, 3, 2];

interface Props {
    onBuyNow?: (product: Product) => void;
    compact?: boolean;
    title?: string;
    subtitle?: string;
}

const ProductCatalog = ({ onBuyNow, compact = false, title, subtitle }: Props) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [maxPrice, setMaxPrice] = useState(100000); // Higher default to catch all initially
    const [absMax, setAbsMax] = useState(100000);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc'>('popularity');
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

    // Fetch products from backend and re-fetch when admin changes data
    useEffect(() => {
        const refresh = () =>
            getProducts().then(products => {
                setAllProducts(products);
                if (products.length > 0) {
                    const highest = Math.max(...products.map(p => p.offerPrice ?? p.price));
                    // Add a small buffer and ensure at least 10000
                    const peak = Math.max(10000, Math.ceil(highest / 5000) * 5000);
                    setAbsMax(peak);
                    setMaxPrice(peak); // Ensure all show by default
                }
            }).finally(() => setLoading(false));

        refresh();
        window.addEventListener('products-updated', refresh);
        SYNC_CHANNEL.onmessage = (e: MessageEvent) => {
            if (e.data.type === 'products-updated') refresh();
        };
        return () => window.removeEventListener('products-updated', refresh);
    }, []);

    const filtered = useMemo(() => {
        let list = [...allProducts];
        if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
        if (selectedCategory !== 'All Products') list = list.filter(p => p.category === selectedCategory);
        list = list.filter(p => (p.offerPrice ?? p.price) <= maxPrice);
        if (sortBy === 'price_asc') list.sort((a, b) => (a.offerPrice ?? a.price) - (b.offerPrice ?? b.price));
        if (sortBy === 'price_desc') list.sort((a, b) => (b.offerPrice ?? b.price) - (a.offerPrice ?? a.price));
        return list;
    }, [allProducts, search, selectedCategory, maxPrice, sortBy]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className={`${compact ? 'px-6 md:px-8 py-4' : 'max-w-7xl mx-auto px-6 py-4'}`}>
            {/* Title row (optional — landing page only) */}
            {title && (
                <div className="mb-3">
                    <h1 className="text-xl font-black text-slate-800 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
                </div>
            )}

            <div className="flex gap-6 items-start">
                {/* ─── Sidebar ─── */}
                <aside className={`shrink-0 ${compact ? 'w-44' : 'w-52'} sticky top-16 self-start`}>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-5 max-h-[calc(100vh-4.5rem)] overflow-y-auto">

                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Categories
                            </h3>
                            <ul className="space-y-1.5">
                                {CATEGORIES.map(cat => (
                                    <li key={cat}>
                                        <label className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={selectedCategory === cat}
                                                onChange={() => setSelectedCategory(cat)}
                                                className="accent-blue-600 w-4 h-4"
                                            />
                                            <span className={`text-sm transition-colors ${selectedCategory === cat ? 'text-blue-600 font-bold' : 'text-slate-600 group-hover:text-slate-800'}`}>{cat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-3">Price</h3>
                            <input
                                type="range" min={0} max={absMax} step={500}
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                                className="w-full accent-blue-600"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1 font-medium">
                                <span>₹0</span>
                                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {/* Rating */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-3">Rating</h3>
                            <ul className="space-y-1.5">
                                {RATINGS.map(r => (
                                    <li key={r}>
                                        <label className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="radio" name="rating"
                                                checked={minRating === r}
                                                onChange={() => setMinRating(prev => prev === r ? 0 : r)}
                                                className="accent-blue-600 w-4 h-4"
                                            />
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < r ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                                ))}
                                                <span className="text-xs text-slate-500 ml-1">& Up</span>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Sort By */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-3">Sort by</h3>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white cursor-pointer"
                            >
                                <option value="popularity">Popularity</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>{/* end card */}
                </aside>

                {/* ─── Main content ─── */}
                <div className="flex-1 min-w-0 space-y-4">
                    {/* Search + sort row */}
                    <div className="flex items-center gap-3 justify-end">
                        <div className="relative max-w-sm w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search cameras, services..."
                                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-colors shadow-sm shadow-blue-200 shrink-0">
                            <Search className="w-4 h-4" /> Search
                        </button>
                    </div>

                    {/* Results count */}
                    <p className="text-sm font-semibold text-slate-700">
                        Showing {filtered.length} results
                        {search && <span className="ml-2 text-blue-600 font-medium text-xs">for "{search}"</span>}
                    </p>

                    {/* Products grid */}

                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-slate-400">
                            <Camera className="w-12 h-12 mx-auto opacity-20 mb-3" />
                            <p className="font-medium">No products match your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                            {filtered.map(p => (
                                <ProductCard key={p.id} product={p} onBuyNow={onBuyNow} onViewDetails={() => setViewingProduct(p)} />
                            ))}
                        </div>
                    )}

                    {/* Dynamic Exclusive Offers */}
                    {!search && allProducts.filter(p => !!p.offerPrice).length > 0 && (
                        <div>
                            <h2 className="text-lg font-black text-slate-800 mb-4">Exclusive Offers</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allProducts.filter(p => !!p.offerPrice).slice(0, 2).map((p, i) => (
                                    <div key={p.id} className={`relative rounded-2xl overflow-hidden p-5 flex items-center gap-4 shadow-md ${i === 0 ? 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-orange-200' : 'bg-gradient-to-r from-blue-600 to-indigo-500 shadow-blue-200'}`}>
                                        <span className={`shrink-0 bg-white font-black text-sm px-3 py-1.5 rounded-xl shadow ${i === 0 ? 'text-orange-500' : 'text-blue-600'}`}>
                                            {Math.round((1 - (p.offerPrice! / p.price)) * 100)}% OFF
                                        </span>
                                        <div className="flex-1">
                                            <p className="font-black text-white text-base truncate">{p.name}</p>
                                            <p className="text-white/80 text-xs mt-0.5 line-through">₹{p.price.toLocaleString('en-IN')}</p>
                                            <p className="text-white font-black text-lg">₹{p.offerPrice!.toLocaleString('en-IN')}</p>
                                        </div>
                                        <img
                                            src={p.image}
                                            alt={p.name}
                                            className="w-20 h-20 object-cover rounded-xl opacity-90 shrink-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Details Modal */}
            {viewingProduct && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingProduct(null)}></div>
                    <div className="relative w-full max-w-md bg-white h-screen shadow-2xl animate-slide-left flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">Product Details</h2>
                            <button onClick={() => setViewingProduct(null)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* Image */}
                                <div className="rounded-2xl border border-slate-200 overflow-hidden relative">
                                    <img src={viewingProduct.image} alt={viewingProduct.name} className="w-full h-64 object-cover" />
                                    {viewingProduct.offerPrice && (
                                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg">
                                            SALE - {Math.round((1 - (viewingProduct.offerPrice / viewingProduct.price)) * 100)}% OFF
                                        </div>
                                    )}
                                </div>

                                {/* Title & Category */}
                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg">
                                            {viewingProduct.category}
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="text-sm font-bold text-slate-700">4.8</span>
                                            <span className="text-xs text-slate-400">(22)</span>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 leading-tight">{viewingProduct.name}</h3>
                                </div>

                                {/* Pricing */}
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Price</p>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-3xl font-black text-blue-600 flex items-center">
                                                <IndianRupee className="w-6 h-6 leading-none inline" strokeWidth={3} />
                                                {(viewingProduct.offerPrice || viewingProduct.price).toLocaleString('en-IN')}
                                            </span>
                                            {viewingProduct.offerPrice && (
                                                <span className="text-sm text-slate-400 font-bold line-through">₹{viewingProduct.price.toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Availability</p>
                                        <span className={`text-sm font-bold ${viewingProduct.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {viewingProduct.stock > 0 ? `In Stock (${viewingProduct.stock})` : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Description</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {viewingProduct.description || "No description available for this product."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                            <button
                                onClick={() => {
                                    addToCart({
                                        id: viewingProduct.id,
                                        name: viewingProduct.name,
                                        image: viewingProduct.image,
                                        price: viewingProduct.price,
                                        offerPrice: viewingProduct.offerPrice,
                                        category: viewingProduct.category,
                                    });
                                    setViewingProduct(null);
                                    onBuyNow?.(viewingProduct);
                                }}
                                disabled={viewingProduct.stock <= 0}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {viewingProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─── Product Card ─── */
const ProductCard = ({ product, onBuyNow, onViewDetails }: { product: Product; onBuyNow?: (p: Product) => void; onViewDetails?: (p: Product) => void }) => {
    const { user } = useAuth();
    const [wishlisted, setWishlisted] = useState(false);

    useEffect(() => {
        if (user) {
            isInWishlist(product.id, user).then(setWishlisted);
        }
    }, [user, product.id]);

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) return alert('Please login to use wishlist');
        if (wishlisted) {
            await removeFromWishlist(product.id, user);
            setWishlisted(false);
        } else {
            await addToWishlist(product.id, user);
            setWishlisted(true);
        }
    };

    const displayPrice = product.offerPrice ?? product.price;
    const hasOffer = !!product.offerPrice;
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.price,
            offerPrice: product.offerPrice,
            category: product.category,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
        onBuyNow?.(product);
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-400"
                />
                {hasOffer && (
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">SALE</span>
                )}
                <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">{product.category}</span>
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-2 right-12 p-1.5 rounded-lg shadow-sm transition-all ${wishlisted ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500'}`}
                >
                    <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-0.5 truncate">{product.name}</h3>
                <p className="text-xs text-slate-400 mb-2">{product.category} · In stock: {product.stock}</p>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">(22)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-black text-slate-800">₹{displayPrice.toLocaleString('en-IN')}</span>
                    {hasOffer && (
                        <span className="text-xs text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleAddToCart}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 font-bold text-xs rounded-lg transition-all ${added
                            ? 'bg-emerald-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {added ? 'Added!' : 'Add to Cart'}
                    </button>
                    <button onClick={() => onViewDetails?.(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors">
                        <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog;
