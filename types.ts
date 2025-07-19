



import React from 'react';

export interface NavLink {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface Category {
  id: number;
  label: string;
  parent_id?: number | null;
}

export interface Product {
  id: number;
  created_at: string;
  title: string;
  author: string;
  author_id: string;
  authorAvatar: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  category_id: number;
  isNew?: boolean;
  description: string;
  details: string[];
  preview_url?: string | null;
  video_url?: string | null;
  gift_url?: string | null;
  download_url?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type SubscriptionPlan = 'none' | 'standard' | 'premium';

export interface SubscriptionPlanDetails {
    id: number;
    name: string;
    price: number;
    description: string;
    features: string[];
    popular: boolean;
}


// This is our app-specific user profile
export interface User {
  id: string; // UUID from Supabase auth
  email?: string;
  full_name?: string;
  avatar_url?: string;
  username?: string;
  role?: 'admin' | 'user' | null;
  subscription_plan?: SubscriptionPlan;
  has_made_first_order?: boolean;
  // Below are properties from the old mock user, can be added to profiles table
  memberSince?: string;
  totalSpent?: number;
  totalPurchases?: number;
}


export interface Gift {
    id: number;
    name: string;
    description: string;
    image: string;
    dateReceived: string; // ISO string
}

export interface AcquiredProduct extends Product {
    acquiredDate: string; // ISO string
}


export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Cancelled';
  items: Pick<Product, 'id' | 'title' | 'image' | 'price'>[];
}

export interface FeedItem {
    id: number;
    type: 'new_product' | 'author_update' | 'trending';
    author?: string;
    authorAvatar?: string;
    product?: Pick<Product, 'id'| 'title'|'image'|'price'>;
    title: string;
    timestamp: string;
    content?: string;
}

export interface Banner {
    id: number;
    name: string;
    is_active: boolean;
    image_url: string;
    redirect_url: string | null;
    display_pages: string[];
    is_default: boolean;
    excluded_pages: string[];
    position: 'top-of-page' | 'bottom-of-page';
    height_desktop: string | null;
    height_tablet: string | null;
    height_mobile: string | null;
    border_radius: string | null;
    opacity: number;
    animation_type: 'none' | 'fade-in' | 'slide-in-top' | 'pulse';
    created_at: string;
}

export interface PaymentGateway {
    id: number;
    name: string;
    is_enabled: boolean;
    key_id: string | null;
    key_secret: string | null;
    merchant_id: string | null;
    salt_key: string | null;
    updated_at: string | null;
}

// --- Admin Panel Specific Types ---

export interface AdminOrder {
  id: string;
  created_at: string;
  user_full_name: string;
  user_email: string;
  total: number;
  status: 'Successful' | 'Processing' | 'Failed' | 'Refunded';
  payment_method: 'Credit Card' | 'PayPal' | 'Crypto';
  transaction_id: string;
  items: {
      product_id: number;
      product_title: string;
      quantity: number;
      price: number;
  }[];
}

export interface Coupon {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    expires_at: string;
    active: boolean;
}

export interface Transaction {
    id: string;
    order_id: string;
    user_full_name: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    gateway: 'Stripe' | 'PayPal';
    created_at: string;
}

export interface SiteConfig {
    id: number;
    site_name: string;
    logo_url: string | null;
    favicon_url: string | null;
    visible_links: {
        [key: string]: boolean;
    } | null;
}

declare global {
    interface Window {
        Razorpay: any;
    }
}