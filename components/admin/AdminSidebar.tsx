import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    DashboardIcon, ProductsIcon, UserIcon, BarChart2Icon, DollarSignIcon,
    ShoppingCartIcon, ListChecksIcon, LayersIcon, CrownIcon, TagIcon, SettingsIcon,
    SlidersIcon, ImageIcon, XIcon
} from '@/constants';

const adminTabs = [
    { name: 'Dashboard', icon: DashboardIcon, path: '#/Admin/Dashboard' },
    { name: 'Analytics', icon: BarChart2Icon, path: '#/Admin/Analytics' },
    { name: 'Income', icon: DollarSignIcon, path: '#/Admin/Income' },
    { name: 'Orders', icon: ShoppingCartIcon, path: '#/Admin/Orders' },
    { name: 'Transactions', icon: ListChecksIcon, path: '#/Admin/Transactions' },
    { name: 'Products', icon: ProductsIcon, path: '#/Admin/Products' },
    { name: 'Categories', icon: LayersIcon, path: '#/Admin/Categories' },
    { name: 'Users', icon: UserIcon, path: '#/Admin/Users' },
    { name: 'Subscriptions', icon: CrownIcon, path: '#/Admin/Subscriptions' },
    { name: 'Coupons', icon: TagIcon, path: '#/Admin/Coupons' },
    { name: 'Banners', icon: ImageIcon, path: '#/Admin/Banners' },
    { name: 'Site Config', icon: SlidersIcon, path: '#/Admin/Site Config' },
    { name: 'Settings', icon: SettingsIcon, path: '#/Admin/Settings' },
];

interface AdminSidebarProps {
    activeTab: string;
    isMobileOpen: boolean;
    onClose: () => void;
}

const PixerLogo = () => (
    <div className="flex items-center space-x-3 text-white">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#A78BFA" />
        </svg>
        <span className="font-extrabold text-2xl">Pixer</span>
    </div>
);


const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, isMobileOpen, onClose }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
        onClose();
    };
  
    const backdropVariants = {
        open: { opacity: 1, pointerEvents: 'auto' as const },
        closed: { opacity: 0, pointerEvents: 'none' as const }
    }

    return (
        <AnimatePresence>
            {isMobileOpen && (
                <motion.div
                    variants={backdropVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-10 lg:hidden"
                />
            )}
            <motion.aside 
                className={`w-64 bg-[#161120]/60 backdrop-blur-lg border-r border-white/10 p-4 flex flex-col fixed top-0 left-0 h-full z-20 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-between items-center px-4 py-2 mb-4">
                    <PixerLogo />
                    <button className="lg:hidden text-neutral-400" onClick={onClose} aria-label="Close sidebar">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <p className="px-4 text-sm text-violet-300 font-semibold">ADMIN MENU</p>
                
                <nav className="mt-4 flex-1 overflow-y-auto">
                    <ul>
                        {adminTabs.map(tab => (
                            <li key={tab.name} className="mb-2">
                                <a 
                                    href={tab.path} 
                                    onClick={(e) => handleNavClick(e, tab.path)} 
                                    className={`relative flex w-full items-center py-3 px-4 rounded-lg transition-colors duration-200 text-left ${activeTab === tab.name ? 'text-white' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {activeTab === tab.name && <motion.div layoutId="admin-active-link-bg" className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg shadow-lg" />}
                                    <span className="relative z-10 flex items-center">
                                        <tab.icon className="w-6 h-6 mr-4" />
                                        <span className="font-medium text-base">{tab.name}</span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="px-2 py-2 mt-auto">
                    <a href="#/Home" onClick={(e) => handleNavClick(e, '#/Home')} className="block text-center w-full py-2.5 bg-violet-600/20 border border-violet-500/50 hover:bg-violet-600/40 text-white font-semibold rounded-lg transition-colors">
                        Back to Site
                    </a>
                </div>
            </motion.aside>
        </AnimatePresence>
    );
};

export default AdminSidebar;