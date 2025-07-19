import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Coupon } from '../../types';
import { supabase } from '../../lib/supabase';

interface CouponsPageProps {
    coupons: Coupon[];
    fetchAdminData: () => void;
}

const CouponsPage: React.FC<CouponsPageProps> = ({ coupons, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

    const openCouponModal = (coupon: Partial<Coupon> | null) => {
        setEditingCoupon(coupon ? {...coupon} : { code: '', type: 'percentage', value: 10, expires_at: '', active: true });
        setIsModalOpen(true);
    };

    const handleSaveCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCoupon) return;
        // Mock save, as coupons table doesn't exist yet
        console.log('Saving coupon:', editingCoupon);
        alert('Coupon functionality is mocked. Check console for data.');
        setIsModalOpen(false);
        setEditingCoupon(null);
        // In a real app, you would call fetchAdminData() here after a successful save.
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Coupons</h1>
                <button onClick={() => openCouponModal(null)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    New Coupon
                </button>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Value</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Expires</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-violet-300">{coupon.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{coupon.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value.toFixed(2)}`}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{new Date(coupon.expires_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {coupon.active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openCouponModal(coupon)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && editingCoupon && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-lg text-neutral-300">
                           <form onSubmit={handleSaveCoupon}>
                                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">{editingCoupon.id ? 'Edit Coupon' : 'New Coupon'}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                                </header>
                                <div className="p-6 space-y-4">
                                    <input required value={editingCoupon.code} onChange={e => setEditingCoupon({...editingCoupon, code: e.target.value})} placeholder="Coupon Code" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <select value={editingCoupon.type} onChange={e => setEditingCoupon({...editingCoupon, type: e.target.value as any})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                    <input required type="number" value={editingCoupon.value} onChange={e => setEditingCoupon({...editingCoupon, value: Number(e.target.value)})} placeholder="Value" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <input required type="date" value={editingCoupon.expires_at} onChange={e => setEditingCoupon({...editingCoupon, expires_at: e.target.value})} placeholder="Expiry Date" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <div className="flex items-center">
                                        <input type="checkbox" id="coupon-active" checked={editingCoupon.active} onChange={e => setEditingCoupon({...editingCoupon, active: e.target.checked})} className="h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"/>
                                        <label htmlFor="coupon-active" className="ml-2 block text-sm text-neutral-300">Active</label>
                                    </div>
                                </div>
                                <footer className="p-4 bg-black/20 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save Coupon</button>
                                </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CouponsPage;