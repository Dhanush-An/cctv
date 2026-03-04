import {
    Star,
    CheckCircle2,
    XCircle,
    Flag,
    Package,
    Wrench
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getReviews, updateReviewStatus } from '../../utils/reviewStore';
import type { Review } from '../../utils/reviewStore';

const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        getReviews().then(setReviews);
    }, []);

    const updateStatus = async (id: string, newStatus: Review['status']) => {
        const updated = await updateReviewStatus(id, newStatus);
        setReviews(updated);
    };

    const getStatusColor = (status: Review['status']) => {
        switch (status) {
            case 'Published': return 'bg-emerald-50 text-emerald-600';
            case 'Pending': return 'bg-amber-50 text-amber-600 border border-amber-100';
            case 'Flagged': return 'bg-rose-50 text-rose-600 border border-rose-100';
            case 'Rejected': return 'bg-slate-50 text-slate-500 border border-slate-100';
            default: return 'bg-slate-50 text-slate-500 border border-slate-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Review Moderation</h1>
                    <p className="text-sm text-slate-500 italic">Monitor and moderate customer feedback for products and services.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button className="px-4 py-2 text-xs font-bold bg-white text-slate-800 rounded-lg shadow-sm">All Feed</button>
                    <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">Pending</button>
                    <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800">Flagged</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card text-center py-8">
                    <div className="flex justify-center mb-2 italic">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <h2 className="text-3xl font-black text-slate-800">4.8</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Average Rating</p>
                </div>
                <div className="card text-center py-8">
                    <h2 className="text-3xl font-black text-slate-800">1.2k</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Reviews</p>
                </div>
                <div className="card text-center py-8">
                    <h2 className="text-3xl font-black text-indigo-600">12</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Pending Approval</p>
                </div>
                <div className="card text-center py-8">
                    <h2 className="text-3xl font-black text-rose-500">03</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Reported Feed</p>
                </div>
            </div>

            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="card group hover:border-indigo-200 transition-all border border-slate-100">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 italic font-bold shrink-0">
                                    {review.user.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-800">{review.user}</h3>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(review.status)}`}>
                                            {review.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 italic">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{review.date}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mt-3 leading-relaxed italic">"{review.comment}"</p>

                                    <div className="flex items-center gap-4 mt-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-100 w-fit">
                                            {review.type === 'Product' ? <Package className="w-3.5 h-3.5 text-indigo-500" /> : <Wrench className="w-3.5 h-3.5 text-sky-500" />}
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">{review.target}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex md:flex-col gap-2 pt-2">
                                {review.status !== 'Published' && (
                                    <button
                                        onClick={() => updateStatus(review.id, 'Published')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Approve
                                    </button>
                                )}
                                {review.status !== 'Flagged' && review.status !== 'Rejected' && (
                                    <button
                                        onClick={() => updateStatus(review.id, 'Flagged')}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-amber-100 transition-all border border-amber-100"
                                    >
                                        <Flag className="w-4 h-4" />
                                        Flag
                                    </button>
                                )}
                                <button
                                    onClick={() => updateStatus(review.id, 'Rejected')}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
