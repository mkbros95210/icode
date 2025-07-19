
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCardIcon, RazorpayIcon, PhonePeIcon } from '@/constants';
import { supabase } from '@/lib/supabase';
import type { PaymentGateway } from '@/types';

const ToggleSwitch: React.FC<{label: string, enabled: boolean, setEnabled: (e:boolean) => void}> = ({label, enabled, setEnabled}) => (
    <div className="flex justify-between items-center">
        <h4 className="font-semibold text-white capitalize">{label}</h4>
        <button 
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${enabled ? 'bg-violet-500' : 'bg-neutral-600'}`}
        >
            <motion.div layout className={`w-5 h-5 rounded-full bg-white shadow-md`} />
        </button>
    </div>
);


const AdminSettingsPage: React.FC = () => {
    const [gateways, setGateways] = useState<PaymentGateway[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchGateways = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('payment_gateways')
                .select('*')
                .order('id');
            
            if (error) {
                console.error("Error fetching payment gateways", error);
                setMessage({ text: 'Could not fetch gateway settings.', type: 'error' });
            } else {
                setGateways(data);
            }
            setIsLoading(false);
        }
        fetchGateways();
    }, []);

    const handleGatewayChange = (name: string, field: keyof PaymentGateway, value: any) => {
        setGateways(currentGateways =>
            currentGateways.map(gw =>
                gw.name === name ? { ...gw, [field]: value } : gw
            )
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        const upsertData = gateways.map(({ id, ...rest }) => ({
            ...rest,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('payment_gateways')
            .upsert(upsertData, { onConflict: 'name' });

        if (error) {
            setMessage({ text: `Error saving settings: ${error.message}`, type: 'error' });
        } else {
            setMessage({ text: 'Settings saved successfully!', type: 'success' });
        }

        setIsSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };
    
    const razorpayConfig = gateways.find(g => g.name === 'razorpay');
    const phonepeConfig = gateways.find(g => g.name === 'phonepe');

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Admin Settings</h1>
            
            <form onSubmit={handleSave}>
                <motion.div 
                    className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="p-6">
                        <div className="flex items-center text-xl font-bold text-white mb-6">
                            <CreditCardIcon className="w-6 h-6 mr-3 text-violet-400" />
                            <h2>Payment Gateways</h2>
                        </div>
                        
                        {isLoading ? (
                             <div className="text-center p-8 text-neutral-400">Loading settings...</div>
                        ) : (
                             <div className="space-y-8">
                                {/* Razorpay */}
                                {razorpayConfig && (
                                <div className="bg-[#161120]/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <RazorpayIcon className="h-6" />
                                        <ToggleSwitch label="" enabled={razorpayConfig.is_enabled} setEnabled={(e) => handleGatewayChange('razorpay', 'is_enabled', e)} />
                                    </div>
                                    <AnimatePresence>
                                        {razorpayConfig.is_enabled && (
                                            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                                                <div className="space-y-3 pt-4 border-t border-white/10">
                                                    <input type="text" value={razorpayConfig.key_id || ''} onChange={e => handleGatewayChange('razorpay', 'key_id', e.target.value)} placeholder="Razorpay Key ID" className="w-full bg-[#1A1527] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                                    <input type="password" value={razorpayConfig.key_secret || ''} onChange={e => handleGatewayChange('razorpay', 'key_secret', e.target.value)} placeholder="Razorpay Key Secret" className="w-full bg-[#1A1527] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                )}

                                 {/* PhonePe */}
                                 {phonepeConfig && (
                                <div className="bg-[#161120]/50 border border-white/10 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <PhonePeIcon className="h-6" />
                                        <ToggleSwitch label="" enabled={phonepeConfig.is_enabled} setEnabled={(e) => handleGatewayChange('phonepe', 'is_enabled', e)} />
                                    </div>
                                    <AnimatePresence>
                                        {phonepeConfig.is_enabled && (
                                            <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                                                <div className="space-y-3 pt-4 border-t border-white/10">
                                                    <input type="text" value={phonepeConfig.merchant_id || ''} onChange={e => handleGatewayChange('phonepe', 'merchant_id', e.target.value)} placeholder="PhonePe Merchant ID" className="w-full bg-[#1A1527] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                                    <input type="password" value={phonepeConfig.salt_key || ''} onChange={e => handleGatewayChange('phonepe', 'salt_key', e.target.value)} placeholder="PhonePe Salt Key" className="w-full bg-[#1A1527] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <footer className="p-6 bg-black/20 rounded-b-2xl flex items-center justify-between mt-4">
                        <motion.button
                            type="submit"
                            disabled={isSaving || isLoading}
                            className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg disabled:opacity-50"
                            whileHover={{ scale: (isSaving || isLoading) ? 1 : 1.05 }}
                        >
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </motion.button>
                        {message && (
                            <motion.div 
                                initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
                                className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                                {message.text}
                            </motion.div>
                        )}
                    </footer>
                </motion.div>
            </form>
        </div>
    );
};

export default AdminSettingsPage;