import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import useStore from '../store/useStore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Verify domain if not natively blocked by Firebase setup
      if (!user.email.endsWith('@academiatarapaca.com')) {
        await auth.signOut();
        throw new Error('Solo se permiten cuentas de @academiatarapaca.com');
      }

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      const isTeacher = user.email === 'ecortez@academiatarapaca.com' || user.email.startsWith('profesor');

      if (!userDoc.exists()) {
        const initialProgress = {
          email: user.email,
          name: user.displayName,
          role: isTeacher ? 'teacher' : 'student',
          createdAt: new Date(),
          unlockedModules: [1],
          completedChallenges: [],
          quizScore: null
        };
        await setDoc(userDocRef, initialProgress);
        setUserRole(isTeacher ? 'teacher' : 'student');
        
        // Sync new progress to store
        useStore.getState().setProgress({
          unlockedModules: [1],
          completedChallenges: [],
          quizScore: null
        });
      } else {
        const userData = userDoc.data();
        // Force upgrade to teacher if email matches but role was student
        if (isTeacher && userData.role !== 'teacher') {
          await setDoc(userDocRef, { role: 'teacher' }, { merge: true });
          setUserRole('teacher');
        } else {
          setUserRole(userData.role);
        }

        // Sync loaded progress to store
        useStore.getState().setProgress({
          unlockedModules: userData.unlockedModules || [1],
          completedChallenges: userData.completedChallenges || [],
          quizScore: userData.quizScore !== undefined ? userData.quizScore : null
        });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    await signOut(auth);
    // Clear local state on logout so next user doesn't see old progress
    useStore.getState().setProgress({
      unlockedModules: [1],
      completedChallenges: [],
      quizScore: null
    });
    // Also clear localStorage completely
    localStorage.removeItem('web-dev-course-progress');
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const isTeacher = user.email === 'ecortez@academiatarapaca.com' || user.email.startsWith('profesor');
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (isTeacher && userData.role !== 'teacher') {
            await setDoc(userDocRef, { role: 'teacher' }, { merge: true });
            setUserRole('teacher');
          } else {
            setUserRole(userData.role);
          }

          // Sync progress from Firestore on session load
          useStore.getState().setProgress({
            unlockedModules: userData.unlockedModules || [1],
            completedChallenges: userData.completedChallenges || [],
            quizScore: userData.quizScore !== undefined ? userData.quizScore : null
          });
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
