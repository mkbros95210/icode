
import { createClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      acquired_products: {
        Row: {
          acquired_date: string
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          acquired_date: string
          id?: number
          product_id: number
          user_id: string
        }
        Update: {
          acquired_date?: string
          id?: number
          product_id?: number
          user_id?: string
        }
      }
      banners: {
        Row: {
          animation_type: string
          border_radius: string | null
          created_at: string
          display_pages: string[]
          excluded_pages: string[]
          height_desktop: string | null
          height_mobile: string | null
          height_tablet: string | null
          id: number
          image_url: string
          is_active: boolean
          is_default: boolean
          name: string
          opacity: number
          position: string
          redirect_url: string | null
        }
        Insert: {
          animation_type?: string
          border_radius?: string | null
          created_at?: string
          display_pages?: string[]
          excluded_pages?: string[]
          height_desktop?: string | null
          height_mobile?: string | null
          height_tablet?: string | null
          id?: number
          image_url: string
          is_active?: boolean
          is_default?: boolean
          name: string
          opacity?: number
          position?: string
          redirect_url?: string | null
        }
        Update: {
          animation_type?: string
          border_radius?: string | null
          created_at?: string
          display_pages?: string[]
          excluded_pages?: string[]
          height_desktop?: string | null
          height_mobile?: string | null
          height_tablet?: string | null
          id?: number
          image_url?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          opacity?: number
          position?: string
          redirect_url?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          label: string
          parent_id: number | null
        }
        Insert: {
          id?: number
          label: string
          parent_id?: number | null
        }
        Update: {
          id?: number
          label?: string
          parent_id?: number | null
        }
      }
      gifts: {
        Row: {
          date_received: string
          description: string
          id: number
          image: string
          name: string
          user_id: string
        }
        Insert: {
          date_received: string
          description: string
          id?: number
          image: string
          name: string
          user_id: string
        }
        Update: {
          date_received?: string
          description?: string
          id?: number
          image?: string
          name?: string
          user_id?: string
        }
      }
      payment_gateways: {
        Row: {
          id: number
          is_enabled: boolean
          key_id: string | null
          key_secret: string | null
          merchant_id: string | null
          name: string
          salt_key: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          is_enabled: boolean
          key_id?: string | null
          key_secret?: string | null
          merchant_id?: string | null
          name: string
          salt_key?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          is_enabled?: boolean
          key_id?: string | null
          key_secret?: string | null
          merchant_id?: string | null
          name?: string
          salt_key?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          author_id: string
          category_id: number
          created_at: string
          description: string
          details: string[]
          download_url: string | null
          gift_url: string | null
          id: number
          image: string
          is_new: boolean
          old_price: number | null
          preview_url: string | null
          price: number
          title: string
          video_url: string | null
        }
        Insert: {
          author_id: string
          category_id: number
          created_at?: string
          description: string
          details: string[]
          download_url?: string | null
          gift_url?: string | null
          id?: number
          image: string
          is_new?: boolean
          old_price?: number | null
          preview_url?: string | null
          price: number
          title: string
          video_url?: string | null
        }
        Update: {
          author_id?: string
          category_id?: number
          created_at?: string
          description?: string
          details?: string[]
          download_url?: string | null
          gift_url?: string | null
          id?: number
          image?: string
          is_new?: boolean
          old_price?: number | null
          preview_url?: string | null
          price?: number
          title?: string
          video_url?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          has_made_first_order: boolean
          id: string
          member_since: string | null
          role: "user" | "admin" | null
          subscription_plan: "none" | "standard" | "premium"
          total_purchases: number | null
          total_spent: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          has_made_first_order?: boolean
          id: string
          member_since?: string | null
          role?: "user" | "admin" | null
          subscription_plan?: "none" | "standard" | "premium"
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          has_made_first_order?: boolean
          id?: string
          member_since?: string | null
          role?: "user" | "admin" | null
          subscription_plan?: "none" | "standard" | "premium"
          total_purchases?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
        }
      }
      site_config: {
        Row: {
          favicon_url: string | null
          id: number
          logo_url: string | null
          site_name: string
          visible_links: Json | null
        }
        Insert: {
          favicon_url?: string | null
          id?: number
          logo_url?: string | null
          site_name: string
          visible_links?: Json | null
        }
        Update: {
          favicon_url?: string | null
          id?: number
          logo_url?: string | null
          site_name?: string
          visible_links?: Json | null
        }
      }
      subscription_plans: {
        Row: {
          description: string
          features: string[]
          id: number
          name: string
          popular: boolean
          price: number
        }
        Insert: {
          description: string
          features: string[]
          id?: number
          name: string
          popular: boolean
          price: number
        }
        Update: {
          description?: string
          features?: string[]
          id?: number
          name?: string
          popular?: boolean
          price?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}


// Use the provided Supabase credentials directly.
const supabaseUrl = 'https://jalxhakdguqaejbwuwlu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphbHhoYWtkZ3VxYWVqYnd1d2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTY0NDgsImV4cCI6MjA2ODQzMjQ0OH0.CfsZrICUcQqnbeZZiRzzW4ZqE9HVD_Pb64ccJOK-oug';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);