import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HomeIcon, ExploreIcon, CrownIcon, UserIcon, ShoppingCartIcon } from '../constants';
import { useCart } from './CartContext';

interface NavItemProps {
    label: string;
    icon: React.ElementType;
    href: string;
    isActive: boolean;
}

const navItems = [
    { label: 'Home', icon: HomeIcon, href: '#/Home' },
    { label: 'Explore', icon: ExploreIcon, href: '#/Explore' },
    { label: 'Subscriptions', icon: CrownIcon, href: '#/Subscriptions' },
    { label: 'Profile', icon: UserIcon, href: '#/Profile' },
];

const NavItem: React.FC<NavItemProps> = ({ label, icon: Icon, href, isActive }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        e.preventDefault();
        window.location.hash = path;
    };

    return (
        <a 
            href={href}
            onClick={(e) => handleNavClick(e, href)}
            className="relative flex flex-col items-center justify-center w-full h-full text-neutral-500 dark:text-neutral-400 transition-colors duration-200"
        >
            <Icon className={`w-6 h-6 mb-1 transition-all ${isActive ? 'text-violet-500 dark:text-violet-400 -translate-y-1' : ''}`} />
            <span className={`text-xs font-medium transition-opacity ${isActive ? 'opacity-100 text-violet-500 dark:text-violet-400' : 'opacity-0'}`}>
                {label}
            </span>
             {isActive && (
                <motion.div 
                    layoutId="bottom-nav-active" 
                    className="absolute bottom-1 w-1.5 h-1.5 bg-violet-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
            )}
        </a>
    );
};


const BottomNavBar: React.FC<{ activeLink: string }> = ({ activeLink }) => {
    const { cart, toggleCart } = useCart();
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <footer className="fixed bottom-0 left-0 right-0 h-20 px-4 pb-4 z-30 lg:hidden">
            <div className="relative h-full w-full bg-white/70 dark:bg-[#161120]/70 backdrop-blur-xl rounded-2xl border border-gray-200/30 dark:border-white/10 shadow-2xl shadow-black/10 flex items-center justify-around">
                {navItems.map(item => (
                    <NavItem key={item.label} {...item} isActive={activeLink === item.label} />
                ))}
            </div>
            {/* Floating Cart Button */}
            <motion.button 
                onClick={toggleCart}
                className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ShoppingCartIcon className="w-7 h-7" />
                 <AnimatePresence>
                {itemCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-[#161120]"
                    >
                        {itemCount}
                    </motion.span>
                )}
                </AnimatePresence>
            </motion.button>
        </footer>
    );
};

export default BottomNavBar;