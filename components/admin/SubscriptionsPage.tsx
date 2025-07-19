import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, SubscriptionPlanDetails } from '../../types';
import { supabase, type Database } from '../../lib/supabase';

type PlanInsert = Database['public']['Tables']['subscription_plans']['Insert'];
type PlanUpdate = Database['public']['Tables']['subscription_plans']['Update'];

interface SubscriptionsPageProps {
    users: User[];
    plans: SubscriptionPlanDetails[];
    fetchAdminData: () => void;
}

type PlanFormState = Omit<Partial<SubscriptionPlanDetails>, 'features'> & { features?: string };

const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({ users, plans, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PlanFormState | null>(null);

    const subscribedUsers = useMemo(() => {
        return users.filter(u => u.subscription_plan && u.subscription_plan !== 'none');
    }, [users]);

    const openPlanModal = (plan: Partial<SubscriptionPlanDetails> | null) => {
        if (plan) {
            setEditingPlan({...plan, features: Array.isArray(plan.features) ? plan.features.join('\n') : '' });
        } else {
            setEditingPlan({ name: '', price: 0, description: '', features: '', popular: false });
        }
        setIsModalOpen(true);
    };

    const handleSavePlan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlan) return;

        if (!editingPlan.name || editingPlan.price == null || !editingPlan.description) {
            alert('Name, price, and description are required.');
            return;
        }
        
        const planToSave = {
            name: editingPlan.name,
            price: editingPlan.price,
            description: editingPlan.description,
            popular: editingPlan.popular ?? false,
            features: editingPlan.features ? editingPlan.features.split('\n').filter((f:string) => f.trim() !== '') : []
        };
        
        const { error } = editingPlan.id
            ? await supabase.from('subscription_plans').update(planToSave).eq('id', editingPlan.id)
            : await supabase.from('subscription_plans').insert([planToSave]);
        
        if (error) {
            alert('Error saving plan: ' + error.message);
        } else {
            fetchAdminData();
            setIsModalOpen(false);
            setEditingPlan(null);
        }
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Subscriptions</h1>
                <button onClick={() => openPlanModal(null)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    Create New Plan
                </button>
            </div>
            
            <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                 className="mb-8"
            >
                <h2 className="text-2xl font-semibold text-white mb-4">Subscription Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
                            <h3 className="text-xl font-bold text-violet-400">{plan.name}</h3>
                            <p className="text-3xl font-extrabold text-white my-2">₹{plan.price}<span className="text-base font-normal text-neutral-400">/mo</span></p>
                            <p className="text-sm text-neutral-400 mb-4 h-12">{plan.description}</p>
                            <button onClick={() => openPlanModal(plan)} className="mt-auto w-full py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white font-semibold transition-colors">Edit Plan</button>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            >
                <h2 className="text-2xl font-semibold text-white mb-4">Subscribed Users ({subscribedUsers.length})</h2>
                 <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-black/20">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Member Since</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {subscribedUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-black/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center">
                                        <img className="w-8 h-8 rounded-full mr-3" src={u.avatar_url || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${u.id}`} alt="" />
                                        <div>
                                            <div>{u.full_name || 'N/A'}</div>
                                            <div className="text-xs text-neutral-500">{u.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{u.subscription_plan}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{u.memberSince ? new Date(u.memberSince).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && editingPlan && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-lg text-neutral-300">
                           <form onSubmit={handleSavePlan}>
                                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">{editingPlan.id ? 'Edit Plan' : 'New Plan'}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                                </header>
                                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                    <input required value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} placeholder="Plan Name" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <input required type="number" step="0.01" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: Number(e.target.value)})} placeholder="Price" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <textarea required value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} placeholder="Description" rows={2} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <textarea value={editingPlan.features} onChange={e => setEditingPlan({...editingPlan, features: e.target.value})} placeholder="Features (one per line)" rows={5} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <div className="flex items-center">
                                        <input type="checkbox" id="plan-popular" checked={!!editingPlan.popular} onChange={e => setEditingPlan({...editingPlan, popular: e.target.checked})} className="h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"/>
                                        <label htmlFor="plan-popular" className="ml-2 block text-sm text-neutral-300">Mark as Popular</label>
                                    </div>
                                </div>
                                <footer className="p-4 bg-black/20 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save Plan</button>
                                </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionsPage;