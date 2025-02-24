import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ProfileRepository } from '../lib/repositories/supabase/profile.repository';

export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const profileRepo = new ProfileRepository();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from URL query params after OAuth redirect
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error('No session found');
        }

        // Get user data from the session
        const user = session.user;

        if (!user) {
          throw new Error('No user data found in session');
        }

        // Check if profile already exists
        let existingProfile = null;
        try {
          existingProfile = await profileRepo.findById(user.id);
          console.log('Existing profile check result:', existingProfile);
        } catch (findError) {
          console.error('Error checking existing profile:', findError);
          // Continue to profile creation even if find fails
        }

        if (!existingProfile) {
          // Create new profile if it doesn't exist
          const metadata = user.user_metadata || {};

          const fullName =
            metadata.full_name ||
            `${metadata.given_name || ''} ${metadata.family_name || ''}`.trim() ||
            metadata.name ||
            user.email?.split('@')[0] ||
            'Unknown';

          try {
            const profile = await profileRepo.create({
              id: user.id,
              fullName,
              phone: '',
              rating: 5.0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log('Created new profile:', profile);
          } catch (createError) {
            console.error('Profile creation error details:', createError);
            throw new Error(`Failed to create profile: ${createError instanceof Error ? createError.message : 'Unknown error'}`);
          }
        } else {
          console.log('Using existing profile:', existingProfile);
        }

        // Redirect to profile page on successful auth
        navigate('/profile');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        // Redirect to sign-in page after a short delay if there's an error
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    handleCallback();
  }, [navigate, profileRepo]); // Added profileRepo to dependencies

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">Redirecting to sign in page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
        <p className="text-gray-600">Please wait while we complete your authentication...</p>
      </div>
    </div>
  );
}