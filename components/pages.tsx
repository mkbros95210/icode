

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue, animate, useInView } from 'framer-motion';
import Header from './Header';
import { FeedIcon, ProductsIcon, AuthorsIcon, CrownIcon, GiftIcon } from '../constants';
import { MOCK_ORDERS, MOCK_FEED_ITEMS, SUBSCRIPTION_PLANS, MOCK_GIFTS } from './mock-data';
import ProductCard from './ProductCard';
import Auth from './Auth';
import type { Order, FeedItem, AcquiredProduct, Gift, SubscriptionPlan, Product, Banner } from '../types';
import { useUser } from './UserContext';
import BannerDisplay, { getBannerForPage } from './BannerDisplay';


export interface PageProps {
    theme: string;
    toggleTheme: () => void;
    onToggleSidebar: () => void;
    products?: Product[];
    banners: Banner[];
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
} as const;


const PageHeader: React.FC<{title: string; description: string}> = ({ title, description }) => (
    <motion.div 
        className="mb-12 bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
    >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 transition-colors duration-300">{title}</h1>
        <p className="text-base sm:text-lg text-gray-500 dark:text-neutral-400 transition-colors duration-300">{description}</p>
    </motion.div>
);

const PageWrapper: React.FC<{children: React.ReactNode, pageName: string, title?: string, description?: string, pageProps: PageProps}> = ({ children, pageName, title, description, pageProps }) => {
    const pageBanner = getBannerForPage(pageName, pageProps.banners);
    return (
        <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="lg:ml-64 flex-1 bg-transparent p-4 sm:p-8 overflow-y-auto h-screen"
        >
            <Header theme={pageProps.theme} toggleTheme={pageProps.toggleTheme} onToggleSidebar={pageProps.onToggleSidebar} />
            <BannerDisplay banner={pageBanner} />
            {title && description && <PageHeader title={title} description={description} />}
            <div>
                {children}
            </div>
        </motion.main>
    );
};

// Helper icons for the new SubscriptionPage
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const SparklesIcon = () => (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 -mr-8 -mt-2 text-violet-400 pointer-events-none">
        <g opacity="0.5">
            <path d="M52.887 18.2L55 10L57.113 18.2L65 20L57.113 21.8L55 30L52.887 21.8L45 20L52.887 18.2Z" fill="currentColor"/>
            <path d="M82.887 38.2L85 30L87.113 38.2L95 40L87.113 41.8L85 50L82.887 41.8L75 40L82.887 38.2Z" fill="currentColor"/>
            <path d="M67.887 58.2L70 50L72.113 58.2L80 60L72.113 61.8L70 70L67.887 61.8L60 60L67.887 58.2Z" fill="currentColor"/>
        </g>
    </svg>
);


