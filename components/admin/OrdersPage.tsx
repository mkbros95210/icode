import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { AdminOrder } from '../../types';

interface OrdersPageProps {
    orders: AdminOrder[];
    fetchAdminData: () => void;
}

const getStatusColor = (status: AdminOrder['status']) => {
    switch (status) {
        case 'Successful': return 'bg-green-500/20 text-green-300';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-300';
        case 'Failed': return 'bg-red-500/20 text-red-300';
        case 'Refunded': return 'bg-blue-500/20 text-blue-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
    const [filter, setFilter] = useState<AdminOrder['status'] | 'All'>('All');

    const filteredOrders = useMemo(() => {
        if (filter === 'All') return orders;
        return orders.filter(o => o.status === filter);
    }, [orders, filter]);
    
    const filterOptions: {label: string, value: AdminOrder['status'] | 'All'}[] = [
        { label: 'All', value: 'All' },
        { label: 'Successful', value: 'Successful' },
        { label: 'Processing', value: 'Processing' },
        { label: 'Failed', value: 'Failed' },
        { label: 'Refunded', value: 'Refunded' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
                <div className="flex items-center bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-lg p-1">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilter(opt.value)}
                            className={`relative px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${filter === opt.value ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                        >
                            {filter === opt.value && <motion.div layoutId="order-filter-active" className="absolute inset-0 bg-violet-600/50 rounded-md" />}
                            <span className="relative z-10">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">
                                    <div>{order.user_full_name}</div>
                                    <div className="text-xs text-neutral-500">{order.user_email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">₹{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-400 hover:text-indigo-300">
                                    <button>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;
