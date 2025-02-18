import { supabase } from './supabase';
import type { Database } from './database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Route = Database['public']['Tables']['routes']['Row'];
type Shipment = Database['public']['Tables']['shipments']['Row'];

// Profile API
export const profileApi = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data as Profile;
  },

  async updateProfile(userId: string, profile: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }
};

// Routes API
export const routesApi = {
  async listRoutes(filters?: {
    origin?: string;
    destination?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    let query = supabase
      .from('routes')
      .select(`
        *,
        carrier:profiles(*)
      `)
      .eq('status', 'active');

    if (filters?.origin) {
      query = query.ilike('origin', `%${filters.origin}%`);
    }
    if (filters?.destination) {
      query = query.ilike('destination', `%${filters.destination}%`);
    }
    if (filters?.fromDate) {
      query = query.gte('departure_date', filters.fromDate);
    }
    if (filters?.toDate) {
      query = query.lte('departure_date', filters.toDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createRoute(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('routes')
      .insert(route)
      .select()
      .single();
    
    if (error) throw error;
    return data as Route;
  },

  async updateRoute(id: string, updates: Partial<Route>) {
    const { data, error } = await supabase
      .from('routes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Route;
  }
};

// Shipments API
export const shipmentsApi = {
  async listShipments(userId: string) {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        route:routes(*),
        sender:profiles(*)
      `)
      .or(`sender_id.eq.${userId},route.carrier_id.eq.${userId}`);
    
    if (error) throw error;
    return data;
  },

  async createShipment(shipment: Omit<Shipment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('shipments')
      .insert(shipment)
      .select()
      .single();
    
    if (error) throw error;
    return data as Shipment;
  },

  async updateShipmentStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('shipments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Shipment;
  }
};