// --- Subscription Page ---
export const SubscriptionPage: React.FC<PageProps> = (props) => {
    // Note: This page is for UI display. It does not connect to the useUser subscription logic
    // which still uses 'standard'/'premium'. This is per user request to match the design.
    return (
        <PageWrapper pageProps={props} pageName="Subscriptions">
            <div className="text-center mb-12 sm:mb-16 px-4">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4"
                >
                    A plan for every need
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-neutral-400"
                >
                    Safety trade, earn, & borrow digital assets with top-tier security.
                </motion.p>
            </div>

            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: {},
                    show: {
                        transition: {
                            staggerChildren: 0.15,
                        }
                    }
                }}
            >
                {SUBSCRIPTION_PLANS.map((plan, index) => (
                    <motion.div
                        key={index}
                        variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
                        className={`relative rounded-2xl transition-all duration-300 h-full flex flex-col ${
                            plan.popular 
                            ? 'bg-gradient-to-br from-violet-500 to-purple-600 p-0.5 shadow-2xl shadow-purple-500/20' 
                            : 'bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10'
                        }`}
                    >
                        <div className={`p-6 md:p-8 h-full flex flex-col ${
                          plan.popular ? 'bg-gray-50/95 dark:bg-[#100D1A] rounded-[15px]' : ''
                        }`}>
                            {plan.popular && <SparklesIcon />}
                            
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                                {plan.popular && (
                                    <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">Popular</span>
                                )}
                            </div>
                            
                            <div className="my-8 flex items-baseline">
                                <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">${plan.price}</span>
                                <span className="text-gray-500 dark:text-neutral-400 ml-2">per month</span>
                            </div>
                            
                            <p className="text-gray-500 dark:text-neutral-400 mb-8 min-h-[40px]">{plan.description}</p>
                            
                            <motion.button 
                                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full py-3 px-4 mt-auto text-white font-semibold rounded-lg shadow-lg transition-all ${
                                    plan.popular 
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-500' 
                                    : 'bg-white/10 hover:bg-white/20'
                                }`}
                            >
                                Get started
                            </motion.button>

                            <hr className="my-8 border-white/10" />

                            <div className="flex-grow flex flex-col">
                                <h4 className="font-semibold text-gray-700 dark:text-neutral-200 mb-1">FEATURES</h4>
                                <p className="text-xs text-gray-500 dark:text-neutral-400 mb-6">{plan.features[0]}</p>
                                <ul className="space-y-4 text-left">
                                    {plan.features.slice(1).map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircleIcon className="w-5 h-5 mr-3 text-violet-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600 dark:text-neutral-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </PageWrapper>
    );
};


// --- Explore Page ---
export const ExplorePage: React.FC<PageProps> = (props) => {
    const gridContainerVariants = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }
        }
    };
    
    const gridItemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1 }
    };
    
    return (
        <PageWrapper pageName="Explore" title="Explore" description="Discover new and trending digital assets from talented creators around the world." pageProps={props}>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8"
                variants={gridContainerVariants}
                initial="hidden"
                animate="show"
            >
                {(props.products || []).slice(0, 9).map((product) => (
                  <ProductCard key={product.id} product={product} variants={gridItemVariants} />
                ))}
            </motion.div>
        </PageWrapper>
    );
};

// --- Popular Products Page ---
export const PopularProductsPage: React.FC<PageProps> = (props) => (
    <PageWrapper pageName="Popular Products" title="Popular Products" description="See what's currently popular in the marketplace. Best-selling items curated for you." pageProps={props}>
        <div className="space-y-4">
            {(props.products || []).slice().sort((a, b) => b.price - a.price).slice(0, 5).map((p, index) => (
                <motion.div 
                    key={p.id}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, zIndex: 10 }}
                    className="relative group bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md p-4 rounded-xl border border-gray-200/50 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-none transition-all duration-300 cursor-pointer"
                >
                    <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neutral-300 to-neutral-600 dark:from-neutral-600 dark:to-neutral-300 w-20 text-center transition-transform duration-300 group-hover:scale-110">
                            #{index + 1}
                        </span>
                        <img src={p.image} alt={p.title} className="w-24 h-24 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105" />
                        <div className="flex-1">
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg">{p.title}</h3>
                            <p className="text-gray-500 dark:text-neutral-400 text-sm">by {p.author}</p>
                            <p className="mt-2 text-violet-500 dark:text-violet-400 font-bold text-xl">
                                ₹{p.price.toFixed(2)}
                            </p>
                        </div>
                        <motion.a 
                           href={`#/product/${p.id}`}
                           onClick={(e) => { e.preventDefault(); window.location.hash = `#/product/${p.id}`; }}
                           className="py-2 px-5 bg-violet-600 text-white font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           whileHover={{scale: 1.1}}
                           whileTap={{scale: 0.9}}
                        >
                            View
                        </motion.a>
                    </div>
                </motion.div>
            ))}
        </div>
    </PageWrapper>
);

// --- Top Authors Page ---

