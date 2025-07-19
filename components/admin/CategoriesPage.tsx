import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Category } from '../../types';
import { supabase, type Database } from '../../lib/supabase';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

interface CategoriesPageProps {
    categories: Category[];
    fetchAdminData: () => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({ categories, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

    const openCategoryModal = (category: Partial<Category> | null) => {
        setEditingCategory(category ? {...category} : { label: '', parent_id: null });
        setIsModalOpen(true);
    };

    const handleDeleteCategory = async (categoryId: number) => {
        if (!window.confirm(`Are you sure you want to delete category #${categoryId}? This action cannot be undone.`)) return;
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);
        if (error) {
            alert('Error deleting category: ' + error.message);
        } else {
            fetchAdminData();
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory || !editingCategory.label) {
            alert('Category label is required.');
            return;
        };
        
        const { id, ...data } = editingCategory;

        const categoryToSave = {
            ...data,
            parent_id: data.parent_id === 0 ? null : data.parent_id,
        };

        const { error } = id
            ? await supabase.from('categories').update(categoryToSave).eq('id', id)
            : await supabase.from('categories').insert([categoryToSave]);
        
        if (error) {
            alert('Error saving category: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingCategory(null);
            fetchAdminData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Categories</h1>
                <button onClick={() => openCategoryModal(null)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    New Category
                </button>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Label</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Parent Category</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {categories.filter(c => c.id !== 0).map((cat) => (
                            <tr key={cat.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{cat.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{cat.label}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{cat.parent_id ? categories.find(p => p.id === cat.parent_id)?.label : 'None'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openCategoryModal(cat)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && editingCategory && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-lg text-neutral-300">
                           <form onSubmit={handleSaveCategory}>
                                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">{editingCategory.id ? 'Edit Category' : 'New Category'}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                                </header>
                                <div className="p-6 space-y-4">
                                    <input required value={editingCategory.label} onChange={e => setEditingCategory({...editingCategory, label: e.target.value})} placeholder="Category Label" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    <div>
                                        <label htmlFor="parent-cat" className="block text-sm font-medium mb-1">Parent Category</label>
                                        <select id="parent-cat" value={editingCategory.parent_id || 0} onChange={e => setEditingCategory({...editingCategory, parent_id: Number(e.target.value)})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                            <option value={0}>None</option>
                                            {categories.filter(c => c.id !== 0 && c.id !== editingCategory.id).map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <footer className="p-4 bg-black/20 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save Category</button>
                                </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoriesPage;