import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Banner } from '../../types';
import { supabase, type Database } from '../../lib/supabase';
import { ALL_PAGE_NAMES } from '../../constants';

type BannerInsert = Database['public']['Tables']['banners']['Insert'];
type BannerUpdate = Database['public']['Tables']['banners']['Update'];

interface BannersPageProps {
    banners: Banner[];
    fetchAdminData: () => void;
}

const BannersPage: React.FC<BannersPageProps> = ({ banners, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

    const openBannerModal = (banner: Partial<Banner> | null) => {
        setEditingBanner(banner ? { ...banner } : {
            name: '',
            is_active: true,
            is_default: false,
            image_url: '',
            redirect_url: '',
            display_pages: [],
            excluded_pages: [],
            position: 'top-of-page',
            height_desktop: '200px',
            height_tablet: '150px',
            height_mobile: '100px',
            border_radius: '1rem',
            opacity: 1,
            animation_type: 'fade-in',
        });
        setIsModalOpen(true);
    };

    const handleDeleteBanner = async (bannerId: number) => {
        if (!window.confirm(`Are you sure you want to delete banner #${bannerId}?`)) return;
        const { error } = await supabase.from('banners').delete().eq('id', bannerId);
        if (error) {
            alert('Error deleting banner: ' + error.message);
        } else {
            fetchAdminData();
        }
    };

    const handleSaveBanner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingBanner) return;

        if (!editingBanner.name || !editingBanner.image_url) {
            alert('Name and Image URL are required.');
            return;
        }

        const { id, created_at, ...dataToSave } = editingBanner;

        const { error } = id
            ? await supabase.from('banners').update(dataToSave).eq('id', id)
            : await supabase.from('banners').insert([dataToSave]);
        
        if (error) {
            alert('Error saving banner: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingBanner(null);
            fetchAdminData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Banners</h1>
                <button onClick={() => openBannerModal(null)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    New Banner
                </button>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {banners.map((b) => (
                            <tr key={b.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{b.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{b.is_default ? 'Default' : 'Page-Specific'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${b.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                        {b.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openBannerModal(b)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                    <button onClick={() => handleDeleteBanner(b.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && editingBanner && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-3xl text-neutral-300">
                           <form onSubmit={handleSaveBanner}>
                                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">{editingBanner.id ? 'Edit Banner' : 'New Banner'}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                                </header>
                                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required value={editingBanner.name} onChange={e => setEditingBanner({...editingBanner, name: e.target.value})} placeholder="Internal Banner Name" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        <div className="flex items-center gap-x-6">
                                            <div className="flex items-center"><input type="checkbox" id="b-active" checked={!!editingBanner.is_active} onChange={e => setEditingBanner({...editingBanner, is_active: e.target.checked})} className="h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"/><label htmlFor="b-active" className="ml-2">Active</label></div>
                                            <div className="flex items-center"><input type="checkbox" id="b-default" checked={!!editingBanner.is_default} onChange={e => setEditingBanner({...editingBanner, is_default: e.target.checked})} className="h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"/><label htmlFor="b-default" className="ml-2">Is Default Banner?</label></div>
                                        </div>
                                    </div>
                                    {/* URLs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required value={editingBanner.image_url} onChange={e => setEditingBanner({...editingBanner, image_url: e.target.value})} placeholder="Image URL" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        <input value={editingBanner.redirect_url || ''} onChange={e => setEditingBanner({...editingBanner, redirect_url: e.target.value})} placeholder="Redirect URL (on click)" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    </div>
                                    <hr className="border-white/10" />
                                    {/* Display Logic */}
                                    <h4 className="text-lg font-semibold text-violet-300 -mb-2">Display Rules</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-neutral-400">{editingBanner.is_default ? 'Exclude on Pages' : 'Display on Pages'}</label>
                                            <div className="max-h-40 overflow-y-auto bg-[#161120] p-3 rounded-lg border border-white/20 space-y-2">
                                                {ALL_PAGE_NAMES.map(pageName => {
                                                    const pageList = editingBanner.is_default ? editingBanner.excluded_pages : editingBanner.display_pages;
                                                    const isChecked = pageList?.includes(pageName);
                                                    return (<div key={pageName} className="flex items-center">
                                                        <input type="checkbox" id={`page-${pageName}`} checked={isChecked} onChange={e => {
                                                            const currentList = pageList || [];
                                                            const newList = e.target.checked ? [...currentList, pageName] : currentList.filter(p => p !== pageName);
                                                            const key = editingBanner.is_default ? 'excluded_pages' : 'display_pages';
                                                            setEditingBanner({...editingBanner, [key]: newList});
                                                        }} className="h-4 w-4 text-violet-600 bg-gray-700 border-gray-600 rounded focus:ring-violet-500"/>
                                                        <label htmlFor={`page-${pageName}`} className="ml-2 text-sm">{pageName}</label>
                                                    </div>)
                                                })}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Position</label>
                                            <select value={editingBanner.position} onChange={e => setEditingBanner({...editingBanner, position: e.target.value as any})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                                <option value="top-of-page">Top of Page</option>
                                                <option value="bottom-of-page" disabled>Bottom of Page (soon)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr className="border-white/10" />
                                    {/* Styling */}
                                    <h4 className="text-lg font-semibold text-violet-300 -mb-2">Styling & Animation</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Height (Desktop)</label>
                                            <input value={editingBanner.height_desktop ?? ''} onChange={e => setEditingBanner({...editingBanner, height_desktop: e.target.value})} placeholder="e.g. 200px" className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Height (Tablet)</label>
                                            <input value={editingBanner.height_tablet ?? ''} onChange={e => setEditingBanner({...editingBanner, height_tablet: e.target.value})} placeholder="e.g. 150px" className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Height (Mobile)</label>
                                            <input value={editingBanner.height_mobile ?? ''} onChange={e => setEditingBanner({...editingBanner, height_mobile: e.target.value})} placeholder="e.g. 100px" className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Animation</label>
                                            <select value={editingBanner.animation_type} onChange={e => setEditingBanner({...editingBanner, animation_type: e.target.value as any})} className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                                <option value="none">None</option>
                                                <option value="fade-in">Fade In</option>
                                                <option value="slide-in-top">Slide In (Top)</option>
                                                <option value="pulse">Pulse</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Border Radius</label>
                                            <input value={editingBanner.border_radius ?? ''} onChange={e => setEditingBanner({...editingBanner, border_radius: e.target.value})} placeholder="e.g. 1rem" className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-neutral-400">Opacity (0-1)</label>
                                            <input type="number" step="0.1" min="0" max="1" value={editingBanner.opacity} onChange={e => setEditingBanner({...editingBanner, opacity: Number(e.target.value)})} className="w-full bg-[#161120] p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                    </div>
                                </div>
                                <footer className="p-4 bg-black/20 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save Banner</button>
                                </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BannersPage;