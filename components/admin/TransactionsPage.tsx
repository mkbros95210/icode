import React, { useState, useMemo } from 'react';
import type { Transaction } from '../../types';

interface TransactionsPageProps {
    transactions: Transaction[];
}

const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
        case 'Completed': return 'bg-green-500/20 text-green-300';
        case 'Pending': return 'bg-yellow-500/20 text-yellow-300';
        case 'Failed': return 'bg-red-500/20 text-red-300';
        default: return 'bg-gray-500/20 text-gray-300';
    }
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = useMemo(() => {
        if (!searchTerm) return transactions;
        const lowercasedFilter = searchTerm.toLowerCase();
        return transactions.filter(t =>
            t.id.toLowerCase().includes(lowercasedFilter) ||
            t.order_id.toLowerCase().includes(lowercasedFilter) ||
            t.user_full_name.toLowerCase().includes(lowercasedFilter)
        );
    }, [transactions, searchTerm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Transactions</h1>
                <input
                    type="text"
                    placeholder="Search by ID, Order ID, Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs bg-[#1A1527]/70 p-2 rounded-lg border border-white/20 focus:ring-2 focus:ring-violet-500 focus:outline-none text-white"
                />
            </div>
            <div className="overflow-x-auto bg-[#1A1527]/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg shadow-black/5">
                <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-black/20">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Amount</th>
                             <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Gateway</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-black/10 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white font-mono">{t.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{t.order_id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{t.user_full_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">₹{t.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{t.gateway}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-300">{new Date(t.created_at).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(t.status)}`}>
                                        {t.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsPage;
