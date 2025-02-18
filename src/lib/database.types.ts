export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          carrier_id: string
          origin: string
          destination: string
          departure_date: string
          arrival_date: string
          max_weight: number
          price_per_kg: number
          available_capacity: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          carrier_id: string
          origin: string
          destination: string
          departure_date: string
          arrival_date: string
          max_weight: number
          price_per_kg: number
          available_capacity: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          carrier_id?: string
          origin?: string
          destination?: string
          departure_date?: string
          arrival_date?: string
          max_weight?: number
          price_per_kg?: number
          available_capacity?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      shipments: {
        Row: {
          id: string
          route_id: string
          sender_id: string
          package_description: string
          weight: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          route_id: string
          sender_id: string
          package_description: string
          weight: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          route_id?: string
          sender_id?: string
          package_description?: string
          weight?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}