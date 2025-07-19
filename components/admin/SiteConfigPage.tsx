import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase, type Database } from '../../lib/supabase';
import type { SiteConfig } from '../../types';
import { SIDEBAR_LINKS } from '../../constants';

type SiteConfigUpdate = Database['public']['Tables']['site_config']['Update'];

interface SiteConfigPageProps {
    siteConfig: SiteConfig | null;
    fetchAdminData: () => void;
}

const InputField: React.FC<{label: string, id: string, value: string | null, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string}> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-neutral-400 mb-1">{label}</label>
        <input type="text" id={id} value={value ?? ''} onChange={onChange} placeholder={placeholder} className="w-full bg-[#161120] p-3 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none" />
    </div>
);

const ToggleSwitch: React.FC<{label: string, enabled: boolean, setEnabled: (e:boolean) => void}> = ({label, enabled, setEnabled}) => (
    <div className="flex justify-between items-center bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-lg p-4">
        <h4 className="font-semibold text-white">{label}</h4>
        <button 
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${enabled ? 'bg-violet-500' : 'bg-neutral-600'}`}
        >
            <motion.div layout className={`w-5 h-5 rounded-full bg-white shadow-md`} />
        </button>
    </div>
);


const SiteConfigPage: React.FC<SiteConfigPageProps> = ({ siteConfig: initialConfig, fetchAdminData }) => {
    const [config, setConfig] = useState<SiteConfig | null>(initialConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        setConfig(initialConfig);
    }, [initialConfig]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!config) return;
        const { id, value } = e.target;
        setConfig({ ...config, [id]: value });
    };

    const handleToggleChange = (label: string, isVisible: boolean) => {
        if (!config) return;
        const updatedLinks = { ...config.visible_links, [label]: isVisible };
        setConfig({ ...config, visible_links: updatedLinks });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!config) return;
        
        setIsSaving(true);
        setMessage(null);

        const updateData: SiteConfigUpdate = {
            site_name: config.site_name,
            logo_url: config.logo_url,
            favicon_url: config.favicon_url,
            visible_links: config.visible_links,
        };

        const { error } = await supabase
            .from('site_config')
            .update(updateData)
            .eq('id', 1);

        if (error) {
            setMessage({ text: `Error saving config: ${error.message}`, type: 'error' });
        } else {
            setMessage({ text: 'Configuration saved successfully!', type: 'success' });
            fetchAdminData(); // Refresh data in AdminLayout
        }

        setIsSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    if (!config) {
        return <div className="text-center text-neutral-400">Loading configuration...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Site Configuration</h1>

            <form onSubmit={handleSave}>
                <motion.div
                    className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="p-6 space-y-6">
                        <h2 className="text-xl font-bold text-violet-300">General Settings</h2>
                        <InputField label="Site Name" id="site_name" value={config.site_name} onChange={handleInputChange} placeholder="e.g., Pixer" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Logo URL" id="logo_url" value={config.logo_url} onChange={handleInputChange} placeholder="https://example.com/logo.svg" />
                            <InputField label="Favicon URL" id="favicon_url" value={config.favicon_url} onChange={handleInputChange} placeholder="https://example.com/favicon.ico" />
                        </div>

                        <hr className="border-t border-white/10" />

                        <h2 className="text-xl font-bold text-violet-300">Sidebar Navigation</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {SIDEBAR_LINKS.map(link => (
                                <ToggleSwitch 
                                    key={link.label}
                                    label={link.label}
                                    enabled={config.visible_links?.[link.label] ?? true}
                                    setEnabled={(isEnabled) => handleToggleChange(link.label, isEnabled)}
                                />
                           ))}
                        </div>
                    </div>
                    
                    <footer className="p-6 bg-black/20 rounded-b-2xl flex items-center justify-between">
                        <motion.button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2 bg-violet-600 text-white font-semibold rounded-md shadow-lg disabled:opacity-50"
                            whileHover={{ scale: isSaving ? 1 : 1.05 }}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
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

export default SiteConfigPage;