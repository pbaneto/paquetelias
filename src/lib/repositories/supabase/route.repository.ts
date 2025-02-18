/**
 * Route repository implementation using Supabase
 */
import { supabase } from '../../supabase';
import { Route } from '../../types';
import { BaseRepository } from '../base.repository';
import { routeMapper } from './mappers';

export interface RouteFilters {
  origin?: string;
  destination?: string;
  fromDate?: string;
  toDate?: string;
  status?: Route['status'];
}

export class RouteRepository implements BaseRepository<Route> {
  async findById(id: string): Promise<Route | null> {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        carrier:profiles(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? routeMapper.toDomain(data) : null;
  }

  async findAll(filters?: RouteFilters): Promise<Route[]> {
    let query = supabase
      .from('routes')
      .select(`
        *,
        carrier:profiles(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
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
    return data.map(routeMapper.toDomain);
  }

  async create(route: Partial<Route>): Promise<Route> {
    const { data, error } = await supabase
      .from('routes')
      .insert(routeMapper.toDB(route))
      .select(`
        *,
        carrier:profiles(*)
      `)
      .single();
    
    if (error) throw error;
    return routeMapper.toDomain(data);
  }

  async update(id: string, route: Partial<Route>): Promise<Route> {
    const { data, error } = await supabase
      .from('routes')
      .update(routeMapper.toDB(route))
      .eq('id', id)
      .select(`
        *,
        carrier:profiles(*)
      `)
      .single();
    
    if (error) throw error;
    return routeMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('routes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}