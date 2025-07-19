import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsPage: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div 
                    className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[300px] flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                >
                    <p className="text-neutral-500">User Growth Chart Coming Soon...</p>
                </motion.div>
                <motion.div 
                    className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[300px] flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                >
                    <p className="text-neutral-500">Sales Over Time Chart Coming Soon...</p>
                </motion.div>
                <motion.div 
                    className="lg:col-span-2 bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[200px] flex items-center justify-center shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                >
                    <p className="text-neutral-500">Top Products by Revenue Coming Soon...</p>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
