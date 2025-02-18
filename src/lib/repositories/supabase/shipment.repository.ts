/**
 * Shipment repository implementation using Supabase
 */
import { supabase } from '../../supabase';
import { Shipment } from '../../types';
import { BaseRepository } from '../base.repository';
import { shipmentMapper } from './mappers';

export interface ShipmentFilters {
  userId?: string;
  status?: Shipment['status'];
}

export class ShipmentRepository implements BaseRepository<Shipment> {
  async findById(id: string): Promise<Shipment | null> {
    const { data, error } = await supabase
      .from('shipments')
      .select(`
        *,
        route:routes(*),
        sender:profiles(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? shipmentMapper.toDomain(data) : null;
  }

  async findAll(filters?: ShipmentFilters): Promise<Shipment[]> {
    let query = supabase
      .from('shipments')
      .select(`
        *,
        route:routes(*),
        sender:profiles(*)
      `);

    if (filters?.userId) {
      query = query.or(`sender_id.eq.${filters.userId},route.carrier_id.eq.${filters.userId}`);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data.map(shipmentMapper.toDomain);
  }

  async create(shipment: Partial<Shipment>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .insert(shipmentMapper.toDB(shipment))
      .select(`
        *,
        route:routes(*),
        sender:profiles(*)
      `)
      .single();
    
    if (error) throw error;
    return shipmentMapper.toDomain(data);
  }

  async update(id: string, shipment: Partial<Shipment>): Promise<Shipment> {
    const { data, error } = await supabase
      .from('shipments')
      .update(shipmentMapper.toDB(shipment))
      .eq('id', id)
      .select(`
        *,
        route:routes(*),
        sender:profiles(*)
      `)
      .single();
    
    if (error) throw error;
    return shipmentMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('shipments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}