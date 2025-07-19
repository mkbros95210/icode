import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import type { Product } from '../types';
import { useCart } from './CartContext';

interface ProductCardProps {
  product: Product;
  variants: any;
}

const AnimatedPrice: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = `₹${latest.toFixed(2)}`;
        }
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref} />;
};

const AddToCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, variants }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    window.location.hash = path;
  };

  return (
    <motion.a
      href={`#/product/${product.id}`}
      onClick={(e) => handleNavClick(e, `#/product/${product.id}`)}
      variants={variants}
      className="block w-full"
      aria-label={`View details for ${product.title}`}
    >
      <motion.div
        className="h-96 w-full rounded-3xl bg-gradient-to-br from-[#1a1c22] to-[#20232a] overflow-hidden relative shadow-xl group transition-all duration-300 ease-in-out border border-transparent hover:border-[3px] hover:border-violet-500 hover:shadow-[0_0_20px_4px_rgba(168,85,247,0.3)]"
        whileHover={{ y: -10, scale: 1.015 }}
      >
        {/* Background blurred image */}
        <div className="absolute top-0 left-0 w-full h-full">
          <img
            src={product.image}
            alt=""
            className="w-full h-full object-cover blur-sm saturate-125 opacity-90 transition-all duration-500 group-hover:blur-[2px] group-hover:saturate-[1.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e]/90 via-[#1e1e1e]/30 to-transparent"></div>
        </div>

        {/* Top Right Title */}
        <div className="absolute top-5 right-5 text-right z-10">
          <p className="font-bold text-white drop-shadow-md text-lg md:text-xl">
            {product.title}
          </p>
          <p className="text-xs text-neutral-300 drop-shadow-md">by {product.author}</p>
        </div>

        {/* Bottom Card (Price Area) */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-[25%] bg-[#292d36] rounded-t-[30px] border-t border-white/10 px-6 py-4 transition-all duration-500 group-hover:rounded-t-[38px] group-hover:scale-[1.01]"
          whileHover={{ y: -2 }}
        >
          <div className="flex justify-between items-end h-full">
            {/* Price */}
            <div className="text-white">
              {product.price > 0 ? (
                <>
                  <div className="text-4xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-500 to-violet-500 bg-clip-text text-transparent">
                    <AnimatedPrice value={product.price} />
                  </div>
                  <span className="text-sm font-medium text-neutral-400">One-time purchase</span>
                </>
              ) : (
                <div className="text-4xl font-bold tracking-tight text-emerald-400">Free</div>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleQuickAdd}
              disabled={added}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-colors shadow-lg ${added ? 'bg-green-500' : 'bg-gradient-to-tr from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={added ? 'Added to cart' : 'Add to cart'}
            >
              <AnimatePresence mode="popLayout">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <CheckIcon />
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                  >
                    <AddToCartIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.a>
  );
};

export default ProductCard;
