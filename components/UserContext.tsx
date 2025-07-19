import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User, SubscriptionPlan, AcquiredProduct, Gift, CartItem, Product } from '../types';
import { supabase, type Database } from '../lib/supabase';
import type { AuthError, Session } from '@supabase/supabase-js';

type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
type AcquiredProductInsert = Database['public']['Tables']['acquired_products']['Insert'];
type GiftInsert = Database['public']['Tables']['gifts']['Insert'];


// Define the context type
interface UserContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, pass: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, pass: string, username: string) => Promise<{ error: AuthError | null }>;
    loginWithGitHub: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (updates: ProfileUpdate) => Promise<{ error: any }>;
    subscriptionPlan: SubscriptionPlan;
    hasMadeFirstOrder: boolean;
    acquiredProducts: AcquiredProduct[];
    gifts: Gift[];
    addAcquiredProducts: (products: (Product | CartItem)[]) => void;
    addGift: (gift: Omit<Gift, 'id' | 'dateReceived'>) => void;
    setHasMadeFirstOrder: () => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);


// Create the provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    // These states are now derived from the 'user' object but kept for component compatibility
    const [acquiredProducts, setAcquiredProducts] = useState<AcquiredProduct[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    
    const isAdmin = user?.role === 'admin';
    const subscriptionPlan = user?.subscription_plan || 'none';
    const hasMadeFirstOrder = user?.has_made_first_order || false;

    useEffect(() => {
        const fetchSessionAndProfile = async (session: Session | null) => {
            if (session?.user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    setUser(null);
                } else if (profile) {
                    const appUser: User = {
                        id: session.user.id,
                        email: session.user.email,
                        full_name: profile.full_name,
                        avatar_url: profile.avatar_url,
                        username: profile.username,
                        role: profile.role,
                        subscription_plan: profile.subscription_plan,
                        has_made_first_order: profile.has_made_first_order,
                        memberSince: profile.member_since,
                        totalSpent: profile.total_spent,
                        totalPurchases: profile.total_purchases,
                    };
                    setUser(appUser);
                    // Fetch related data
                    fetchUserSubData(appUser.id);
                }
            } else {
                setUser(null);
                setAcquiredProducts([]);
                setGifts([]);
            }
            setLoading(false);
        };
        
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchSessionAndProfile(session);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchSessionAndProfile(session);
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);
    
    const fetchUserSubData = async (userId: string) => {
        // Fetch acquired products
        const { data: productsData, error: productsError } = await supabase
            .from('acquired_products')
            .select(`
                acquired_date,
                products (
                    id, created_at, title, price, old_price, image, is_new, description, details,
                    preview_url, video_url, gift_url, download_url,
                    category_id,
                    categories ( label ),
                    author_id,
                    author:profiles!author_id ( full_name, avatar_url )
                )
            `)
            .eq('user_id', userId);

        if (productsError) console.error("Error fetching acquired products:", productsError);
        else if (productsData) {
             const mappedProducts: AcquiredProduct[] = productsData
             .filter((item: any) => !!item.products)
             .map((item: any) => {
                const p = item.products!; // safe due to filter
                return {
                    id: p.id,
                    created_at: p.created_at,
                    title: p.title,
                    author: (p.author as any)?.full_name ?? 'Unknown Author',
                    author_id: p.author_id,
                    authorAvatar: (p.author as any)?.avatar_url ?? '',
                    price: p.price,
                    oldPrice: p.old_price,
                    image: p.image,
                    category: (p.categories as any)?.label ?? 'Uncategorized',
                    category_id: p.category_id,
                    isNew: p.is_new,
                    description: p.description,
                    details: p.details,
                    acquiredDate: item.acquired_date,
                    preview_url: p.preview_url,
                    video_url: p.video_url,
                    gift_url: p.gift_url,
                    download_url: p.download_url,
                };
             });
            setAcquiredProducts(mappedProducts);
        }
        
        // Fetch gifts
        const { data: giftsData, error: giftsError } = await supabase
            .from('gifts')
            .select('*')
            .eq('user_id', userId);
        if (giftsError) console.error("Error fetching gifts:", giftsError);
        else if (giftsData) setGifts(giftsData.map(g => ({...g, dateReceived: g.date_received})));
    };

    const login = async (email: string, pass: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        setLoading(false);
        return { error };
    };

    const signUp = async (email: string, pass: string, username: string) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password: pass,
            options: {
                data: {
                    username: username,
                    full_name: username, // Default full_name to username on signup
                }
            }
        });
        setLoading(false);
        return { error };
    };
    
    const loginWithGitHub = async () => {
        await supabase.auth.signInWithOAuth({ provider: 'github' });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateProfile = async (updates: ProfileUpdate) => {
        if (!user) return { error: 'No user logged in' };
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (data) {
             // data is ProfileRow (snake_case), user state is User (camelCase). Map the fields.
             const mappedData: Partial<User> = {
                avatar_url: data.avatar_url,
                full_name: data.full_name,
                has_made_first_order: data.has_made_first_order,
                id: data.id,
                memberSince: data.member_since,
                role: data.role,
                subscription_plan: data.subscription_plan,
                totalPurchases: data.total_purchases,
                totalSpent: data.total_spent,
                username: data.username,
             };
             setUser(currentUser => currentUser ? { ...currentUser, ...mappedData } : null);
        }
        return { error };
    };

    const addAcquiredProducts = async (products: (Product | CartItem)[]) => {
        if (!user) return;
        const newProducts: AcquiredProductInsert[] = products.map(p => ({
            user_id: user.id,
            product_id: p.id,
            acquired_date: new Date().toISOString(),
        }));
        await supabase.from('acquired_products').insert(newProducts);
        // Refresh data
        fetchUserSubData(user.id);
    };

    const addGift = async (gift: Omit<Gift, 'id' | 'dateReceived'>) => {
        if (!user) return;
        const newGift: GiftInsert = {
            ...gift,
            user_id: user.id,
            date_received: new Date().toISOString(),
        };
        await supabase.from('gifts').insert([newGift]);
        // Refresh data
        fetchUserSubData(user.id);
    };

    const setHasMadeFirstOrder = async () => {
        if (!user) return;
        const updateData: ProfileUpdate = { has_made_first_order: true };
        await supabase.from('profiles').update(updateData).eq('id', user.id);
        setUser(currentUser => currentUser ? { ...currentUser, has_made_first_order: true } : null);
    };

    const value: UserContextType = {
        user,
        loading,
        isAdmin,
        login,
        signUp,
        loginWithGitHub,
        logout,
        updateProfile,
        subscriptionPlan,
        hasMadeFirstOrder,
        acquiredProducts,
        gifts,
        addAcquiredProducts,
        addGift,
        setHasMadeFirstOrder
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Create the custom hook to use the context
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};