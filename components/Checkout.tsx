

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from './CartContext';
import { useUser } from './UserContext';
import { MOCK_GIFTS } from './mock-data';
import { GiftIcon, RazorpayIcon, PhonePeIcon } from '../constants';
import type { PaymentGateway, SiteConfig } from '../types';
import Auth from './Auth';

interface CheckoutProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    paymentGateways: PaymentGateway[];
    siteConfig: SiteConfig | null;
}

const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
};

const modalVariants = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: { opacity: 0, scale: 0.9, y: 50 },
};

const GiftModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
    const gift = MOCK_GIFTS[0];
    return (
        <motion.div key="gift-modal" className="p-10 flex flex-col items-center justify-center text-center" initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 0.8}}>
            <motion.div initial={{scale:0}} animate={{scale:1, transition: {delay: 0.2, type: 'spring'}}} className="text-violet-400">
                <GiftIcon className="w-24 h-24" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">A Gift For You!</h2>
            <p className="mt-2 mb-4">As a thank you for your first order, please accept this gift.</p>
            <div className="bg-white/10 p-4 rounded-lg flex items-center gap-4 border border-white/20">
                <img src={gift.image} alt={gift.name} className="w-16 h-16 rounded-md"/>
                <div>
                    <h3 className="font-semibold text-left text-white">{gift.name}</h3>
                    <p className="text-sm text-left text-neutral-300">{gift.description}</p>
                </div>
            </div>
            <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={onClose} className="mt-6 px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold rounded-md shadow-lg">Awesome! Continue</motion.button>
        </motion.div>
    );
};

