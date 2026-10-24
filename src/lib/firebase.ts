import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { firebaseConfigJson } from './firebaseConfig';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfigJson.firestoreDatabaseId || undefined);

export const signUpWithEmailPassword = async (email: string, pass: string, name: string) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const user = cred.user;
    if (user) {
      if (name) {
        await updateProfile(user, { displayName: name });
      }
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: name || user.displayName || 'DriveForge Engineer',
          email: user.email || '',
          role: 'engineer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error) {
    console.error('Error in signUpWithEmailPassword:', error);
    throw error;
  }
};

export const signInWithEmailPassword = async (email: string, pass: string) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (error) {
    console.error('Error in signInWithEmailPassword:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName || 'DriveForge User',
          email: user.email || '',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logOutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const saveUserBuildToFirestore = async (userId: string, buildData: Record<string, any>) => {
  try {
    if (!userId) return null;
    const buildId = buildData.id || `build-${Date.now()}`;
    const buildRef = doc(db, 'users', userId, 'builds', buildId);
    const payload = {
      ...buildData,
      id: buildId,
      userId,
      updatedAt: new Date().toISOString(),
      createdAt: buildData.createdAt || new Date().toISOString(),
    };
    await setDoc(buildRef, payload, { merge: true });
    return buildId;
  } catch (error) {
    console.warn('Firestore build sync warning:', error);
    return null;
  }
};

export const getUserBuildsFromFirestore = async (userId: string) => {
  try {
    const buildsRef = collection(db, 'users', userId, 'builds');
    const snapshot = await getDocs(buildsRef);
    const builds: Record<string, any>[] = [];
    snapshot.forEach((docSnap) => {
      builds.push({ id: docSnap.id, ...docSnap.data() });
    });
    return builds;
  } catch (error) {
    console.error('Error fetching user builds from Firestore:', error);
    return [];
  }
};

export { onAuthStateChanged };
export type { User };
