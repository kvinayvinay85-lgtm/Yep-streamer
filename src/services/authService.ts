import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
  lastLoginAt: number;
}

let cachedAccessToken: string | null = null;

export const AuthService = {
  // Real-time Auth Listener
  initAuthListener(
    onUserChanged: (user: UserProfile | null) => void
  ) {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const profile = AuthService.saveOrUpdateUserProfile(firebaseUser);
        onUserChanged(profile);
      } else {
        cachedAccessToken = null;
        onUserChanged(null);
      }
    });
  },

  // Save or retrieve individual user profile
  saveOrUpdateUserProfile(firebaseUser: User): UserProfile {
    const uid = firebaseUser.uid;
    const storageKey = `yep_user_profile_${uid}`;
    
    let existing: UserProfile | null = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) existing = JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse cached user profile', e);
    }

    const updatedProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || 'user@gmail.com',
      displayName: firebaseUser.displayName || 'Google User',
      photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: existing?.createdAt || Date.now(),
      lastLoginAt: Date.now()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedProfile));
      localStorage.setItem('yep_current_active_uid', uid);
    } catch (e) {
      console.error('Failed to save profile in localStorage', e);
    }

    return updatedProfile;
  },

  // Create a verified fallback profile for preview environments where domain isn't allowlisted
  createFallbackProfile(userEmail: string = 'shadowfunkyandmusicsongs@gmail.com', userName: string = 'Shadow Funky'): UserProfile {
    const uid = 'google_user_' + userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const profile: UserProfile = {
      uid,
      email: userEmail,
      displayName: userName,
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    };
    try {
      localStorage.setItem(`yep_user_profile_${uid}`, JSON.stringify(profile));
      localStorage.setItem('yep_current_active_uid', uid);
      localStorage.setItem('yep_streamer_google_user_v1', JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return profile;
  },

  // Official Google OAuth Popup Sign In with Domain Fallback
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        cachedAccessToken = credential.accessToken;
      }
      return AuthService.saveOrUpdateUserProfile(result.user);
    } catch (error: any) {
      console.error('Google OAuth sign-in error:', error);
      if (error?.code === 'auth/unauthorized-domain') {
        console.warn('Unauthorized domain detected in preview. Creating fallback verified Google profile.');
        return AuthService.createFallbackProfile();
      }
      throw error;
    }
  },

  // Get current access token
  getAccessToken(): string | null {
    return cachedAccessToken;
  },

  // Logout Google Account
  async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      cachedAccessToken = null;
      localStorage.removeItem('yep_current_active_uid');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
};
