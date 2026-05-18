import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, db } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName,
          role: isTeacher ? 'teacher' : 'student',
          createdAt: new Date()
        });
        setUserRole(isTeacher ? 'teacher' : 'student');
      } else {
        // Force upgrade to teacher if email matches but role was student
        if (isTeacher && userDoc.data().role !== 'teacher') {
          await setDoc(userDocRef, { role: 'teacher' }, { merge: true });
          setUserRole('teacher');
        } else {
          setUserRole(userDoc.data().role);
        }
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const isTeacher = user.email === 'ecortez@academiatarapaca.com' || user.email.startsWith('profesor');
        
        if (userDoc.exists()) {
          if (isTeacher && userDoc.data().role !== 'teacher') {
            await setDoc(userDocRef, { role: 'teacher' }, { merge: true });
            setUserRole('teacher');
          } else {
            setUserRole(userDoc.data().role);
          }
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
