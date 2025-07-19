import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Category, User } from '../../types';
import { supabase, type Database } from '../../lib/supabase';
import { useUser } from '../UserContext';

type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];


interface ProductsPageProps {
    products: Product[];
    categories: Category[];
    users: User[];
    fetchAdminData: () => void;
}

// A type for the form state to handle details as a string
type ProductFormState = Omit<Partial<Product>, 'details'> & {
    details: string;
};


const ProductsPage: React.FC<ProductsPageProps> = ({ products, categories, users, fetchAdminData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductFormState | null>(null);
    const { user: loggedInUser } = useUser();

    const openProductModal = (product: Product | null) => {
        if (product) {
            setEditingProduct({
                ...product,
                details: Array.isArray(product.details) ? product.details.join('\n') : '',
            });
        } else {
            setEditingProduct({ 
                title: '', 
                price: 0, 
                description: '', 
                image: '', 
                details: '', 
                isNew: true,
                category_id: categories.find(c => c.id !== 0)?.id,
                author_id: loggedInUser?.id,
                preview_url: '',
                video_url: '',
                gift_url: '',
                download_url: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm(`Are you sure you want to delete product #${productId}? This action cannot be undone.`)) return;
        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) {
            alert('Error deleting product: ' + error.message);
        } else {
            fetchAdminData();
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        if (!editingProduct.author_id || !editingProduct.category_id || !editingProduct.title) {
            alert('Author, Category, and Title are required.');
            return;
        }

        const productToSave = {
            title: editingProduct.title,
            price: editingProduct.price || 0,
            description: editingProduct.description || '',
            image: editingProduct.image || '',
            details: typeof editingProduct.details === 'string' 
                ? editingProduct.details.split('\n').filter(line => line.trim() !== '') 
                : [],
            author_id: editingProduct.author_id,
            category_id: editingProduct.category_id,
            is_new: editingProduct.isNew ?? true,
            old_price: editingProduct.oldPrice ?? null,
            preview_url: editingProduct.preview_url || null,
            video_url: editingProduct.video_url || null,
            gift_url: editingProduct.gift_url || null,
            download_url: editingProduct.download_url || null,
        };
        
        const { error } = editingProduct.id
            ? await supabase.from('products').update(productToSave).eq('id', editingProduct.id)
            : await supabase.from('products').insert([productToSave]);
        
        if (error) {
            alert('Error saving product: ' + error.message);
        } else {
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchAdminData();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Products</h1>
                <button onClick={() => openProductModal(null)} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-lg shadow-md hover:bg-violet-700 transition-colors">
                    New Product
                </button>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Price</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{p.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{p.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{p.author}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">₹{p.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => openProductModal(p)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-300">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

             <AnimatePresence>
                {isModalOpen && editingProduct && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#1C1629]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl w-full max-w-2xl text-neutral-300">
                           <form onSubmit={handleSaveProduct}>
                                <header className="p-4 border-b border-white/10 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-white">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white text-3xl">&times;</button>
                                </header>
                                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="product-title" className="block text-sm font-medium mb-1 text-neutral-400">Title</label>
                                            <input id="product-title" required value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} placeholder="e.g., Shoppy E-commerce UI Kit" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label htmlFor="product-price" className="block text-sm font-medium mb-1 text-neutral-400">Price (₹)</label>
                                            <input id="product-price" required type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} placeholder="e.g., 39.00" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="product-description" className="block text-sm font-medium mb-1 text-neutral-400">Description</label>
                                        <textarea id="product-description" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} placeholder="A short summary of the product." rows={3} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div>
                                            <label htmlFor="category-select" className="block text-sm font-medium mb-1 text-neutral-400">Category</label>
                                            <select id="category-select" required value={editingProduct.category_id} onChange={e => setEditingProduct({...editingProduct, category_id: Number(e.target.value)})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                                {categories.filter(c => c.id !== 0).map(cat => (<option key={cat.id} value={cat.id}>{cat.label}</option>))}
                                            </select>
                                        </div>
                                         <div>
                                            <label htmlFor="author-select" className="block text-sm font-medium mb-1 text-neutral-400">Author</label>
                                            <select id="author-select" required value={editingProduct.author_id} onChange={e => setEditingProduct({...editingProduct, author_id: e.target.value})} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none">
                                                {users.map(u => (<option key={u.id} value={u.id}>{u.full_name || u.email}</option>))}
                                            </select>
                                        </div>
                                    </div>
                                    <hr className="border-white/10" />
                                    <h4 className="text-lg font-semibold text-violet-300 -mb-2">Links & Media</h4>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="image-url" className="block text-sm font-medium mb-1 text-neutral-400">Image URL</label>
                                            <input id="image-url" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} placeholder="https://..." className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label htmlFor="video-url" className="block text-sm font-medium mb-1 text-neutral-400">Video URL (YouTube)</label>
                                            <input id="video-url" value={editingProduct.video_url || ''} onChange={e => setEditingProduct({...editingProduct, video_url: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label htmlFor="preview-url" className="block text-sm font-medium mb-1 text-neutral-400">Live Preview URL</label>
                                            <input id="preview-url" value={editingProduct.preview_url || ''} onChange={e => setEditingProduct({...editingProduct, preview_url: e.target.value})} placeholder="https://your-demo-site.com" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                        <div>
                                            <label htmlFor="download-url" className="block text-sm font-medium mb-1 text-neutral-400">Product Download URL</label>
                                            <input id="download-url" value={editingProduct.download_url || ''} onChange={e => setEditingProduct({...editingProduct, download_url: e.target.value})} placeholder="https://link-to-your/product.zip" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                        </div>
                                     </div>
                                     <div>
                                        <label htmlFor="gift-url" className="block text-sm font-medium mb-1 text-neutral-400">Surprise Gift URL (Optional)</label>
                                        <input id="gift-url" value={editingProduct.gift_url || ''} onChange={e => setEditingProduct({...editingProduct, gift_url: e.target.value})} placeholder="https://link-to-your/bonus-item.zip" className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                     </div>

                                     <hr className="border-white/10" />

                                     <div>
                                        <label htmlFor="details-area" className="block text-sm font-medium mb-1 text-neutral-400">Product Features (one item per line)</label>
                                        <textarea id="details-area" value={editingProduct.details} onChange={e => setEditingProduct({...editingProduct, details: e.target.value})} placeholder="e.g., High-resolution files&#10;Fully customizable layers" rows={4} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                     </div>
                                </div>
                                <footer className="p-4 bg-black/20 flex justify-end">
                                    <button type="submit" className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg hover:bg-violet-700 transition-colors">Save Product</button>
                                </footer>
                           </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductsPage;