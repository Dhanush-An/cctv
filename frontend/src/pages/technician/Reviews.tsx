import { Star, MessageSquare } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getReviews } from '../../utils/reviewStore';
import type { Review } from '../../utils/reviewStore';
import { useAuth } from '../../context/AuthContext';
import { getEmployees } from '../../utils/employeeStore';

const Reviews = () => {
    const { user: userMobile } = useAuth();
    const [allReviews, setAllReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [techName, setTechName] = useState('Dhanush');

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLoading(true);
                const [reviewsData, employees] = await Promise.all([
                    getReviews(),
                    Promise.resolve(getEmployees())
                ]);

                // Match technician identity
                const currentTech = employees.find(e =>
                    e.mobile === userMobile ||
                    (e.email && e.email.toLowerCase() === (userMobile || '').toLowerCase())
                );

                if (currentTech) {
                    setTechName(currentTech.name);
                } else if (userMobile === '6379068722') {
                    setTechName('Rajesh Kumar');
                }

                setAllReviews(reviewsData);
            } catch (err) {
                console.error("Error loading reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [userMobile]);

    const myReviews = useMemo(() => {
        return allReviews.filter(r =>
            r.status === 'Published' &&
            r.technicianName?.toLowerCase() === techName.toLowerCase()
        );
    }, [allReviews, techName]);

    const stats = useMemo(() => {
        if (myReviews.length === 0) return { avg: 0, total: 0 };
        const sum = myReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
            avg: (sum / myReviews.length).toFixed(1),
            total: myReviews.length
        };
    }, [myReviews]);
    // Generate star displays
    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 md:w-5 md:h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
            />
        ));
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header & Stats summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="relative z-10 h-full flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <MessageSquare className="w-5 h-5 text-indigo-300" />
                            </span>
                            <h1 className="text-2xl font-black tracking-tight">Customer Feedback</h1>
                        </div>
                        <p className="text-indigo-200 font-medium text-sm leading-relaxed max-w-md">
                            Read recent reviews left by clients about your services and installation jobs.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm flex flex-col items-center justify-center text-center border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Overall Rating</p>
                    <div className="flex items-end gap-1 mb-3">
                        <span className="text-5xl font-black text-slate-800 tracking-tighter">{stats.avg}</span>
                        <span className="text-xl font-bold text-slate-300 pb-1">/5</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                        {renderStars(Math.round(Number(stats.avg)))}
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Based on {stats.total} reviews</p>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-lg px-2">Recent Feedback</h3>

                {loading ? (
                    <div className="bg-white rounded-[32px] p-12 text-center text-slate-400 font-bold animate-pulse">Loading Feedback...</div>
                ) : myReviews.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-16 text-center border border-slate-100 italic text-slate-400 font-medium">
                        You don't have any customer reviews yet.
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {myReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full flex items-center justify-center text-indigo-600 font-black text-lg shadow-inner border border-white">
                                            {review.user.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{review.user}</h4>
                                            <p className="text-xs text-slate-400 font-medium">{review.target}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:items-end gap-2 shrink-0">
                                        <div className="flex gap-1">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-50 relative">
                                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <span className="text-xl text-slate-300 leading-none">"</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic relative z-10">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;
