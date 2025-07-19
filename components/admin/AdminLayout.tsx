








import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, User as UserType, Category, AdminOrder, Coupon, Transaction, SubscriptionPlanDetails, SiteConfig, Banner } from '../../types';
import { supabase } from '../../lib/supabase';
import { MOCK_ADMIN_ORDERS, MOCK_COUPONS, MOCK_TRANSACTIONS, SUBSCRIPTION_PLANS } from '../mock-data';

import AdminSidebar from './AdminSidebar';
import DashboardPage from './DashboardPage';
import ProductsPage from './ProductsPage';
import UsersPage from './UsersPage';
import AnalyticsPage from './AnalyticsPage';
import CategoriesPage from './CategoriesPage';
import CouponsPage from './CouponsPage';
import IncomePage from './IncomePage';
import OrdersPage from './OrdersPage';
import AdminSettingsPage from './SettingsPage';
import SubscriptionsPage from './SubscriptionsPage';
import TransactionsPage from './TransactionsPage';
import SiteConfigPage from './SiteConfigPage';
import BannersPage from './BannersPage';
import { MenuIcon } from '../../constants';


interface AdminLayoutProps {
    theme: string;
    toggleTheme: () => void;
    route: string;
}

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
} as const;


const AdminLayout: React.FC<AdminLayoutProps> = ({ route }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [stats, setStats] = useState({ revenue: 0, users: 0, products: 0, subscriptions: 0 });
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanDetails[]>(SUBSCRIPTION_PLANS);
    const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
    const [coupons, setCoupons] = useState<Coupon[]>(MOCK_COUPONS);
    const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    
    const fetchAdminData = async () => {
        setLoadingData(true);
        setError('');
        try {
            const [productsCount, usersData, productsData, categoriesData, plansData, configData, bannersData] = await Promise.all([
                supabase.from('products').select('id', { count: 'exact', head: true }),
                supabase.from('profiles').select('*'),
                supabase.from('products').select(`
                    id, created_at, title, price, old_price, image, is_new, description, details,
                    preview_url, video_url, gift_url, download_url,
                    category_id,
                    categories ( label ),
                    author_id,
                    author:profiles!author_id ( full_name, avatar_url )
                `).order('id', { ascending: true }),
                supabase.from('categories').select('id, label, parent_id').order('id', { ascending: true }),
                supabase.from('subscription_plans').select('*'),
                supabase.from('site_config').select('*').eq('id', 1).single(),
                supabase.from('banners').select('*').order('created_at', { ascending: false }),
            ]);

            if (productsCount.error) throw productsCount.error;
            if (usersData.error) throw usersData.error;
            if (productsData.error) throw productsData.error;
            if (categoriesData.error) throw categoriesData.error;
            if (plansData.error) throw plansData.error;
            if (configData.error) throw new Error(`Site config fetch failed: ${configData.error.message}`);
            if (bannersData.error) throw bannersData.error;

            setStats({
                revenue: 52458, // Mock data
                products: productsCount.count || 0,
                users: usersData.data.length,
                subscriptions: usersData.data.filter(u => u.subscription_plan !== 'none').length
            });
            
            setUsers(usersData.data as UserType[]);
            setCategories(categoriesData.data as Category[]);
            setSubscriptionPlans(plansData.data as SubscriptionPlanDetails[]);
            setSiteConfig(configData.data as SiteConfig);
            setBanners(bannersData.data as Banner[]);

            const mappedProducts: Product[] = productsData.data.map((p: any) => ({
                id: p.id,
                created_at: p.created_at,
                title: p.title,
                price: p.price,
                oldPrice: p.old_price,
                image: p.image,
                isNew: p.is_new,
                description: p.description,
                details: p.details,
                category: p.categories?.label ?? 'Uncategorized',
                category_id: p.category_id,
                author_id: p.author_id,
                author: p.author?.full_name ?? 'Unknown',
                authorAvatar: p.author?.avatar_url ?? '',
                preview_url: p.preview_url,
                video_url: p.video_url,
                gift_url: p.gift_url,
                download_url: p.download_url,
            }));
            setProducts(mappedProducts);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingData(false);
        }
    };
    
    useEffect(() => {
        fetchAdminData();
    }, []);


    const getActiveTabFromRoute = () => {
        const path = route.split('/')[2];
        const validTabs = ['Dashboard', 'Analytics', 'Income', 'Orders', 'Transactions', 'Products', 'Categories', 'Users', 'Subscriptions', 'Coupons', 'Banners', 'Site%20Config', 'Settings'];
        
        const decodedPath = decodeURIComponent(path || '');

        if (decodedPath && validTabs.map(t => decodeURIComponent(t)).includes(decodedPath)) {
            return decodedPath;
        }
        return 'Dashboard';
    };

    const activeTab = getActiveTabFromRoute();
    
    const renderContent = () => {
        if (loadingData) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div></div>;
        if (error) return <div className="text-red-500 p-8">{error}</div>;

        switch (activeTab) {
            case 'Dashboard': return <DashboardPage stats={stats} />;
            case 'Analytics': return <AnalyticsPage />;
            case 'Income': return <IncomePage />;
            case 'Orders': return <OrdersPage orders={orders} fetchAdminData={fetchAdminData} />;
            case 'Transactions': return <TransactionsPage transactions={transactions} />;
            case 'Products': return <ProductsPage products={products} categories={categories} users={users} fetchAdminData={fetchAdminData} />;
            case 'Categories': return <CategoriesPage categories={categories} fetchAdminData={fetchAdminData} />;
            case 'Users': return <UsersPage users={users} fetchAdminData={fetchAdminData} />;
            case 'Subscriptions': return <SubscriptionsPage users={users} plans={subscriptionPlans} fetchAdminData={fetchAdminData} />;
            case 'Coupons': return <CouponsPage coupons={coupons} fetchAdminData={fetchAdminData} />;
            case 'Banners': return <BannersPage banners={banners} fetchAdminData={fetchAdminData} />;
            case 'Site Config': return <SiteConfigPage siteConfig={siteConfig} fetchAdminData={fetchAdminData} />;
            case 'Settings': return <AdminSettingsPage />;
            default: return <DashboardPage stats={stats} />;
        }
    }
    
    return (
        <motion.div
            className="flex min-h-screen relative z-10"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <AdminSidebar 
                activeTab={activeTab} 
                isMobileOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />
            <main className="flex-1 lg:ml-64 p-4 sm:p-8 overflow-y-auto">
                 <button 
                    className="lg:hidden text-white mb-4" 
                    onClick={() => setIsMobileSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    <MenuIcon className="w-6 h-6"/>
                </button>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </motion.div>
    );
};

export default AdminLayout;