const AuthorCard: React.FC<{ author: any, products: Product[] }> = ({ author, products }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 150, damping: 20 };
    const rotateX = useSpring(useTransform(y, [-50, 50], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(x, [-50, 50], [-5, 5]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 800 }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md p-6 rounded-lg text-center border border-gray-200/50 dark:border-white/10 flex flex-col items-center h-full transition-colors duration-300 shadow-lg shadow-black/5 dark:shadow-none"
            >
                <motion.img 
                    style={{ transform: 'translateZ(40px)' }}
                    src={author.authorAvatar} alt={author.author} className="w-24 h-24 rounded-full mb-4 border-2 border-violet-400 shadow-lg" 
                />
                <motion.h3 style={{ transform: 'translateZ(30px)' }} className="text-gray-900 dark:text-white font-bold text-lg transition-colors duration-300">{author.author}</motion.h3>
                <motion.p style={{ transform: 'translateZ(20px)' }} className="text-gray-500 dark:text-neutral-400 text-sm mt-1 transition-colors duration-300">{products.filter(p => p.author === author.author).length} Products</motion.p>
            </motion.div>
        </motion.div>
    );
};


export const TopAuthorsPage: React.FC<PageProps> = (props) => {
    const authors = [...new Map((props.products || []).map(p => [p.author, p])).values()];
    return (
    <PageWrapper pageName="Top Authors" title="Top Authors" description="Check out our top-rated authors and their amazing collections of digital goods." pageProps={props}>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden"
          animate="show"
        >
            {authors.map((author) => (
                <motion.div key={author.author} variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } }}>
                   <AuthorCard author={author} products={props.products || []} />
                </motion.div>
            ))}
        </motion.div>
    </PageWrapper>
)};

