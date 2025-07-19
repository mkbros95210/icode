import React from 'react';
import { motion } from 'framer-motion';
import { DollarSignIcon } from '@/constants';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <motion.div 
        className="bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex items-center space-x-4 shadow-lg"
        whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
    >
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-lg text-white">
            {icon}
        </div>
        <div>
            <p className="text-neutral-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
);


const IncomePage: React.FC = () => {
    // Mock data for demonstration
    const incomeStats = {
        today: 450.75,
        thisWeek: 2890.50,
        thisMonth: 12540.00,
        total: 52458.00,
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Income</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Today's Income" value={`₹${incomeStats.today.toLocaleString()}`} icon={<DollarSignIcon className="w-6 h-6"/>} />
                <StatCard title="This Week's Income" value={`₹${incomeStats.thisWeek.toLocaleString()}`} icon={<DollarSignIcon className="w-6 h-6"/>} />
                <StatCard title="This Month's Income" value={`₹${incomeStats.thisMonth.toLocaleString()}`} icon={<DollarSignIcon className="w-6 h-6"/>} />
                <StatCard title="Total Revenue" value={`₹${incomeStats.total.toLocaleString()}`} icon={<DollarSignIcon className="w-6 h-6"/>} />
            </div>
            <div className="mt-8 bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 min-h-[300px] flex items-center justify-center">
                <p className="text-neutral-500">Detailed income report chart coming soon...</p>
            </div>
        </div>
    );
};

export default IncomePage;
