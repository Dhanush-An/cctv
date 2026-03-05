import { useNavigate } from 'react-router-dom';
import ProductCatalog from '../components/ProductCatalog';
import ServiceCatalog from '../components/ServiceCatalog';
import ThemeToggle from '../components/shared/ThemeToggle';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
            {/* ── Navbar ── */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center shadow-md">
                            <span className="text-white font-black text-lg">C</span>
                        </div>
                        <span className="font-black text-xl text-slate-800 dark:text-white tracking-tight">CAMERA</span>
                    </div>

                    {/* Nav Links (centered) */}
                    <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                        {[
                            { label: 'Products', href: '#products' },
                            { label: 'Services', href: '#services' },
                        ].map(({ label, href }) => (
                            <a key={label} href={href}
                                className="px-4 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/30">
                                {label}
                            </a>
                        ))}
                    </nav>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
                        <button onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                            Sign In
                        </button>
                        <button onClick={() => navigate('/login')}
                            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none transition-all">
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Products Section ── */}
            <section id="products" className="py-16 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-slate-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <ProductCatalog
                        onBuyNow={() => navigate('/login')}
                        title="Premium CCTV Products"
                        subtitle="Professional security hardware for every need"
                    />
                </div>
            </section>

            {/* ── Services Section ── */}
            <section id="services" className="py-16 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <ServiceCatalog
                        onBookNow={() => navigate('/login')}
                        title="Expert Security Services"
                        subtitle="From installation to maintenance, we handle it all"
                    />
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="bg-[#0F172A] text-slate-400 py-8">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <span className="text-white font-black text-sm">C</span>
                        </div>
                        <span className="font-black text-white">CAMERA</span>
                    </div>
                    <p className="text-sm">© 2025 CCTV Platform. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        {['Privacy', 'Terms', 'Support'].map((l) => (
                            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
