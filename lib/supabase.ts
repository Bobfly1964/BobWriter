import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client (for browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          description: string | null
          is_private: boolean
          last_updated: string
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          is_private?: boolean
          last_updated?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          is_private?: boolean
          last_updated?: string
          created_at?: string
          user_id?: string
        }
      }
      readers: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }
      book_readers: {
        Row: {
          book_id: string
          reader_id: string
          created_at: string
        }
        Insert: {
          book_id: string
          reader_id: string
          created_at?: string
        }
        Update: {
          book_id?: string
          reader_id?: string
          created_at?: string
        }
      }
    }
  }
} 