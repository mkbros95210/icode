import type { Product, Category, User, Order, FeedItem, Gift, AdminOrder, Coupon, Transaction, SubscriptionPlanDetails } from '../types';

export const MOCK_CATEGORIES: Category[] = [];

export const MOCK_PRODUCTS: Product[] = [];

export const MOCK_USER_PROFILE: User | null = null;

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
    {
        id: 1,
        name: 'Basic plan',
        price: 10,
        description: 'Basic features for up to 10 users.',
        features: [
            'Everything in our free plan plus...',
            'Access to basic features',
            'Basic reporting and analytics',
            'Up to 10 individual users',
            '20GB individual data each user',
            'Basic chat and email support',
        ],
        popular: false,
    },
    {
        id: 2,
        name: 'Business plan',
        price: 20,
        description: 'Growing teams up to 20 users.',
        features: [
            'Everything in Basic plus...',
            'Access to basic features',
            'Basic reporting and analytics',
            'Up to 10 individual users',
            '20GB individual data each user',
            'Basic chat and email support',
        ],
        popular: true,
    },
    {
        id: 3,
        name: 'Enterprise plan',
        price: 40,
        description: 'Advanced features + unlimited users.',
        features: [
            'Everything in Business plus...',
            'Access to basic features',
            'Basic reporting and analytics',
            'Up to 10 individual users',
            '20GB individual data each user',
            'Basic chat and email support',
        ],
        popular: false,
    }
];

export const MOCK_GIFTS: Omit<Gift, 'dateReceived'|'id'>[] = [
    { name: 'Exclusive Icon Pack', description: 'A set of 100 premium, handcrafted icons for your next project.', image: 'https://picsum.photos/seed/gift1/200/200' },
    { name: 'UI Design Masterclass', description: 'Lifetime access to our best-selling UI design video course.', image: 'https://picsum.photos/seed/gift2/200/200' },
    { name: '3D Character Asset', description: 'A fully-rigged 3D character model, ready for animation.', image: 'https://picsum.photos/seed/gift3/200/200' },
    { name: 'Figma Prototyping Kit', description: 'A huge kit of components to speed up your prototyping workflow.', image: 'https://picsum.photos/seed/gift4/200/200' },
    { name: 'Portfolio Website Template', description: 'A stunning, easy-to-customize template to showcase your work.', image: 'https://picsum.photos/seed/gift5/200/200' },
    { name: 'Sound Effects Library', description: 'A collection of high-quality sound effects for apps and games.', image: 'https://picsum.photos/seed/gift6/200/200' },
];

export const MOCK_ORDERS: Order[] = [
    {
        id: '#PIX-83743',
        date: '2024-05-18',
        total: 104.00,
        status: 'Delivered',
        items: [
            { id: 1, title: 'Shoppy E-Commerce UI Kit', image: 'https://picsum.photos/seed/product1/600/400', price: 39.00 },
            { id: 2, title: 'Borobazar Grocery Template', image: 'https://picsum.photos/seed/product2/600/400', price: 65.00 }
        ]
    },
];

export const MOCK_FEED_ITEMS: FeedItem[] = [
    {
        id: 1,
        type: 'new_product',
        author: 'UI-Art',
        authorAvatar: 'https://i.pravatar.cc/40?u=ui-art',
        product: { id: 9, title: 'Mynor - A Modern Serif', image: 'https://picsum.photos/seed/product9/600/400', price: 29.00 },
        title: 'just released a new product!',
        timestamp: '2 hours ago',
    },
    {
        id: 2,
        type: 'author_update',
        author: 'RedQ',
        authorAvatar: 'https://i.pravatar.cc/40?u=redq',
        title: 'posted an update.',
        content: 'Excited to announce we\'re working on a new version of the Borobazar template with even more features! Stay tuned.',
        timestamp: '1 day ago',
    },
    {
        id: 3,
        type: 'trending',
        title: 'is now trending!',
        product: { id: 3, title: 'Cyber-Punk 3D Character', image: 'https://picsum.photos/seed/product3/600/400', price: 89.00 },
        timestamp: '3 days ago',
    },
];

