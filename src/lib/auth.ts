import { supabase } from './supabase';

export const auth = {
  async signUp(email: string, password: string, profile: { full_name: string; phone: string }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          ...profile,
        });

      if (profileError) throw profileError;
    }

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback: (event: 'SIGNED_IN' | 'SIGNED_OUT', session: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event as 'SIGNED_IN' | 'SIGNED_OUT', session);
    });
  }
};