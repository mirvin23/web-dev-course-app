import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, auth } from '../config/firebase';
import { doc, setDoc, getDocs, collection, query, orderBy, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import { courseModules as staticModules } from '../data/modules';

// Helper function to sync progress to Firestore
// Accepts an optional uid for cases where auth.currentUser isn't available yet (e.g. during login)
const syncToFirestore = async (stateUpdate, uid) => {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return;

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, stateUpdate, { merge: true });
  } catch (error) {
    console.error('Error syncing progress to Firestore:', error);
  }
};

// Helper function to validate code against custom rules
export const validateCode = (code, rules) => {
  if (!rules || rules.length === 0) return true;
  
  return rules.every(rule => {
    try {
      // Clean pattern and parse flag
      const regex = new RegExp(rule.pattern, rule.flags || 'i');
      const isMatch = regex.test(code);
      return rule.negated ? !isMatch : isMatch;
    } catch (e) {
      console.error("Error validando regex:", rule.pattern, e);
      return false;
    }
  });
};

const useStore = create(
  persist(
    (set, get) => ({
      // Progress tracking
      unlockedModules: [1],
      completedChallenges: [],
      quizScore: null,
      
      // Course modules from Firestore
      modules: [],
      loadingModules: true,
      
      // Actions for progress
      // uid parameter is optional — used during login when auth.currentUser isn't ready
      setProgress: (progress, uid) => {
        const data = {
          unlockedModules: progress.unlockedModules || [1],
          completedChallenges: progress.completedChallenges || [],
          quizScore: progress.quizScore !== undefined ? progress.quizScore : null,
        };
        set(data);
        // Always sync back to Firestore to guarantee the cloud copy is up-to-date
        syncToFirestore(data, uid);
      },

      unlockModule: (moduleId) => {
        const currentModules = get().unlockedModules;
        if (currentModules.includes(moduleId)) return;

        const updatedModules = [...currentModules, moduleId];
        set({ unlockedModules: updatedModules });
        syncToFirestore({ unlockedModules: updatedModules });
      },
      
      completeChallenge: (challengeId) => {
        const currentChallenges = get().completedChallenges;
        if (currentChallenges.includes(challengeId)) return;

        const updatedChallenges = [...currentChallenges, challengeId];
        set({ completedChallenges: updatedChallenges });
        syncToFirestore({ completedChallenges: updatedChallenges });
      },

      setQuizScore: (score) => {
        set({ quizScore: score });
        syncToFirestore({ quizScore: score });
      },
      
      resetProgress: () => {
        set({
          unlockedModules: [1],
          completedChallenges: [],
          quizScore: null
        });
        syncToFirestore({
          unlockedModules: [1],
          completedChallenges: [],
          quizScore: null
        });
      },

      // CRUD actions for Modules
      fetchModules: async () => {
        set({ loadingModules: true });
        try {
          const q = query(collection(db, 'modules'), orderBy('id', 'asc'));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            // Seed Firestore with initial modules
            console.log("Seeding Firestore with initial 15 modules...");
            const batch = writeBatch(db);
            
            staticModules.forEach((m) => {
              const docRef = doc(db, 'modules', `module_${m.id}`);
              batch.set(docRef, m);
            });
            
            await batch.commit();
            set({ modules: staticModules, loadingModules: false });
          } else {
            const loadedModules = snapshot.docs.map(doc => ({
              id: doc.data().id,
              docId: doc.id,
              ...doc.data()
            }));
            set({ modules: loadedModules, loadingModules: false });
          }
        } catch (error) {
          console.error("Error fetching modules from Firestore:", error);
          // Fallback to static modules in case of DB offline/error
          set({ modules: staticModules, loadingModules: false });
        }
      },

      addModule: async (newModule) => {
        try {
          const docId = `module_${newModule.id}`;
          const docRef = doc(db, 'modules', docId);
          await setDoc(docRef, newModule);
          
          // Re-fetch to keep local state perfectly sorted and synced
          await get().fetchModules();
        } catch (error) {
          console.error("Error adding module:", error);
        }
      },

      updateModule: async (moduleId, updatedFields) => {
        try {
          const docId = `module_${moduleId}`;
          const docRef = doc(db, 'modules', docId);
          await updateDoc(docRef, updatedFields);
          
          // Re-fetch to sync
          await get().fetchModules();
        } catch (error) {
          console.error("Error updating module:", error);
        }
      },

      deleteModule: async (moduleId) => {
        try {
          const docId = `module_${moduleId}`;
          await deleteDoc(doc(db, 'modules', docId));
          
          // Re-fetch to sync
          await get().fetchModules();
        } catch (error) {
          console.error("Error deleting module:", error);
        }
      }
    }),
    {
      name: 'web-dev-course-progress', // local storage key
      // ONLY persist progress keys, NEVER persist dynamic modules!
      partialize: (state) => ({
        unlockedModules: state.unlockedModules,
        completedChallenges: state.completedChallenges,
        quizScore: state.quizScore
      })
    }
  )
);

export default useStore;
