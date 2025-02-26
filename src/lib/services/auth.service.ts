/**
 * Authentication service handling user management and session
 */
import { supabase } from '../supabase';
import { ProfileRepository } from '../repositories/supabase/profile.repository';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export class AuthService {
  private profileRepo: ProfileRepository;

  constructor() {
    this.profileRepo = new ProfileRepository();
  }

  async signUp({ email, password, fullName, phone }: SignUpData) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      try {
        const profile = await this.profileRepo.create({
          id: authData.user.id,
          fullName,
          phone,
        });

        return {
          ...authData,
          profile
        };
      } catch (error) {
        // If profile creation fails, delete the auth user to maintain consistency
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return authData;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/v1/callback`
      }
    });
    if (error) throw error;
    return data;
  }

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
    });
  }
}
