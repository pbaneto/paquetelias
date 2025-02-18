/**
 * Profile repository implementation using Supabase
 */
import { supabase } from '../../supabase';
import { Profile } from '../../types';
import { BaseRepository } from '../base.repository';
import { profileMapper } from './mappers';

export class ProfileRepository implements BaseRepository<Profile> {
  async findById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? profileMapper.toDomain(data) : null;
  }

  async findAll(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select();
    
    if (error) throw error;
    return data.map(profileMapper.toDomain);
  }

  async create(profile: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileMapper.toDB(profile))
      .select()
      .single();
    
    if (error) throw error;
    return profileMapper.toDomain(data);
  }

  async update(id: string, profile: Partial<Profile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileMapper.toDB(profile))
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return profileMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}