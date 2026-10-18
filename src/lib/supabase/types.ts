export type Json = string | number | boolean | null | {
  [key: string]: Json | undefined
} | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          email: string | null
          avatar_url: string | null
          bio: string | null
          phone: string | null
          level: string
          points: number
          badges: Json
          created_at: string
          updated_at: string
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Insert: {
          id: string
          display_name: string
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          level?: string
          points?: number
          badges?: Json
          created_at?: string
          updated_at?: string
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
        }
        Update: {
          id?: string
          display_name?: string
          email?: string | null
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          level?: string
          points?: number
          badges?: Json
          created_at?: string
          updated_at?: string
          location_name?: string | null
          latitude?: number | null
          longitude?: number | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          description: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          icon?: string | null
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          description?: string | null
          display_order?: number
          created_at?: string
        }
      }
      places: {
        Row: {
          id: string
          name: string
          image: string
          cover_image: string | null
          rating: number
          review_count: number
          address: string
          district: string
          city: string
          category_id: string | null
          badge: string | null
          badge_color: string | null
          price_range: string | null
          hours: string | null
          phone: string | null
          story: string | null
          tags: string[]
          amenities: Json
          menu_items: Json
          latitude: number | null
          longitude: number | null
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          image: string
          cover_image?: string | null
          rating?: number
          review_count?: number
          address: string
          district: string
          city?: string
          category_id?: string | null
          badge?: string | null
          badge_color?: string | null
          price_range?: string | null
          hours?: string | null
          phone?: string | null
          story?: string | null
          tags?: string[]
          amenities?: Json
          menu_items?: Json
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string
          cover_image?: string | null
          rating?: number
          review_count?: number
          address?: string
          district?: string
          city?: string
          category_id?: string | null
          badge?: string | null
          badge_color?: string | null
          price_range?: string | null
          hours?: string | null
          phone?: string | null
          story?: string | null
          tags?: string[]
          amenities?: Json
          menu_items?: Json
          latitude?: number | null
          longitude?: number | null
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string[]
          quote_text: string | null
          quote_author: string | null
          cover_image: string
          category: "review" | "culture" | "guide" | "couple"
          category_label: string
          tags: string[]
          author_name: string
          author_avatar: string
          author_role: string
          published_at: string
          read_time: string
          related_place_id: string | null
          views: number
          likes: number
          is_featured: boolean
          created_at: string
          updated_at: string
          recommended_dish?: string | null
          cost_per_person?: string | null
          user_id?: string | null
        }
        Insert: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string[]
          quote_text?: string | null
          quote_author?: string | null
          cover_image: string
          category: "review" | "culture" | "guide" | "couple"
          category_label: string
          tags?: string[]
          author_name: string
          author_avatar: string
          author_role?: string
          published_at?: string
          read_time?: string
          related_place_id?: string | null
          views?: number
          likes?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          recommended_dish?: string | null
          cost_per_person?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          content?: string[]
          quote_text?: string | null
          quote_author?: string | null
          cover_image?: string
          category?: "review" | "culture" | "guide" | "couple"
          category_label?: string
          tags?: string[]
          author_name?: string
          author_avatar?: string
          author_role?: string
          published_at?: string
          read_time?: string
          related_place_id?: string | null
          views?: number
          likes?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
          recommended_dish?: string | null
          cost_per_person?: string | null
          user_id?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          place_id: string
          user_id: string | null
          author_name: string
          author_avatar: string | null
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          place_id: string
          user_id?: string | null
          author_name: string
          author_avatar?: string | null
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string | null
          author_name?: string
          author_avatar?: string | null
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      schedules: {
        Row: {
          id: string
          user_id: string | null
          place_id: string
          scheduled_date: string
          time_slot: string
          party_size: number
          status: "confirmed" | "pending" | "completed" | "cancelled"
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          place_id: string
          scheduled_date?: string
          time_slot?: string
          party_size?: number
          status?: "confirmed" | "pending" | "completed" | "cancelled"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          place_id?: string
          scheduled_date?: string
          time_slot?: string
          party_size?: number
          status?: "confirmed" | "pending" | "completed" | "cancelled"
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          place_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          place_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          place_id?: string
          created_at?: string
        }
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      article_category_enum: "review" | "culture" | "guide" | "couple"
      schedule_status_enum: "confirmed" | "pending" | "completed" | "cancelled"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

export type PlaceRow = Database["public"]["Tables"]["places"]["Row"]
export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"]
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"]
export type ScheduleRow = Database["public"]["Tables"]["schedules"]["Row"]
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]
export type FavoriteRow = Database["public"]["Tables"]["favorites"]["Row"]
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"]