const Checkout: React.FC<CheckoutProps> = ({ isOpen, setIsOpen, paymentGateways, siteConfig }) => {
    const { cart, clearCart } = useCart();
    const { user, loading: userLoading, subscriptionPlan, hasMadeFirstOrder, addAcquiredProducts, addGift, setHasMadeFirstOrder } = useUser();
    const isSubscribed = subscriptionPlan !== 'none';

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);

    const steps = useMemo(() => {
        if (!user) return []; // No steps if not logged in
        return isSubscribed ? ["Confirm"] : ["Payment", "Confirm"];
    }, [user, isSubscribed]);

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));
    
    const handleClose = () => {
        setIsOpen(false);
        // Add a delay to allow the exit animation to complete before resetting state
        setTimeout(() => {
            setCurrentStep(0);
            setIsComplete(false);
            setIsGiftModalOpen(false);
            setSelectedGateway(null);
        }, 300);
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const handlePostPaymentSuccess = () => {
        addAcquiredProducts(cart.items);
        if (!hasMadeFirstOrder) {
            addGift(MOCK_GIFTS[0]);
            setHasMadeFirstOrder();
            setIsGiftModalOpen(true);
        } else {
            setIsComplete(true);
            setTimeout(handleClose, 3000);
        }
        clearCart();
    };
    
    const handleConfirm = () => {
        if (isSubscribed) {
            handlePostPaymentSuccess();
            return;
        }

        if (selectedGateway === 'razorpay') {
            const razorpayGateway = paymentGateways.find(g => g.name === 'razorpay');
            if (!razorpayGateway || !razorpayGateway.key_id) {
                alert('Razorpay is not configured correctly. Please contact support.');
                return;
            }

            const options = {
                key: razorpayGateway.key_id,
                amount: subtotal * 100, // Amount in paise
                currency: "INR",
                name: siteConfig?.site_name || "Pixer Marketplace",
                description: "Digital Product Purchase",
                image: siteConfig?.logo_url,
                handler: function (response: any) {
                    console.log('Razorpay Response:', response);
                    handlePostPaymentSuccess();
                },
                prefill: {
                    name: user?.full_name || user?.email,
                    email: user?.email,
                },
                theme: {
                    color: "#A78BFA"
                }
            };
            
            const rzp = new window.Razorpay(options);
             rzp.on('payment.failed', function (response: any){
                    alert(`Payment Failed: ${response.error.description}`);
                    console.error('Razorpay Payment Failed:', response.error);
            });
            rzp.open();

        } else if (selectedGateway === 'phonepe') {
            alert('PhonePe integration is not yet available.');
        } else {
            alert('Please select a payment gateway.');
        }
    };
    
    const handleGiftAccepted = () => {
        setIsGiftModalOpen(false);
        setIsComplete(true);
        setTimeout(handleClose, 3000);
    }
    

    const renderStepContent = () => {
        if (!user) return null; // Should be handled by the parent conditional render
        
        const currentStepName = steps[currentStep];

        switch (currentStepName) {
            case 'Payment':
                return (
                     <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Payment Method</h3>
                        <div className="space-y-3">
                             {paymentGateways.length > 0 ? paymentGateways.map(gateway => (
                                <div 
                                    key={gateway.name} 
                                    tabIndex={0} 
                                    role="button"
                                    onKeyPress={(e) => e.key === 'Enter' && setSelectedGateway(gateway.name)}
                                    onClick={() => setSelectedGateway(gateway.name)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 flex items-center gap-x-4 ${selectedGateway === gateway.name ? 'border-violet-500 bg-violet-500/10 ring-2 ring-violet-400' : 'border-gray-300 dark:border-white/20 bg-white/30 dark:bg-white/5 hover:border-violet-500 hover:bg-violet-500/10'}`}
                                >
                                    {gateway.name === 'razorpay' && <RazorpayIcon className="h-6 text-blue-500" />}
                                    {gateway.name === 'phonepe' && <PhonePeIcon className="h-6 text-purple-500" />}
                                    <span className="font-semibold capitalize text-gray-800 dark:text-neutral-200">{gateway.name}</span>
                                </div>
                            )) : (
                                <p className="text-center text-neutral-400">No payment gateways configured. Please contact support.</p>
                            )}
                        </div>
                    </div>
                );
            case 'Confirm':
                return (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Order</h3>
                        <div className="space-y-2 text-sm max-h-40 overflow-y-auto pr-2">
                            {cart.items.map(item => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.title} x{item.quantity}</span>
                                    <span>{isSubscribed ? 'Free' : `₹${(item.price * item.quantity).toFixed(2)}`}</span>
                                </div>
                            ))}
                        </div>
                        <hr className="my-3 border-gray-200 dark:border-white/20"/>
                        <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                            <span>Total</span>
                            <span>{isSubscribed ? '₹0.00' : `₹${subtotal.toFixed(2)}`}</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const isNextDisabled = !isSubscribed && steps[currentStep] === 'Payment' && !selectedGateway;

    const renderModalContent = () => {
        if (userLoading) {
            return (
                <div className="p-10 flex flex-col items-center justify-center text-center h-80">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            );
        }

        if (!user) {
            return (
                <motion.div key="auth-prompt" initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <header className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Please Login</h2>
                        <button onClick={handleClose} className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white text-3xl">&times;</button>
                    </header>
                    <div className="p-6 bg-gray-50/50 dark:bg-black/10">
                        <p className="text-center mb-4 text-gray-600 dark:text-neutral-400">You need to sign in or create an account to continue.</p>
                        <Auth />
                    </div>
                </motion.div>
            );
        }
        
        // --- User is logged in flow ---

        if (isComplete) {
            return (
                <motion.div key="complete" className="p-10 flex flex-col items-center justify-center text-center h-80" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <motion.svg className="w-24 h-24 text-green-400" viewBox="0 0 50 50" initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: 'spring', delay: 0.2 }}}>
                        <motion.path fill="none" stroke="currentColor" strokeWidth="2" d="M14,26 l8,8 l14,-14"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1, transition: { duration: 0.5, delay: 0.4, ease: "easeInOut" } }}
                        />
                    </motion.svg>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{isSubscribed ? 'Products Acquired!' : 'Payment Successful!'}</h2>
                    <p className="mt-2">{isSubscribed ? 'Your new products are available in your profile.' : 'Thank you for your purchase.'}</p>
                </motion.div>
            );
        }
        
        if (isGiftModalOpen) {
            return <GiftModal onClose={handleGiftAccepted} />;
        }
        
        return (
            <motion.div key="checkout-flow" initial={{opacity:0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                <header className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h2>
                    <button onClick={handleClose} className="text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white text-3xl">&times;</button>
                </header>
                <div className="p-6 min-h-[200px] overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
                <footer className="p-6 bg-white/30 dark:bg-black/20 rounded-b-xl flex justify-between items-center">
                    {currentStep > 0 ? (
                       <button onClick={handleBack} className="text-sm px-4 py-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors">Back</button>
                    ) : <div />}
                    
                    {currentStep < steps.length - 1 && <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={handleNext} disabled={isNextDisabled} className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-500 text-white font-semibold rounded-md shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Next</motion.button>}
                    {currentStep === steps.length - 1 && <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={handleConfirm} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-lg">{isSubscribed ? 'Confirm & Get' : 'Confirm Purchase'}</motion.button>}
                </footer>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {isOpen && (
                 <>
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-40"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={handleClose}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="bg-white/60 dark:bg-[#1C1629]/80 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 shadow-2xl w-full max-w-lg text-gray-800 dark:text-neutral-300 transition-colors duration-300">
                           <AnimatePresence mode="wait">
                            {renderModalContent()}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
};

export default Checkout;