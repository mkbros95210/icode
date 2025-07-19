import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User, SubscriptionPlan } from '../../types';
import { supabase, type Database } from '../../lib/supabase';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface UsersPageProps {
    users: User[];
    fetchAdminData: () => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filter, setFilter] = useState<SubscriptionPlan | 'all'>('all');

    const openUserModal = (user: User) => {
        setEditingUser({...user});
        setIsModalOpen(true);
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        const userToSave: ProfileUpdate = {
            role: editingUser.role,
            subscription_plan: editingUser.subscription_plan,
        };
        const { error } = await supabase.from('profiles').update(userToSave).eq('id', editingUser.id);
        
        if (error) {
            alert('Error saving user: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingUser(null);
            fetchAdminData();
        }
    };
    
    const filteredUsers = useMemo(() => {
        if (filter === 'all') return users;
        return users.filter(u => u.subscription_plan === filter);
    }, [users, filter]);

    const filterOptions: {label: string, value: SubscriptionPlan | 'all'}[] = [
        { label: 'All', value: 'all' },
        { label: 'None', value: 'none' },
        { label: 'Standard', value: 'standard' },
        { label: 'Premium', value: 'premium' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Users</h1>
                 <div className="flex items-center bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-lg p-1">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`relative px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === opt.value ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                            {filter === opt.value && <motion.div layoutId="user-filter-active" className="absolute inset-0 bg-violet-600/50 rounded-md" />}
                            <span className="relative z-10">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Subscription</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white flex items-center">
                                    <img className="w-8 h-8 rounded-full mr-3" src={u.avatar_url || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${u.id}`} alt="" />
                                    <div>
                                        <div>{u.full_name || 'N/A'}</div>
                                        <div className="text-xs text-neutral-500">{u.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{u.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300 capitalize">{u.subscription_plan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openUserModal(u)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <AnimatePresence>
                {isModalOpen && editingUser && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-lg text-neutral-300">
                           <form onSubmit={handleSaveUser}>
                            <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Edit User</h3>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                            </header>
                            <div className="p-6 space-y-4">
                                <p>Editing user: <strong>{editingUser.full_name || editingUser.email}</strong></p>
                                <div>
                                    <label htmlFor="role-select" className="block text-sm font-medium mb-1">Role</label>
                                    <select id="role-select" value={editingUser.role || 'user'} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="sub-select" className="block text-sm font-medium mb-1">Subscription</label>
                                    <select id="sub-select" value={editingUser.subscription_plan} onChange={e => setEditingUser({...editingUser, subscription_plan: e.target.value as any})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                        <option value="none">None</option>
                                        <option value="standard">Standard</option>
                                        <option value="premium">Premium</option>
                                    </select>
                                </div>
                            </div>
                             <footer className="p-4 bg-black/20 flex justify-end">
                                <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save User</button>
                             </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersPage;