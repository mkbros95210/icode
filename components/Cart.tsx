import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import type { CartItem } from '../types';

interface CartProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onCheckout: () => void;
}

const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const cartVariants = {
    visible: { x: 0 },
    hidden: { x: '100%' },
};

const Cart: React.FC<CartProps> = ({ isOpen, setIsOpen, onCheckout }) => {
    const { cart, dispatch } = useCart();
    const { subscriptionPlan } = useUser();
    const isSubscribed = subscriptionPlan !== 'none';

    const subtotal = useMemo(() => {
        if (isSubscribed) return 0;
        return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }, [cart.items, isSubscribed]);

    const updateQuantity = (id: number, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const removeItem = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-30"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                        className="fixed top-0 right-0 w-full max-w-md h-full bg-white/60 dark:bg-[#161120]/80 backdrop-blur-lg border-l border-gray-200/50 dark:border-white/10 z-40 flex flex-col transition-colors duration-300"
                        variants={cartVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <header className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-white/10">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Cart</h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white text-3xl">&times;</button>
                        </header>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.items.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-500 dark:text-neutral-400">
                                    Your cart is empty.
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    <AnimatePresence>
                                    {cart.items.map(item => (
                                        <motion.li 
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
                                            className="flex items-start space-x-4"
                                        >
                                            <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-md"/>
                                            <div className="flex-1">
                                                <h3 className="text-gray-900 dark:text-white font-semibold">{item.title}</h3>
                                                <p className={`text-sm ${isSubscribed ? 'line-through text-gray-500 dark:text-neutral-500' : 'text-violet-500 dark:text-violet-400'}`}>₹{item.price.toFixed(2)}</p>
                                                <div className="flex items-center mt-2 text-gray-700 dark:text-neutral-200">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-0.5 border border-gray-300 dark:border-white/20 rounded">-</button>
                                                    <span className="px-3">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-0.5 border border-gray-300 dark:border-white/20 rounded">+</button>
                                                </div>
                                            </div>
                                            <button onClick={() => removeItem(item.id)} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                                        </motion.li>
                                    ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>

                        {cart.items.length > 0 && (
                             <footer className="p-6 border-t border-gray-200 dark:border-white/10 bg-white/30 dark:bg-transparent">
                                <div className="flex justify-between items-center mb-4 text-gray-900 dark:text-white">
                                    <span className="text-lg">Subtotal</span>
                                    <span className="text-xl font-bold">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <motion.button 
                                    onClick={onCheckout}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold rounded-md shadow-lg"
                                    whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isSubscribed ? 'Get Now' : 'Proceed to Checkout'}
                                </motion.button>
                            </footer>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Cart;