// --- MOCK DATA FOR ADMIN PANEL ---

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
    { id: 'ORD-001', created_at: '2024-07-21T10:30:00Z', user_full_name: 'Jane Doe', user_email: 'jane.doe@example.com', total: 89.00, status: 'Successful', payment_method: 'Credit Card', transaction_id: 'txn_1', items: [{ product_id: 3, product_title: 'Cyber-Punk 3D Character', quantity: 1, price: 89.00 }] },
    { id: 'ORD-002', created_at: '2024-07-21T11:45:00Z', user_full_name: 'John Smith', user_email: 'john.smith@example.com', total: 65.00, status: 'Processing', payment_method: 'PayPal', transaction_id: 'txn_2', items: [{ product_id: 2, product_title: 'Borobazar Grocery Template', quantity: 1, price: 65.00 }] },
    { id: 'ORD-003', created_at: '2024-07-20T15:00:00Z', user_full_name: 'Peter Jones', user_email: 'peter.jones@example.com', total: 39.00, status: 'Failed', payment_method: 'Credit Card', transaction_id: 'txn_3', items: [{ product_id: 1, product_title: 'Shoppy E-Commerce UI Kit', quantity: 1, price: 39.00 }] },
    { id: 'ORD-004', created_at: '2024-07-19T09:10:00Z', user_full_name: 'Jane Doe', user_email: 'jane.doe@example.com', total: 29.00, status: 'Refunded', payment_method: 'Credit Card', transaction_id: 'txn_4', items: [{ product_id: 9, product_title: 'Mynor - A Modern Serif', quantity: 1, price: 29.00 }] },
    { id: 'ORD-005', created_at: '2024-07-22T11:00:00Z', user_full_name: 'Alice Johnson', user_email: 'alice.j@example.com', total: 120.00, status: 'Successful', payment_method: 'PayPal', transaction_id: 'txn_5', items: [{ product_id: 5, product_title: 'NFT-PRO Landing Page', quantity: 2, price: 60.00 }] },
];

export const MOCK_COUPONS: Coupon[] = [
    { id: 1, code: 'SUMMER20', type: 'percentage', value: 20, expires_at: '2024-08-31', active: true },
    { id: 2, code: 'SAVE10', type: 'fixed', value: 10, expires_at: '2024-12-31', active: true },
    { id: 3, code: 'WELCOME5', type: 'fixed', value: 5, expires_at: '2025-01-01', active: false },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'txn_1', order_id: 'ORD-001', user_full_name: 'Jane Doe', amount: 89.00, status: 'Completed', gateway: 'Stripe', created_at: '2024-07-21T10:30:00Z' },
    { id: 'txn_2', order_id: 'ORD-002', user_full_name: 'John Smith', amount: 65.00, status: 'Pending', gateway: 'PayPal', created_at: '2024-07-21T11:45:00Z' },
    { id: 'txn_3', order_id: 'ORD-003', user_full_name: 'Peter Jones', amount: 39.00, status: 'Failed', gateway: 'Stripe', created_at: '2024-07-20T15:00:00Z' },
    { id: 'txn_4', order_id: 'ORD-004', user_full_name: 'Jane Doe', amount: 29.00, status: 'Completed', gateway: 'Stripe', created_at: '2024-07-19T09:10:00Z' },
    { id: 'txn_5', order_id: 'ORD-005', user_full_name: 'Alice Johnson', amount: 120.00, status: 'Completed', gateway: 'PayPal', created_at: '2024-07-22T11:00:00Z' },
];

export const MOCK_ADMIN_CATEGORIES: Category[] = [
    { id: 1, label: 'UI Kits', parent_id: null },
    { id: 2, label: 'Web Templates', parent_id: null },
    { id: 3, label: '3D Assets', parent_id: null },
    { id: 4, label: 'Fonts', parent_id: null },
    { id: 5, label: 'Mobile App UI', parent_id: 1 },
    { id: 6, label: 'Dashboard UI', parent_id: 1 },
    { id: 7, label: 'Landing Pages', parent_id: 2 },
];