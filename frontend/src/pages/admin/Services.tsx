import {
    Clock,
    Search,
    AlertCircle,
    Filter,
    ChevronRight,
    Plus,
    X,
    Trash2,
    IndianRupee,
    Star
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import {
    getServices, saveService, deleteService,
    notifySync
} from '../../utils/dataStore';
import type { Service } from '../../utils/dataStore';

const Services = () => {
    const [activeTab, setActiveTab] = useState('offerings');
    const [offerings, setOfferings] = useState<Service[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=200');
    const [descriptionHtml, setDescriptionHtml] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        getServices().then(setOfferings);
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);

        const newOffering = {
            name: (data.get('name') as string) || 'New Service',
            type: (data.get('type') as Service['type']) || 'Installation',
            price: Number(data.get('price')) || 0,
            description: descriptionHtml || (data.get('description') as string) || '',
            image: imageUrl || (data.get('image') as string) || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
            duration: (data.get('duration') as string) || '2-4 Hours',
            rating: 5.0,
        };
        const created = await saveService(newOffering);
        setOfferings(prev => [...prev, created]);
        notifySync('services');

        setDescriptionHtml('');
        setImageUrl('https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=200');
        if (editorRef.current) {
            editorRef.current.innerHTML = '';
        }
        setShowAddModal(false);
    };

    const handleDeleteOffering = async (id: string) => {
        if (confirm('Are you sure you want to delete this service offering?')) {
            await deleteService(id);
            setOfferings(prev => prev.filter(s => s.id !== id));
            notifySync('services');
        }
    };

    const filteredOfferings = offerings.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Service Management</h1>
                    <p className="text-sm text-slate-500 italic">Manage your service offerings.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus className="w-5 h-5" />
                    Add New Service
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('offerings')}
                    className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'offerings' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                >
                    Service Offerings
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="card">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <button className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {filteredOfferings.map((offering) => (
                                <div key={offering.id} className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                                <img src={offering.image} alt={offering.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-slate-800">{offering.name}</h3>
                                                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md">
                                                        {offering.type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{offering.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-700 font-bold">
                                                        <IndianRupee className="w-3 h-3" />
                                                        {offering.price.toLocaleString('en-IN')}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[11px] text-slate-400 italic">
                                                        <Clock className="w-3 h-3" />
                                                        {offering.duration}
                                                    </span>
                                                    <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-bold">
                                                        <Star className="w-3 h-3 fill-amber-500" />
                                                        {offering.rating.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end justify-between h-20 py-1">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteOffering(offering.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Schedule Preview */}
                <div className="space-y-6">
                    <div className="card">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center justify-between">
                            Quick Stats
                            <AlertCircle className="w-4 h-4 text-indigo-600" />
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Live Services</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-bold text-indigo-600">{offerings.length}</p>
                                    <span className="text-xs text-slate-400 font-bold mb-1">active offerings</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-slate-900 border-none">
                        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Maintenance Tips</h3>
                        <p className="text-xs text-slate-400 italic leading-relaxed">
                            "Regular cleaning of camera lenses every 3 months can prevent 40% of image quality issues reported by customers."
                        </p>
                        <button className="w-full py-3 mt-6 text-xs font-bold text-indigo-400 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all uppercase tracking-widest">
                            Service Guide
                        </button>
                    </div>
                </div>
            </div>

            {/* Combined Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>

                    <form onSubmit={handleAdd} className="relative w-full max-w-4xl bg-[#f8fafc] h-screen shadow-2xl animate-slide-left flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-800">Add Service</h2>
                            <button type="button" onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {/* Step Indicator */}
                            <div className="flex items-center gap-4 mb-10 max-w-2xl mx-auto">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                                    <span className="text-sm font-bold text-indigo-900">Service Details</span>
                                </div>
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <div className="flex items-center gap-2 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">2</div>
                                    <span className="text-sm font-medium text-slate-500">Pricing</span>
                                </div>
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <div className="flex items-center gap-2 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">3</div>
                                    <span className="text-sm font-medium text-slate-500">Duration</span>
                                </div>
                                <div className="flex-1 h-px bg-slate-200"></div>
                                <div className="flex items-center gap-2 opacity-50">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">4</div>
                                    <span className="text-sm font-medium text-slate-500">Publish</span>
                                </div>
                            </div>

                            {/* Form Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column: Data Entry */}
                                <div className="lg:col-span-2 space-y-6">
                                    <h3 className="text-lg font-bold text-slate-800 mb-4">Service Details</h3>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Service Name <span className="text-rose-500">*</span></label>
                                        <input name="name" type="text" required className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" placeholder="Enter service name" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-slate-700">Service Description</label>
                                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                            {/* Functional Rich Text Toolbar */}
                                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border-b border-slate-100">
                                                <button type="button" onClick={() => document.execCommand('bold', false, '')} className="font-bold text-slate-600 cursor-pointer hover:text-indigo-600 px-1">B</button>
                                                <button type="button" onClick={() => document.execCommand('italic', false, '')} className="italic text-slate-600 cursor-pointer hover:text-indigo-600 px-1">I</button>
                                                <button type="button" onClick={() => document.execCommand('underline', false, '')} className="underline text-slate-600 cursor-pointer hover:text-indigo-600 px-1">U</button>
                                                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                                                <button type="button" onClick={() => document.execCommand('insertUnorderedList', false, '')} className="text-slate-600 cursor-pointer hover:text-indigo-600 px-1">⋮=</button>
                                                <button type="button" onClick={() => document.execCommand('insertOrderedList', false, '')} className="text-slate-600 cursor-pointer hover:text-indigo-600 px-1">1.</button>
                                            </div>
                                            <div
                                                ref={editorRef}
                                                contentEditable
                                                onInput={(e) => setDescriptionHtml(e.currentTarget.innerHTML)}
                                                className="w-full min-h-[140px] px-4 py-3 text-sm focus:outline-none"
                                            />
                                            {/* Fallback plain text for required validation if needed, or hidden input containing the inner HTML */}
                                            <input type="hidden" name="description" value={descriptionHtml} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Starting Price <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <IndianRupee className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input name="price" type="number" required className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" placeholder="Enter starting price" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Discount Price</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <IndianRupee className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <input name="discountPrice" type="number" className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" placeholder="Enter discount price" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Category <span className="text-rose-500">*</span></label>
                                            <select name="type" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm appearance-none">
                                                <option value="Installation">Installation</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Repair">Repair</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-slate-700">Stock Quantity</label>
                                            <input name="stockQuantity" type="number" defaultValue={99} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Media */}
                                <div className="lg:col-span-1 border border-slate-200 rounded-3xl p-6 bg-slate-50/50 self-start shadow-sm mt-10">
                                    <h3 className="text-base font-bold text-slate-800 mb-4">Upload Image</h3>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setImageUrl(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8 text-center flex flex-col items-center justify-center group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer mb-6"
                                    >
                                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                                            <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-1">Drag & drop or</p>
                                        <button type="button" className="px-5 py-2 bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors mb-4">
                                            Browse
                                        </button>
                                        <p className="text-[10px] text-slate-400">Upload an image for the service (JPG, PNG, up to 2 MB)</p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <label className="text-xs font-bold text-slate-500">Image URL (Fallback feature)</label>
                                        <input
                                            name="image"
                                            type="text"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                                        <img src={imageUrl} alt="Preview" className="w-full h-auto object-cover opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                                            <span className="text-xs font-bold text-white shadow-sm">Preview</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                            <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
                                Cancel
                            </button>
                            <button type="submit" className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-[#3b82f6] hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-200">
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Services;
