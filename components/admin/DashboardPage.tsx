
import React from 'react';
import { motion } from 'framer-motion';
import { DashboardIcon, ProductsIcon, UserIcon, CrownIcon } from '../../constants';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <motion.div 
        className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center space-x-4 shadow-lg shadow-black/5"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
    >
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-3 rounded-lg text-white">
            {icon}
        </div>
        <div>
            <p className="text-neutral-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);

const DashboardPage: React.FC<{ stats: any }> = ({ stats }) => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<DashboardIcon className="w-6 h-6"/>} />
            <StatCard title="Total Users" value={stats.users} icon={<UserIcon className="w-6 h-6"/>} />
            <StatCard title="Total Products" value={stats.products} icon={<ProductsIcon className="w-6 h-6"/>} />
            <StatCard title="Subscriptions" value={stats.subscriptions} icon={<CrownIcon className="w-6 h-6"/>} />
        </div>
        {/* Placeholder for future charts or activity feeds */}
        <div className="mt-8 bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
            <p className="text-neutral-500">Analytics charts coming soon...</p>
        </div>
    </div>
);

export default DashboardPage;
