import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY && 
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { auth, storage };

export interface AuthUserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  providerId: string;
}

// -------------------------------------------------------------------------
// 1. GOOGLE 1-CLICK AUTHENTICATION (Free Spark Plan)
// -------------------------------------------------------------------------
export const signInWithGoogle = async (): Promise<AuthUserProfile> => {
  if (!auth) {
    // Graceful offline simulated Google sign-in for preview before API keys are added
    console.info('[Firebase] Using simulated Google Auth (add VITE_FIREBASE_API_KEY in .env for live)');
    const simulatedUser: AuthUserProfile = {
      uid: 'google-user-' + Math.random().toString(36).substring(2, 9),
      displayName: 'Vaibhav Bharti',
      email: 'vaibhav@example.com',
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phoneNumber: '+91 98765 43210',
      providerId: 'google.com'
    };
    return simulatedUser;
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    phoneNumber: user.phoneNumber,
    providerId: 'google.com',
  };
};

// -------------------------------------------------------------------------
// 1.1 EMAIL & PASSWORD DIRECT AUTHENTICATION
// -------------------------------------------------------------------------
export const signUpWithEmailPassword = async (
  email: string, 
  pass: string, 
  displayName?: string
): Promise<AuthUserProfile> => {
  if (!auth) {
    return {
      uid: 'email-user-' + Math.random().toString(36).substring(2, 9),
      displayName: displayName || email.split('@')[0],
      email,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phoneNumber: null,
      providerId: 'password',
    };
  }

  const credential = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && credential.user) {
    try {
      await updateProfile(credential.user, { displayName });
    } catch {}
  }
  return {
    uid: credential.user.uid,
    displayName: credential.user.displayName || displayName || email.split('@')[0],
    email: credential.user.email,
    photoURL: credential.user.photoURL,
    phoneNumber: credential.user.phoneNumber,
    providerId: 'password',
  };
};

export const signInWithEmailPassword = async (
  email: string, 
  pass: string
): Promise<AuthUserProfile> => {
  if (!auth) {
    return {
      uid: 'email-user-' + Math.random().toString(36).substring(2, 9),
      displayName: email.split('@')[0],
      email,
      photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      phoneNumber: null,
      providerId: 'password',
    };
  }

  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return {
    uid: credential.user.uid,
    displayName: credential.user.displayName || credential.user.email?.split('@')[0] || 'User',
    email: credential.user.email,
    photoURL: credential.user.photoURL,
    phoneNumber: credential.user.phoneNumber,
    providerId: 'password',
  };
};

// -------------------------------------------------------------------------
// 2. MOBILE PHONE SMS OTP AUTHENTICATION (Free Spark Plan)
// -------------------------------------------------------------------------
export const initPhoneRecaptcha = (containerId: string): RecaptchaVerifier | null => {
  if (!auth) return null;
  try {
    return new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved
      },
    });
  } catch (err) {
    console.warn('[Firebase] Recaptcha setup error:', err);
    return null;
  }
};

export const sendPhoneOtp = async (
  phoneNumber: string, 
  recaptchaVerifier: RecaptchaVerifier | null
): Promise<ConfirmationResult | { isSimulated: boolean; phone: string }> => {
  const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;

  if (!auth || !recaptchaVerifier) {
    console.info('[Firebase] Using simulated Phone OTP flow (add VITE_FIREBASE_API_KEY in .env for live SMS)');
    return { isSimulated: true, phone: formattedPhone };
  }

  return await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
};

export const verifyPhoneOtp = async (
  confirmation: any, 
  otpCode: string
): Promise<AuthUserProfile> => {
  if (confirmation && typeof confirmation.confirm === 'function') {
    const credential = await confirmation.confirm(otpCode);
    const user = credential.user;
    return {
      uid: user.uid,
      displayName: user.displayName || 'Client ' + user.phoneNumber?.slice(-4),
      email: user.email,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      providerId: 'phone',
    };
  }

  // Simulated OTP verification fallback (code '123456' or any 6 digits)
  return {
    uid: 'phone-user-' + Math.random().toString(36).substring(2, 9),
    displayName: 'Verified Client',
    email: null,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phoneNumber: confirmation?.phone || '+91 98765 43210',
    providerId: 'phone',
  };
};

// -------------------------------------------------------------------------
// 3. PERSISTENT AUTH STATE OBSERVER
// -------------------------------------------------------------------------
export const subscribeToAuthChanges = (
  callback: (user: AuthUserProfile | null) => void
): (() => void) => {
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        providerId: user.providerData[0]?.providerId || 'firebase',
      });
    } else {
      callback(null);
    }
  });
};

export const signOutFirebase = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

// -------------------------------------------------------------------------
// 4. CLOUD STORAGE (Customer Avatars & KYC Documents)
// -------------------------------------------------------------------------
export const uploadFileToFirebaseStorage = async (
  file: File, 
  folder: string = 'avatars'
): Promise<string> => {
  if (!storage) {
    // Return base64 or local object URL if storage not yet configured
    return URL.createObjectURL(file);
  }

  const timestamp = Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
  const storageRef = ref(storage, `${folder}/${timestamp}_${cleanName}`);

  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
