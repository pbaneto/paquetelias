import { AuthService } from './services/auth.service';


const authService = new AuthService();

export const auth = {
  signUp: authService.signUp.bind(authService),
  signIn: authService.signIn.bind(authService),
  signOut: authService.signOut.bind(authService),
  getCurrentUser: authService.getCurrentUser.bind(authService),
  onAuthStateChange: authService.onAuthStateChange.bind(authService)
};
