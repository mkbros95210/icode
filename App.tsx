


import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ProductDetailPage from './components/ProductDetailPage';
import AdminLayout from './components/admin/AdminLayout';
import AuroraBackground from './components/AuroraBackground';
import BottomNavBar from './components/BottomNavBar';
import { supabase } from './lib/supabase';

import { SIDEBAR_LINKS, SETTINGS_LINKS } from './constants';
import { 
  ExplorePage, 
  PopularProductsPage, 
  TopAuthorsPage, 
  FeedPage, 
  ContactPage, 
  SettingsPage, 
  HelpPage,
  ProfilePage,
  TermsPage,
  PrivacyPage,
  SubscriptionPage,
  AccessDeniedPage
} from './components/pages';
import { useSearch } from './components/SearchContext';
import { useCart } from './components/CartContext';
import { useUser } from './components/UserContext';
import type { Product, Category, SiteConfig, Banner, PaymentGateway } from './types';


const App: React.FC = () => {
  const [activeLink, setActiveLink] = useState('Home');
  const [activeCategory, setActiveCategory] = useState('All');
  const [route, setRoute] = useState(window.location.hash || '#/Home');
  const { isCartOpen, setIsCartOpen } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { searchQuery, setSearchQuery } = useSearch();
  const [theme, setTheme] = useState(localStorage.getItem('pixer-theme') || 'dark');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: userLoading } = useUser();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(prev => !prev);


  useEffect(() => {
    const fetchInitialData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch Site Config
            const { data: configData, error: configError } = await supabase
                .from('site_config')
                .select('*')
                .eq('id', 1)
                .single();
            if (configError) throw new Error(`Failed to load site configuration: ${configError.message}`);
            setSiteConfig(configData as SiteConfig);

            // Fetch Banners
            const { data: bannersData, error: bannersError } = await supabase
                .from('banners')
                .select('*')
                .eq('is_active', true);
            if (bannersError) throw bannersError;
            setBanners(bannersData as Banner[]);

            // Fetch Enabled Payment Gateways
            const { data: gatewaysData, error: gatewaysError } = await supabase
                .from('payment_gateways')
                .select('*')
                .eq('is_enabled', true);
            if (gatewaysError) throw gatewaysError;
            setPaymentGateways(gatewaysData as PaymentGateway[]);

            // Fetch Categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from('categories')
                .select('id, label')
                .order('id');
            if (categoriesError) throw categoriesError;
            setCategories([{ id: 0, label: 'All' }, ...(categoriesData as Category[])]);


            // Fetch Products with relations
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select(`
                    id, created_at, title, price, old_price, image, is_new, description, details,
                    preview_url, video_url, gift_url, download_url,
                    category_id,
                    categories ( label ),
                    author_id,
                    author:profiles!author_id ( full_name, avatar_url )
                `)
                .order('created_at', { ascending: false });

            if (productsError) throw productsError;

            const mappedProducts: Product[] = productsData.map((p: any) => ({
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
                author: p.author?.full_name ?? 'Unknown Author',
                authorAvatar: p.author?.avatar_url ?? '',
                preview_url: p.preview_url,
                video_url: p.video_url,
                gift_url: p.gift_url,
                download_url: p.download_url,
            }));
            
            setProducts(mappedProducts);

        } catch (err: any) {
            console.error("Error fetching data details:", err);
            const errorMessage = (err && err.message) ? err.message : 'An unknown error occurred while fetching data from Supabase.';
            setError(`Error fetching data: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (siteConfig?.site_name) {
        document.title = siteConfig.site_name;
    }
    if (siteConfig?.favicon_url) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = siteConfig.favicon_url;
    }
  }, [siteConfig]);


  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pixer-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pixer-theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/Home';
      setRoute(hash);
      const linkName = hash.split('/')[1] || 'Home';
      setActiveLink(decodeURIComponent(linkName));
      
      if (!hash.startsWith('#/Home') && !hash.startsWith('#/product') && !hash.startsWith('#/Admin')) {
          setSearchQuery('');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setSearchQuery]);
  
  const filteredProducts = products
    .filter(p => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        );
      })
    .filter(p => {
        if (activeCategory === 'All') return true;
        return p.category === activeCategory;
    });

  const renderContent = () => {
    if (error) {
        return <div className="lg:ml-64 p-8 text-red-500 text-center">{error}</div>
    }
    
    const path = route.split('/'); // e.g., ['#', 'product', '1']
    
    if (path[1] === 'product' && path[2]) {
        const productId = parseInt(path[2], 10);
        const product = products.find(p => p.id === productId);
        if (product) {
            return <ProductDetailPage key={`product-${productId}`} product={product} allProducts={products} theme={theme} toggleTheme={toggleTheme} onToggleSidebar={toggleMobileSidebar} banners={banners} />;
        }
    }

    const pageProps = { key: path[1], theme, toggleTheme, onToggleSidebar: toggleMobileSidebar, banners };

    switch (path[1]) {
        case 'Home':
            return (
                <MainContent
                    {...pageProps}
                    activeCategory={activeCategory}
                    onCategoryClick={setActiveCategory}
                    categories={categories}
                    products={filteredProducts}
                    loading={loading}
                />
            );
        case 'Explore': return <ExplorePage {...pageProps} products={products} />;
        case 'Popular%20Products': return <PopularProductsPage {...pageProps} products={products} />;
        case 'Top%20Authors': return <TopAuthorsPage {...pageProps} products={products} />;
        case 'Feed': return <FeedPage {...pageProps} />;
        case 'Subscriptions': return <SubscriptionPage {...pageProps} />;
        case 'Contact': return <ContactPage {...pageProps} />;
        case 'Profile': return <ProfilePage {...pageProps} />;
        case 'Settings': return <SettingsPage {...pageProps} />;
        case 'Help': return <HelpPage {...pageProps} />;
        case 'Terms': return <TermsPage {...pageProps} />;
        case 'Privacy': return <PrivacyPage {...pageProps} />;
        default:
            // This now correctly defaults to home if the route is not matched
            if (path[1] && path[1] !== 'Admin') {
                 window.location.hash = '#/Home';
            }
            return (
                <MainContent
                    {...pageProps}
                    key="home-default"
                    activeCategory={activeCategory}
                    onCategoryClick={setActiveCategory}
                    categories={categories}
                    products={filteredProducts}
                    loading={loading}
                />
            );
    }
  };
  
  // Top-level router for Admin section
  if (route.startsWith('#/Admin')) {
      return (
          <div className="bg-black">
              <AuroraBackground theme={theme} />
              <AnimatePresence mode="wait">
                {userLoading ? (
                    <motion.div key="admin-loader" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-violet-500"></div>
                    </motion.div>
                ) : isAdmin ? (
                    <AdminLayout key="admin-panel" theme={theme} toggleTheme={toggleTheme} route={route} />
                ) : (
                    <AccessDeniedPage key="access-denied" />
                )}
              </AnimatePresence>
          </div>
      );
  }

  return (
    <div className="flex min-h-screen bg-transparent relative transition-colors duration-300">
      <AuroraBackground theme={theme} />
      <Sidebar 
        activeLink={activeLink}
        links={SIDEBAR_LINKS} 
        settingsLinks={SETTINGS_LINKS}
        siteConfig={siteConfig}
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
       <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
       <Checkout isOpen={isCheckoutOpen} setIsOpen={setIsCheckoutOpen} paymentGateways={paymentGateways} siteConfig={siteConfig} />
       <BottomNavBar activeLink={activeLink} />

      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
            {renderContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;