




import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Banner } from '../types';
import Header from './Header';
import ProductCard from './ProductCard';
import { useCart } from './CartContext';
import { ExternalLinkIcon } from '../constants';
import BannerDisplay, { getBannerForPage } from './BannerDisplay';


interface ProductDetailPageProps {
    product: Product;
    allProducts: Product[];
    banners: Banner[];
    theme: string;
    toggleTheme: () => void;
    onToggleSidebar: () => void;
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

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
)

const getYouTubeID = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allProducts, banners, theme, toggleTheme, onToggleSidebar }) => {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const recommendedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    
    const handleAddToCart = () => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };
    
    const videoId = product.video_url ? getYouTubeID(product.video_url) : null;
    const pageBanner = getBannerForPage(`product/${product.id}`, banners);

    return (
        <motion.main
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="lg:ml-64 flex-1 bg-transparent p-4 sm:p-8 overflow-y-auto h-screen"
        >
            <Header theme={theme} toggleTheme={toggleTheme} onToggleSidebar={onToggleSidebar} />
            <BannerDisplay banner={pageBanner} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
                {/* Left side: Media */}
                <motion.div 
                    className="relative w-full aspect-video"
                    whileHover="hover"
                >
                    {videoId ? (
                         <iframe
                            className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`}
                            title={product.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <motion.img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/50" 
                            style={{ transformStyle: 'preserve-3d' }}
                            variants={{ hover: { scale: 1.05, rotateZ: 2, rotateX: 10, transition: { type: 'spring' }} }}
                        />
                    )}
                </motion.div>

                {/* Right side: Details */}
                <div className="flex flex-col">
                    <motion.h1 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3 transition-colors duration-300"
                    >
                        {product.title}
                    </motion.h1>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center text-md text-gray-500 dark:text-neutral-400 mb-6 transition-colors duration-300"
                    >
                        <img src={product.authorAvatar} alt={product.author} className="w-8 h-8 rounded-full mr-3" />
                        <span>By <span className="text-gray-900 dark:text-white font-semibold">{product.author}</span> in <span className="text-violet-500 dark:text-violet-400">{product.category}</span></span>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 dark:text-neutral-300 leading-relaxed mb-8 transition-colors duration-300"
                    >
                        {product.description}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-2 mb-8"
                    >
                       {product.details.map((detail, i) => (
                           <div key={i} className="flex items-center text-sm text-gray-600 dark:text-neutral-300 transition-colors duration-300">
                               <svg className="w-4 h-4 mr-2 text-violet-500 dark:text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                               {detail}
                           </div>
                       ))}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-auto flex flex-col sm:flex-row items-stretch gap-4"
                    >
                        <div className="flex flex-col justify-center sm:flex-grow-0 flex-grow">
                            <span className="text-3xl font-bold text-violet-500 dark:text-violet-400 transition-colors duration-300">
                                {product.price > 0 ? `₹${product.price.toFixed(2)}` : 'Free'}
                            </span>
                        </div>

                        {product.preview_url && (
                            <a href={product.preview_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <motion.button 
                                    className="h-full w-full sm:w-auto py-3 px-6 font-semibold text-violet-500 dark:text-violet-400 bg-transparent border-2 border-violet-500 rounded-lg focus:outline-none transition-all duration-300 flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(167, 139, 250, 0.1)' }}
                                >
                                    <ExternalLinkIcon className="w-5 h-5" /> Live Preview
                                </motion.button>
                            </a>
                        )}

                        <motion.button 
                            onClick={handleAddToCart}
                            disabled={added}
                            className="flex-1 py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 transition-all duration-300"
                            whileHover={{ scale: 1.05, filter: 'brightness(1.2)', boxShadow: '0px 8px 25px rgba(167, 139, 250, 0.4)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                            <AnimatePresence mode="wait">
                            {added ? (
                                <motion.span key="added" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center justify-center gap-x-2">
                                   <CheckIcon /> Added
                                </motion.span>
                            ) : (
                                <motion.span key="add" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                    Add to Cart
                                </motion.span>
                            )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Recommended Products */}
            <div className="mt-20">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300">You might also like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                     {recommendedProducts.map((p, i) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.1 }}
                        >
                            <ProductCard product={p} variants={{}} />
                        </motion.div>
                    ))}
                </div>
            </div>

        </motion.main>
    )
};

export default ProductDetailPage;