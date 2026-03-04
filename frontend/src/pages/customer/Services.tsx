import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, ShoppingCart, Clock, Wrench } from 'lucide-react';
import { getServices, SYNC_CHANNEL } from '../../utils/dataStore';
import type { Service } from '../../utils/dataStore';
import { addToCart } from '../../utils/cartStore';

const SERVICE_TYPES = ['All Services', 'Installation', 'Maintenance', 'Repair'];
const RATINGS = [4, 3, 2];

/* ─── Service Card ─── */
const ServiceCard = ({ svc }: { svc: Service }) => {
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        await addToCart({
            id: svc.id,
            name: svc.name,
            image: svc.image,
            price: svc.price,
            category: 'Service',
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative overflow-hidden">
                <img
                    src={svc.image}
                    alt={svc.name}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg">{svc.type}</span>
            </div>
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2 pr-2">{svc.name}</h3>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs shrink-0">
                        <span>★</span>{svc.rating}
                    </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{svc.description}</p>

                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Clock className="w-3.5 h-3.5 shrink-0 text-blue-500" />{svc.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                        <Wrench className="w-3.5 h-3.5 shrink-0 text-blue-500" />Pro Setup
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Starting From</p>
                        <p className="text-xl font-black text-slate-800 tracking-tight">₹{svc.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            title="Add to Cart"
                            className={`p-2.5 rounded-xl transition-all shadow-sm ${added ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all shadow-md whitespace-nowrap ${added ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100'}`}
                        >
                            {added ? 'Added!' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ─── Main Page ─── */
const CustomerServices = () => {
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('All Services');
    const [maxPrice, setMaxPrice] = useState(5000);

    useEffect(() => {
        const refresh = () => getServices().then(setAllServices);
        refresh();
        window.addEventListener('services-updated', refresh);
        SYNC_CHANNEL.onmessage = (e) => {
            if (e.data.type === 'services-updated') refresh();
        };
        return () => window.removeEventListener('services-updated', refresh);
    }, []);

    const filtered = useMemo(() => {
        let list = [...allServices];
        if (search) list = list.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.description.toLowerCase().includes(search.toLowerCase())
        );
        if (selectedType !== 'All Services') list = list.filter(s => s.type === selectedType);
        list = list.filter(s => s.price <= maxPrice);
        return list;
    }, [allServices, search, selectedType, maxPrice]);

    return (
        <div className="-mt-6 md:-mt-8 -mx-6 md:-mx-8">
            <div className="max-w-7xl mx-auto px-6 py-4">

                <div className="flex gap-8 items-start">

                    {/* ─── Sidebar ─── */}
                    <aside className="shrink-0 w-60 sticky top-16 self-start bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-8">

                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-blue-600" /> Categories
                            </h3>
                            <ul className="space-y-2">
                                {SERVICE_TYPES.map(t => (
                                    <li key={t}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedType === t ? 'bg-blue-600 border-blue-600 ring-4 ring-blue-50' : 'border-slate-200 group-hover:border-slate-300'}`}>
                                                {selectedType === t && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                                <input
                                                    type="radio"
                                                    name="svcType"
                                                    checked={selectedType === t}
                                                    onChange={() => setSelectedType(t)}
                                                    className="hidden"
                                                />
                                            </div>
                                            <span className={`text-sm transition-colors ${selectedType === t ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-700 font-medium'}`}>
                                                {t}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 text-sm">Budget Tool</h3>
                                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-widest">INR</span>
                            </div>
                            <input
                                type="range" min={500} max={10000} step={100}
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[11px] text-slate-400 mt-3 font-bold uppercase tracking-tighter">
                                <span>₹500</span>
                                <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
                                <span>₹10,000</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 text-sm mb-4">Client Rating</h3>
                            <ul className="space-y-2">
                                {RATINGS.map(r => (
                                    <li key={r}>
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 rounded-md border-slate-200 text-blue-600 focus:ring-blue-500" />
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={`text-sm ${i < r ? 'text-amber-400' : 'text-slate-100'}`}>★</span>
                                                ))}
                                                <span className="text-xs text-slate-400 ml-1 font-bold group-hover:text-slate-600 transition-colors">{r}.0 & Up</span>
                                            </div>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="p-4 bg-slate-900 rounded-2xl">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Support 24/7</p>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium mb-3">Questions about installation? Our experts are here.</p>
                                <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest">Chat Now</button>
                            </div>
                        </div>
                    </aside>

                    {/* ─── Main content ─── */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Search + results row */}
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by keyword, package name, or scope..."
                                    className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-slate-600 placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-100">
                                <Search className="w-4 h-4" /> Find Service
                            </button>
                        </div>

                        {/* Header info */}
                        <div className="flex items-end justify-between px-2">
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Professional Services</h1>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                                    Found {filtered.length} available service packages
                                </p>
                            </div>
                            {search && (
                                <button onClick={() => setSearch('')} className="text-xs font-bold text-blue-600 hover:underline">Clear Search</button>
                            )}
                        </div>

                        {/* Grid */}
                        {filtered.length === 0 ? (
                            <div className="py-24 bg-white rounded-[40px] border border-dashed border-slate-200 text-center">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wrench className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">No services matched your search</h3>
                                <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 font-medium">Try adjusting your budget or category filters to see more results.</p>
                                <button
                                    onClick={() => { setSelectedType('All Services'); setMaxPrice(5000); setSearch(''); }}
                                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 pb-20">
                                {filtered.map(svc => <ServiceCard key={svc.id} svc={svc} />)}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerServices;
