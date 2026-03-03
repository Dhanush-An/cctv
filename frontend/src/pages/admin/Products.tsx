import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    AlertCircle,
    X,
    Package
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts, saveProduct, updateProduct as updateProductAPI, deleteProduct, notifySync } from '../../utils/dataStore';
import type { Product } from '../../utils/dataStore';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [stockSearch, setStockSearch] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => { getProducts().then(setProducts); }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const name = formData.get('name') as string;
        const category = formData.get('category') as string;
        const stock = parseInt(formData.get('stock') as string) || 0;
        const price = parseInt(formData.get('price') as string) || 0;
        const offerPriceRaw = formData.get('offerPrice') as string;
        const offerPrice = offerPriceRaw ? parseInt(offerPriceRaw) : undefined;
        const image = imagePreview || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=200';

        try {
            if (editingProduct) {
                const updated = await updateProductAPI(editingProduct.id, { name, category, stock, price, offerPrice, image: imagePreview || editingProduct.image });
                setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
            } else {
                const created = await saveProduct({ name, category, stock, price, offerPrice, image, offers: [] });
                setProducts(prev => [...prev, created]);
            }
            setShowModal(false);
            setImagePreview(null);
            notifySync('products');
        } catch (error) {
            console.error('Failed to save product:', error);
            alert('Failed to save product. Please try again.');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            notifySync('products');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Product Management</h1>
                    <p className="text-sm text-slate-500">Manage your CCTV inventory, stock, and offers here.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowStockModal(true)}
                        className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all"
                    >
                        <Package className="w-5 h-5 text-indigo-500" />
                        Manage Stock
                    </button>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
                    >
                        <Plus className="w-5 h-5" />
                        Add New Product
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="flex gap-2">
                        <select className="bg-slate-50 border-none rounded-xl text-sm px-4 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                            <option>All Categories</option>
                            <option>IP Cameras</option>
                            <option>Analog Cameras</option>
                            <option>Storage</option>
                            <option>Cables & PWR</option>
                        </select>
                    </div>
                    <div className="relative flex-1 max-w-sm md:ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 italic font-medium text-slate-400 text-sm">
                                <th className="pb-4 pl-4">Product</th>
                                <th className="pb-4">Category</th>
                                <th className="pb-4">Price</th>
                                <th className="pb-4">Stock</th>
                                <th className="pb-4">Offers</th>
                                <th className="pb-4 pr-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-4">
                                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <p className="font-bold text-slate-800">{product.name}</p>
                                                <p className="text-xs text-slate-400">{product.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-slate-600 font-medium">{product.category}</td>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold ${product.offerPrice ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                                ₹{product.price}
                                            </span>
                                            {product.offerPrice && (
                                                <span className="text-sm font-bold text-emerald-600">₹{product.offerPrice}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm">
                                        <span className={`font-bold ${product.stock < 15 ? 'text-rose-500' : 'text-slate-600'}`}>
                                            {product.stock}
                                        </span>
                                        {product.stock < 15 && (
                                            <span className="ml-2 text-[10px] bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full font-bold">Low Stock</span>
                                        )}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex gap-1 flex-wrap max-w-[150px]">
                                            {product.offers.length > 0 ? (
                                                product.offers.map((offer, i) => (
                                                    <span key={i} className="text-[10px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">
                                                        {offer}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-slate-300 italic">No Active Offers</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                            <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                            <p className="font-medium text-lg italic">No products found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal / Sidebar Form */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <form onSubmit={handleSave} className="relative w-full max-w-xl bg-white h-screen shadow-2xl animate-slide-left p-0 overflow-y-auto">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <p className="text-xs text-slate-500">Fill in the product details and save changes.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setImagePreview(null);
                                }}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Product Name</label>
                                    <input type="text" name="name" defaultValue={editingProduct?.name} required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Category</label>
                                    <select name="category" defaultValue={editingProduct?.category} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500">
                                        <option>IP Cameras</option>
                                        <option>Analog Cameras</option>
                                        <option>Storage</option>
                                        <option>Cables & PWR</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Stock Units</label>
                                    <input type="number" name="stock" defaultValue={editingProduct?.stock} required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Regular Price (₹)</label>
                                    <input type="number" name="price" defaultValue={editingProduct?.price} required className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Offer Price (₹ - Optional)</label>
                                    <input type="number" name="offerPrice" defaultValue={editingProduct?.offerPrice} className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-slate-700">Product Images</label>
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="text-xs font-bold text-indigo-600 hover:underline"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <label className="aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-400 transition-all text-slate-400 hover:text-indigo-600">
                                        <ImageIcon className="w-8 h-8 opacity-50" />
                                        <span className="text-[10px] font-bold">Add Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                    {(imagePreview || editingProduct) && (
                                        <div className="aspect-square bg-slate-50 rounded-2xl relative group overflow-hidden border border-slate-100">
                                            <img src={imagePreview || editingProduct?.image} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => setImagePreview(null)}
                                                    className="text-white p-2 hover:scale-110 transition-transform"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700">Active Offers</label>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Add custom offer tag..." className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
                                    <button type="button" className="bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-all"><Plus className="w-5 h-5 text-slate-600" /></button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {editingProduct?.offers.map((offer, i) => (
                                        <span key={i} className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl text-xs font-bold">
                                            {offer}
                                            <X className="w-3 h-3 cursor-pointer hover:text-indigo-800" />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex gap-4 sticky bottom-0 z-10">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowModal(false);
                                    setImagePreview(null);
                                }}
                                className="flex-1 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-100">
                                {editingProduct ? 'Save Changes' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stock Management Modal */}
            {showStockModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowStockModal(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Inventory Stock Status</h2>
                                <p className="text-xs text-slate-500 italic mt-1">Real-time stock units and status checks.</p>
                            </div>
                            <button onClick={() => setShowStockModal(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="px-8 py-4 bg-slate-50/50 italic shrink-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Find product by name..."
                                    value={stockSearch}
                                    onChange={(e) => setStockSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="sticky top-0 bg-white z-10 shadow-sm shadow-white">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                        <th className="px-4 py-3">Product Info</th>
                                        <th className="px-4 py-3">Units</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {products
                                        .filter(p => p.name.toLowerCase().includes(stockSearch.toLowerCase()))
                                        .map((product) => {
                                            const isLow = product.stock < 50;
                                            return (
                                                <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-slate-100 bg-white">
                                                                <img src={product.image} alt="" className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-sm font-bold text-slate-800 line-clamp-1">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`text-sm font-black ${isLow ? 'text-rose-500' : 'text-slate-800'}`}>
                                                            {product.stock} Units
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${isLow ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                            }`}>
                                                            {isLow ? 'Low Stock' : 'Stock Good'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <button
                                                            onClick={() => {
                                                                setShowStockModal(false);
                                                                setEditingProduct(product);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-all"
                                                        >
                                                            Update
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                        <span className="font-bold text-slate-500 underline decoration-emerald-200 underline-offset-4">Good Stock (≥50)</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                                        <span className="font-bold text-slate-500 underline decoration-rose-200 underline-offset-4">Low Stock (&lt;50)</span>
                                    </div>
                                </div>
                                <p className="font-medium text-slate-400">Showing {products.length} products total</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
