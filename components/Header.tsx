


import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { useSearch } from './SearchContext';
import { UserIcon, SunIcon, MenuIcon, ShoppingCartIcon } from '../constants';


const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const Magnetic: React.FC<{children: React.ReactNode, onClick?: () => void, 'aria-label'?: string}> = ({children, onClick, ...props}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * width * 0.5);
        y.set(yPct * height * 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
            {...props}
        >
            {children}
        </motion.button>
    );
}

interface HeaderProps {
    theme: string;
    toggleTheme: () => void;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onToggleSidebar }) => {
  const { cart, toggleCart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };
  
  useEffect(() => {
    if (isSearchOpen) {
        searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if(query && !window.location.hash.startsWith('#/Home')) {
        window.location.hash = '#/Home';
    }
  }
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <header className="flex justify-between items-center mb-6 h-10">
       <div className="flex items-center">
         <button className="lg:hidden text-neutral-500 dark:text-neutral-400 mr-4" onClick={onToggleSidebar} aria-label="Open sidebar">
            <MenuIcon />
         </button>
       </div>
       <div className="flex-1 flex justify-end">
            <AnimatePresence>
            {isSearchOpen ? (
                <motion.div
                    key="search-input"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center w-full"
                >
                    <SearchIcon />
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for products..."
                        className="w-full bg-transparent text-gray-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 ml-4 focus:outline-none text-lg"
                    />
                    <motion.button onClick={handleCloseSearch} className="text-neutral-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white ml-4" aria-label="Close search">
                        <CloseIcon />
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div
                    key="header-icons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex justify-end items-center space-x-4 sm:space-x-6 text-neutral-500 dark:text-neutral-400"
                >
                    <Magnetic onClick={handleOpenSearch} aria-label="Open Search"><SearchIcon /></Magnetic>
                    
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <Magnetic onClick={toggleTheme} aria-label="Toggle Theme">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={theme}
                                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                                </motion.div>
                            </AnimatePresence>
                        </Magnetic>
                        <Magnetic onClick={toggleCart} aria-label="Open Cart">
                            <div className="relative">
                                <ShoppingCartIcon className="w-6 h-6" />
                                <AnimatePresence>
                                {itemCount > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0, y: 5 }}
                                        animate={{ scale: 1, y: 0 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                                        className="absolute -top-2 -right-2 bg-violet-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-[#161120]"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                                </AnimatePresence>
                            </div>
                        </Magnetic>
                        <a href="#/Profile" onClick={(e) => handleNavClick(e, '#/Profile')} aria-label="View Profile" className="hover:text-gray-900 dark:hover:text-white transition-colors lg:flex hidden">
                            <Magnetic><UserIcon /></Magnetic>
                        </a>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    </header>
  );
};

export default Header;