// --- Feed Page ---
const TimelineMarker: React.FC<{ type: FeedItem['type'] }> = ({ type }) => {
    const icons = {
        new_product: <ProductsIcon className="w-5 h-5 text-violet-400" />,
        author_update: <AuthorsIcon className="w-5 h-5 text-blue-400" />,
        trending: <FeedIcon className="w-5 h-5 text-green-400" />,
    };

    const colors = {
        new_product: 'bg-violet-500/20 ring-violet-500/30',
        author_update: 'bg-blue-500/20 ring-blue-500/30',
        trending: 'bg-green-500/20 ring-green-500/30',
    };

    return (
        <motion.div
            className={`absolute left-[-1.25rem] top-1 w-10 h-10 rounded-full flex items-center justify-center ring-4 ${colors[type]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20, delay: 0.3 } }}
        >
            {icons[type]}
        </motion.div>
    );
};

const FeedCard: React.FC<{ item: FeedItem }> = ({ item }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      window.location.hash = path;
    };

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pl-12 relative"
        >
            <TimelineMarker type={item.type} />
            <motion.div 
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(167, 139, 250, 0.1), 0 0 0 1px rgba(167, 139, 250, 0.5)' }}
                className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-white/10 p-5 flex space-x-4 transition-all duration-300"
            >
                <div className="flex-1">
                    <div className="flex items-baseline space-x-2">
                        {item.author && <img src={item.authorAvatar} alt={item.author} className="w-5 h-5 rounded-full" />}
                        {item.author && <p className="font-semibold text-gray-800 dark:text-white">{item.author}</p>}
                        <p className="text-gray-500 dark:text-neutral-400">{item.title}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{item.timestamp}</p>
                    
                    {item.content && <p className="text-sm text-gray-600 dark:text-neutral-300 mt-3">{item.content}</p>}

                    {item.type === 'new_product' && item.product && (
                         <a href={`#/product/${item.product.id}`} onClick={(e) => handleNavClick(e, `#/product/${item.product.id}`)} className="mt-3 group block">
                            <div className="flex items-center bg-gray-100/50 dark:bg-black/20 p-3 rounded-md border border-gray-200 dark:border-white/10 group-hover:border-violet-400 group-hover:bg-violet-500/5 dark:group-hover:bg-violet-500/10 transition-all duration-300">
                               <img src={item.product.image} alt={item.product.title} className="w-12 h-12 object-cover rounded mr-4" />
                               <div>
                                   <p className="font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors duration-300">{item.product.title}</p>
                                   <p className="text-sm text-violet-500 dark:text-violet-400 font-bold">₹{item.product.price.toFixed(2)}</p>
                               </div>
                            </div>
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export const FeedPage: React.FC<PageProps> = (props) => {
    const timelineRef = useRef(null);
    const isInView = useInView(timelineRef, { once: true, amount: 0.2 });

    return (
        <PageWrapper 
            pageName="Feed"
            title="Your Feed" 
            description="Your personalized feed of new items, updates from authors you follow, and more." 
            pageProps={props}
        >
            <div ref={timelineRef} className="relative max-w-3xl mx-auto pt-4">
                <motion.div 
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-500/50 via-purple-500/50 to-transparent rounded-full"
                    style={{ transformOrigin: 'top' }}
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                />
                <div className="space-y-12">
                    {MOCK_FEED_ITEMS.map(item => (
                        <FeedCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};

// --- Contact Page ---
const FloatingLabelInput: React.FC<{
    id: string;
    label: string;
    type?: string;
    component?: 'input' | 'textarea';
    [key: string]: any;
}> = ({ id, label, type = 'text', component = 'input', ...props }) => {
    const Component = component;
    return (
        <div className="relative">
            <Component
                id={id}
                type={type}
                placeholder=" "
                className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 dark:text-white bg-transparent rounded-lg border border-gray-300 dark:border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-violet-500 peer"
                {...props}
            />
            <label
                htmlFor={id}
                className="absolute text-sm text-gray-500 dark:text-neutral-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white/60 dark:bg-[#161120] px-2 peer-focus:px-2 peer-focus:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-3"
            >
                {label}
            </label>
        </div>
    );
};

export const ContactPage: React.FC<PageProps> = (props) => (
    <PageWrapper pageName="Contact" title="Contact Us" description="Have questions? We'd love to hear from you. Reach out and we'll get back to you soon." pageProps={props}>
        <motion.div 
            className="max-w-3xl mx-auto bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 sm:p-12 shadow-xl shadow-black/5 dark:shadow-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
            <form className="space-y-8">
                <FloatingLabelInput id="name" label="Full Name" />
                <FloatingLabelInput id="email" label="Email Address" type="email" />
                <FloatingLabelInput id="subject" label="Subject" />
                <FloatingLabelInput id="message" label="Your Message" component="textarea" rows={5} />
                <motion.button 
                    type="submit" 
                    className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:bg-gradient-to-l transition-all duration-300"
                    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.98 }}
                >
                    Send Message
                </motion.button>
            </form>
        </motion.div>
    </PageWrapper>
);


// --- Settings Page ---
const settingsTabs = ['Profile', 'Notifications', 'Billing', 'Security'];

const InputField: React.FC<{label: string, id: string, type?: string, value: string, readOnly?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, id, type = 'text', value, onChange, readOnly = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">{label}</label>
        <input type={type} id={id} value={value} onChange={onChange} readOnly={readOnly} className={`mt-1 block w-full bg-white/80 dark:bg-[#161120] backdrop-blur-sm border border-gray-300 dark:border-white/20 rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:bg-gray-50 dark:focus:bg-[#1C1629] transition-all ${readOnly ? 'opacity-60 cursor-not-allowed' : ''}`} />
    </div>
);

const ToggleSwitch: React.FC<{label: string, description: string, enabled: boolean, setEnabled: (e:boolean) => void}> = ({label, description, enabled, setEnabled}) => (
    <div className="flex justify-between items-center">
        <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">{label}</h4>
            <p className="text-sm text-gray-500 dark:text-neutral-400">{description}</p>
        </div>
        <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${enabled ? 'bg-violet-500' : 'bg-gray-300 dark:bg-neutral-600'}`}
        >
            <motion.div layout className={`w-5 h-5 rounded-full bg-white shadow-md`} />
        </button>
    </div>
);
export const SettingsPage: React.FC<PageProps> = (props) => {
    const { user, loading: userLoading, updateProfile } = useUser();
    const [activeTab, setActiveTab] = useState(settingsTabs[0]);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [pushEnabled, setPushEnabled] = useState(false);
    
    // Local state for form fields
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name || '');
            setUsername(user.username || '');
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        setIsSaving(true);
        setMessage(null);
        const { error } = await updateProfile({
            full_name: fullName,
            username,
            avatar_url: avatarUrl,
        });

        if (error) {
            setMessage({ text: `Error: ${error.message || 'Could not update profile.'}`, type: 'error' });
        } else {
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
        }
        setIsSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    const renderTabContent = () => {
        if (userLoading) return <div>Loading...</div>;
        if (!user) return <div>Please log in to view settings.</div>;
        switch(activeTab) {
            case 'Profile': return (
                <div className="space-y-6">
                    {message && (
                        <div className={`p-3 rounded-md text-sm border ${
                            message.type === 'error'
                                ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                : 'bg-green-500/10 text-green-500 border-green-500/20'
                        }`}>
                            {message.text}
                        </div>
                    )}
                    <InputField label="Full Name" id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    <InputField label="Username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <InputField label="Email" id="email" value={user.email || ''} readOnly />
                    <InputField label="Avatar URL" id="avatar-url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
                    <motion.button 
                        onClick={handleProfileUpdate} 
                        whileHover={{scale: 1.02}} 
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg disabled:opacity-50"
                        disabled={isSaving}
                    >
                       {isSaving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                </div>
            );
            case 'Notifications': return (
                <div className="space-y-6">
                    <ToggleSwitch label="Email Notifications" description="Get emails about new products and offers." enabled={emailEnabled} setEnabled={setEmailEnabled} />
                    <ToggleSwitch label="Push Notifications" description="Receive push notifications on your device." enabled={pushEnabled} setEnabled={setPushEnabled} />
                </div>
            );
            case 'Billing': return (
                <div>
                     <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Payment Methods</h3>
                     <div className="border border-violet-400 bg-violet-500/10 p-4 rounded-lg flex justify-between items-center">
                         <p>Visa ending in 1234</p>
                         <button className="text-sm text-gray-600 dark:text-neutral-300 hover:text-red-500">Remove</button>
                     </div>
                </div>
            );
            case 'Security': return (
                <div className="space-y-6">
                    <InputField label="Current Password" id="current-password" type="password" value="••••••••" readOnly />
                    <InputField label="New Password" id="new-password" type="password" value="" />
                </div>
            );
            default: return null;
        }
    }

    return (
        <PageWrapper pageName="Settings" title="Settings" description="Manage your account settings, preferences, and more." pageProps={props}>
            <motion.div 
                className="bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-1 sm:p-2 shadow-xl shadow-black/5 dark:shadow-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            >
                <div className="flex border-b border-gray-200 dark:border-white/10 overflow-x-auto">
                    {settingsTabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? 'text-violet-500 dark:text-violet-400' : 'text-gray-500 dark:text-neutral-400'} relative py-3 px-2 sm:py-4 sm:px-6 text-xs sm:text-sm font-medium transition-colors hover:text-gray-900 dark:hover:text-white focus:outline-none whitespace-nowrap`}
                        >
                            {tab}
                            {activeTab === tab && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 dark:bg-violet-400" layoutId="underline" />}
                        </button>
                    ))}
                </div>
                <div className="p-4 sm:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </PageWrapper>
    );
};

// --- Help Page ---
const faqs = [
    { q: 'How do I purchase an item?', a: 'Simply click "Buy Now" or "Add to Cart" and proceed to checkout. We accept various payment methods for your convenience.' },
    { q: 'What is the license on items?', a: 'Most items come with a standard commercial license. Please check the item details for specific licensing information.' },
    { q: 'Can I get a refund?', a: 'Due to the nature of digital goods, we generally do not offer refunds. However, if an item is faulty, please contact support.' },
    { q: 'How do I contact an author?', a: 'You can visit the author\'s profile page to find their contact information or send them a message directly through our platform.' },
];
const Accordion: React.FC<{q: string, a: string}> = ({q, a}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <motion.div className="border-b border-gray-200 dark:border-white/10">
            <motion.button 
              className="w-full flex justify-between items-center py-5 px-1 text-left text-lg text-gray-900 dark:text-white font-medium" 
              onClick={() => setIsOpen(!isOpen)}
            >
                <span>{q}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 px-1 text-gray-600 dark:text-neutral-400">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
export const HelpPage: React.FC<PageProps> = (props) => (
    <PageWrapper pageName="Help" title="Help & Support" description="Find answers to common questions in our FAQ or get in touch with our friendly support team." pageProps={props}>
        <motion.div 
            className="max-w-3xl mx-auto bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
            {faqs.map(faq => <Accordion key={faq.q} {...faq} />)}
        </motion.div>
    </PageWrapper>
);

// --- Profile Page ---
const AnimatedNumber: React.FC<{ value: number, isCurrency?: boolean }> = ({ value, isCurrency = false }) => {
    const ref = useRef<HTMLSpanElement>(null);
    const inViewRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(inViewRef, { once: true });

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 1.5,
                ease: "easeOut",
                onUpdate(latest) {
                    if (ref.current) {
                        ref.current.textContent = isCurrency 
                            ? `₹${latest.toFixed(2)}` 
                            : Math.round(latest).toString();
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, value, isCurrency]);
    return <div ref={inViewRef}><span ref={ref} /></div>;
};

const StatCard: React.FC<{label: string, value: number, isCurrency?: boolean}> = ({label, value, isCurrency}) => (
    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 rounded-lg text-center transition-colors duration-300">
        <div className="text-3xl font-bold text-violet-600 dark:text-violet-300 transition-colors duration-300">
            <AnimatedNumber value={value} isCurrency={isCurrency} />
        </div>
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-300">{label}</p>
    </div>
);

const getStatusColor = (status: Order['status']) => {
    switch (status) {
        case 'Delivered': return 'bg-green-500/20 text-green-400';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-400';
        case 'Cancelled': return 'bg-red-500/20 text-red-400';
    }
}

const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

const AcquiredProductCard: React.FC<{ product: AcquiredProduct }> = ({ product }) => {
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
      e.preventDefault();
      window.location.hash = path;
    };
    return (
        <motion.div
            layout
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(90, 80, 100, 0.1)' }}
            className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md rounded-lg border border-gray-200/50 dark:border-white/10 p-4 flex flex-col sm:flex-row items-center gap-4"
        >
            <img src={product.image} alt={product.title} className="w-full sm:w-24 h-24 object-cover rounded-md" />
            <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-gray-900 dark:text-white">{product.title}</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">by {product.author}</p>
                <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Acquired on {formatDate(product.acquiredDate)}</p>
            </div>
            <div className="mt-2 sm:mt-0 flex flex-col sm:flex-row items-center gap-2">
                {product.download_url && (
                    <a href={product.download_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-4 py-2 text-sm font-semibold text-white bg-violet-600 rounded-md hover:bg-violet-700 transition-colors">Download</a>
                )}
                 {product.gift_url && (
                    <a href={product.gift_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center px-4 py-2 text-sm font-semibold text-amber-800 dark:text-amber-300 bg-amber-400/20 rounded-md hover:bg-amber-400/30 transition-colors">View Gift</a>
                )}
                <a href={`#/product/${product.id}`} onClick={(e) => handleNavClick(e, `#/product/${product.id}`)} className="w-full sm:w-auto text-center px-4 py-2 text-sm font-semibold text-violet-600 dark:text-violet-400 rounded-md border border-violet-500/50 hover:bg-violet-500/10 transition-colors">View Details</a>
            </div>
        </motion.div>
    )
}

const GiftCard: React.FC<{ gift: Gift }> = ({ gift }) => (
    <motion.div
        layout
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(90, 80, 100, 0.1)' }}
        className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md rounded-lg border border-gray-200/50 dark:border-white/10 p-4 flex flex-col sm:flex-row items-center gap-4"
    >
        <div className="p-2 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-lg">
           <GiftIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
        </div>
        <div className="flex-1 text-center sm:text-left">
            <h3 className="font-bold text-gray-900 dark:text-white">{gift.name}</h3>
            <p className="text-sm text-gray-600 dark:text-neutral-300">{gift.description}</p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">Received on {formatDate(gift.dateReceived)}</p>
        </div>
    </motion.div>
)

export const ProfilePage: React.FC<PageProps> = (props) => {
    const { user, loading, logout, acquiredProducts, gifts } = useUser();
    const [activeTab, setActiveTab] = useState('Products');
    const tabs = ['Products', 'Gifts', 'Order History'];
    
    if (loading) {
        return (
            <PageWrapper pageProps={props} pageName="Profile">
                <div className="flex justify-center items-center h-full">
                   <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            </PageWrapper>
        );
    }
    
    if (!user) {
        return (
            <motion.main
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="w-full flex-1 bg-transparent flex items-center justify-center p-4 sm:p-8 h-screen lg:ml-64"
            >
                <Auth />
            </motion.main>
        );
    }

    const renderContent = () => {
        switch(activeTab) {
            case 'Products':
                if (acquiredProducts.length === 0) {
                     return <p className="text-center text-gray-500 dark:text-neutral-400 py-8">You haven't acquired any products yet.</p>;
                }
                return (
                    <motion.div layout className="space-y-4" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                        {acquiredProducts.map(p => <AcquiredProductCard key={p.id} product={p} />)}
                    </motion.div>
                );
            case 'Gifts':
                 if (gifts.length === 0) {
                    return <p className="text-center text-gray-500 dark:text-neutral-400 py-8">No gifts received yet.</p>;
                 }
                 return (
                    <motion.div layout className="space-y-4" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                        {gifts.map(g => <GiftCard key={g.id} gift={g} />)}
                    </motion.div>
                );
            case 'Order History':
                return (
                    <motion.div layout className="space-y-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
                        {MOCK_ORDERS.map(order => (
                            <motion.div
                                key={order.id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md rounded-lg border border-gray-200/50 dark:border-white/10 overflow-hidden"
                            >
                                <div className="p-4 flex justify-between items-center bg-gray-100/30 dark:bg-white/5 border-b border-gray-200/50 dark:border-white/10 flex-wrap gap-2">
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                                        <p className="text-sm text-gray-500 dark:text-neutral-400">{order.date}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                                       <span className="font-bold text-gray-900 dark:text-white">₹{order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                );
        }
    }

    return (
        <PageWrapper pageProps={props} pageName="Profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: User Info */}
                <motion.div 
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0, transition: {type: 'spring', stiffness: 80} }}
                >
                    <div className="bg-white/60 dark:bg-[#161120]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200/50 dark:border-white/10 text-center flex flex-col items-center sticky top-8 transition-colors duration-300 shadow-xl shadow-black/5 dark:shadow-none">
                        <motion.div whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(167, 139, 250, 0.5)' }} className="rounded-full transition-shadow duration-300">
                           <img src={user.avatar_url || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user.id}`} alt={user.full_name || user.email} className="w-32 h-32 rounded-full mb-4 border-4 border-violet-500" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.full_name || user.email}</h1>
                        <p className="text-violet-500 dark:text-violet-400 font-mono mb-6">{user.username || 'No username'}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
                           <StatCard label="Total Spent" value={user.totalSpent || 0} isCurrency />
                           <StatCard label="Total Purchases" value={user.totalPurchases || 0} />
                        </div>
                        
                        <button onClick={logout} className="mt-6 w-full py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            Logout
                        </button>
                    </div>
                </motion.div>
                 {/* Right Panel: Tabs and Content */}
                 <motion.div 
                    className="lg:col-span-2"
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0, transition: {type: 'spring', stiffness: 80, delay: 0.1} }}
                >
                    <div className="bg-white/60 dark:bg-[#161120]/60 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-none transition-colors duration-300">
                        <div className="flex border-b border-gray-200/50 dark:border-white/10 p-2 overflow-x-auto">
                           {tabs.map(tab => (
                               <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`${activeTab === tab ? '' : 'hover:bg-black/5 dark:hover:bg-white/5'} flex-1 relative py-2.5 px-4 text-sm font-medium rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 whitespace-nowrap`}
                               >
                                  <span className={`${activeTab === tab ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-neutral-400'}`}>{tab}</span>
                                  {activeTab === tab && <motion.div className="absolute inset-0 bg-white dark:bg-black/20 rounded-md -z-10" layoutId="profile-tab" transition={{type: 'spring', stiffness: 300, damping: 25}} />}
                               </button>
                           ))}
                        </div>
                        <div className="p-4 sm:p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {renderContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

// --- Static Pages ---
const StaticPageSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-8 last:mb-0">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
        <div className="space-y-4 text-gray-600 dark:text-neutral-300 leading-relaxed">
            {children}
        </div>
    </div>
);

export const TermsPage: React.FC<PageProps> = (props) => (
    <PageWrapper pageName="Terms" title="Terms of Service" description="Please read our terms of service carefully before using our services." pageProps={props}>
        <motion.div
            className="max-w-3xl mx-auto bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
            <StaticPageSection title="1. Introduction">
                <p>Welcome to Pixer. These Terms of Service (“Terms”) govern your use of the Pixer website, and any related services provided by us. By using Pixer, you agree to these Terms in full. If you disagree with these Terms or any part of these Terms, you must not use our website.</p>
            </StaticPageSection>
            
            <StaticPageSection title="2. Intellectual Property Rights">
                <p>Unless otherwise stated, Pixer and/or its licensors own the intellectual property rights for all material on Pixer. All intellectual property rights are reserved. You may access this from Pixer for your own personal use subjected to restrictions set in these terms and conditions.</p>
            </StaticPageSection>
            
            <StaticPageSection title="3. User Content">
                <p>In these Terms of Service, “your user content” means material (including without limitation text, images, audio material, video material and audio-visual material) that you submit to our website, for whatever purpose. You grant to us a worldwide, irrevocable, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate and distribute your user content in any existing or future media.</p>
            </StaticPageSection>

            <StaticPageSection title="4. Limitations of liability">
                <p>In no event shall Pixer, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. Pixer, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>
            </StaticPageSection>
        </motion.div>
    </PageWrapper>
);

export const PrivacyPage: React.FC<PageProps> = (props) => (
    <PageWrapper pageName="Privacy" title="Privacy Policy" description="Your privacy is important to us. It is Pixer's policy to respect your privacy." pageProps={props}>
        <motion.div
            className="max-w-3xl mx-auto bg-white/60 dark:bg-[#161120]/60 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-black/5 dark:shadow-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
        >
            <StaticPageSection title="1. Information We Collect">
                <p>We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address.</p>
            </StaticPageSection>
            
            <StaticPageSection title="2. How We Use Collected Information">
                 <p>Pixer may collect and use Users personal information for the following purposes: To improve customer service, information you provide helps us respond to your customer service requests and support needs more efficiently. To personalize user experience, we may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site. To process payments, we may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.</p>
            </StaticPageSection>
            
            <StaticPageSection title="3. How We Protect Your Information">
                <p>We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site.</p>
            </StaticPageSection>

            <StaticPageSection title="4. Sharing Your Personal Information">
                <p>We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.</p>
            </StaticPageSection>
        </motion.div>
    </PageWrapper>
);

// --- Access Denied Page ---
export const AccessDeniedPage: React.FC<{}> = () => {
    const handleBackToSite = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#/Home';
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
            className="flex-1 p-8 text-center h-screen w-screen flex flex-col justify-center items-center relative z-10"
        >
            <motion.h1 
                className="text-5xl font-extrabold text-red-500"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, transition: { type: 'spring', delay: 0.2, stiffness: 120 } }}
            >
                Access Denied
            </motion.h1>
            <motion.p 
                className="text-lg text-neutral-300 mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.4 } }}
            >
                You do not have permission to view this page.
            </motion.p>
            <motion.a 
                href="#/Home" 
                onClick={handleBackToSite}
                className="mt-8 px-8 py-3 bg-violet-600 hover:bg-violet-700 transition-colors text-white font-semibold rounded-lg shadow-lg"
                whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.6 } }}
            >
                Back to Site
            </motion.a>
        </motion.div>
    );
};