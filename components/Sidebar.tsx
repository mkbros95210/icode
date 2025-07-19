import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import type { NavLink, SiteConfig } from '../types';
import { useUser } from './UserContext';
import { ShieldIcon, XIcon } from '../constants';

const ScrambleText: React.FC<{text: string}> = ({ text }) => {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<number | null>(null);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        setDisplayText(text); // Update display text when the prop changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [text]);

    const scramble = () => {
        let iteration = 0;
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = window.setInterval(() => {
            setDisplayText(prev => prev.split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join(""));

            if (iteration >= text.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
            iteration += 1 / 3;
        }, 30);
    };
    
    const stopScramble = () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
    }

    return (
        <span onMouseEnter={scramble} onMouseLeave={stopScramble} className="font-extrabold text-2xl text-gray-900 dark:text-white transition-colors duration-300">
            {displayText}
        </span>
    );
};


const PixerLogo: React.FC<{siteName?: string, logoUrl?: string | null}> = ({ siteName = 'Pixer', logoUrl }) => (
  <div className="flex items-center space-x-3">
    {logoUrl ? (
      <img src={logoUrl} alt={`${siteName} Logo`} className="h-7 w-auto"/>
    ) : (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#A78BFA"/>
      </svg>
    )}
    <ScrambleText text={siteName} />
  </div>
);

const Magnetic: React.FC<{children: React.ReactNode}> = ({children}) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct * width * 0.4);
        y.set(yPct * height * 0.4);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative"
        >
            {children}
        </motion.div>
    );
}

interface SidebarProps {
  activeLink: string;
  links: NavLink[];
  settingsLinks: NavLink[];
  siteConfig: SiteConfig | null;
  isMobileOpen: boolean;
  onClose: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({ activeLink, links, settingsLinks, siteConfig, isMobileOpen, onClose }) => {
  const { isAdmin } = useUser();
  
  const visibleLinks = links.filter(link => siteConfig?.visible_links?.[link.label] ?? true);
  
  const allLinks = isAdmin ? [...visibleLinks, { label: 'Admin', icon: ShieldIcon }] : visibleLinks;

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
            className={`w-64 bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border-r border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-300 flex flex-col p-4 fixed h-full z-20 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex justify-between items-center px-4 py-2 mb-6">
                <PixerLogo siteName={siteConfig?.site_name} logoUrl={siteConfig?.logo_url}/>
                 <button className="lg:hidden text-neutral-400" onClick={onClose} aria-label="Close sidebar">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1">
                <ul>
                {allLinks.map(({ label, icon: Icon }) => (
                    <li key={label} className="mb-2">
                    <Magnetic>
                            <a
                                href={`#/${label}`}
                                onClick={(e) => handleNavClick(e, `#/${label}`)}
                                className={`relative flex w-full items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
                                activeLink !== label ? 'hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white' : ''
                                }`}
                            >
                                {activeLink === label && (
                                    <motion.div
                                        layoutId="active-link-bg"
                                        className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg shadow-lg"
                                        style={{ borderRadius: 8 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center">
                                <Icon className={`w-6 h-6 mr-4 ${activeLink === label ? 'text-white' : ''}`} />
                                <span className={`font-medium text-base ${activeLink === label ? 'text-white font-semibold' : ''}`}>{label}</span>
                                </span>
                            </a>
                    </Magnetic>
                    </li>
                ))}
                </ul>
            </nav>

            <div>
                <hr className="border-t border-black/10 dark:border-white/10 my-4" />
                <ul>
                    {settingsLinks.map(({ label, icon: Icon }) => (
                        <li key={label} className="mb-2">
                            <Magnetic>
                                <a 
                                    href={`#/${label}`}
                                    onClick={(e) => handleNavClick(e, `#/${label}`)}
                                    className={`relative flex w-full items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
                                        activeLink !== label ? 'hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white' : ''
                                    }`}
                                >
                                    {activeLink === label && (
                                        <motion.div
                                            layoutId="active-link-bg"
                                            className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg shadow-lg"
                                            style={{ borderRadius: 8 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10 flex items-center">
                                        <Icon className={`w-6 h-6 mr-4 ${activeLink === label ? 'text-white' : ''}`} />
                                        <span className={`font-medium text-base ${activeLink === label ? 'text-white font-semibold' : ''}`}>{label}</span>
                                    </span>
                                </a>
                            </Magnetic>
                        </li>
                    ))}
                </ul>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-6 px-4">
                    <div className="flex space-x-4 mb-2">
                        <a href="#/Terms" onClick={(e) => handleNavClick(e, '#/Terms')} className="hover:text-neutral-800 dark:hover:text-neutral-200">Terms</a>
                        <a href="#/Privacy" onClick={(e) => handleNavClick(e, '#/Privacy')} className="hover:text-neutral-800 dark:hover:text-neutral-200">Privacy</a>
                        <a href="#/Help" onClick={(e) => handleNavClick(e, '#/Help')} className="hover:text-neutral-800 dark:hover:text-neutral-200">Help</a>
                    </div>
                    <p>&copy;2025 {siteConfig?.site_name || 'Pixer'}. Copyright REDQ. All rights reserved worldwide. REDQ</p>
                </div>
            </div>
        </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;