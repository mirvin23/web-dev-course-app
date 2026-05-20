import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, auth } from '../config/firebase';
import { doc, setDoc, getDocs, collection, query, orderBy, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import { courseModules as staticModules } from '../data/modules';
import { defaultQuizQuestions } from '../data/quizQuestions';

// Helper function to sync progress to Firestore
const syncToFirestore = async (stateUpdate) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userDocRef = doc(db, 'users', user.uid);
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

      // Quiz Questions from Firestore
      quizQuestions: [],
      loadingQuizQuestions: true,
      
      // Actions for progress
      setProgress: (progress) => set({
        unlockedModules: progress.unlockedModules || [1],
        completedChallenges: progress.completedChallenges || [],
        quizScore: progress.quizScore !== undefined ? progress.quizScore : null,
      }),

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

      // Reset local state ONLY (used on logout to clear UI without erasing cloud data)
      resetLocal: () => {
        set({
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
      },

      // CRUD actions for Quiz Questions
      fetchQuizQuestions: async () => {
        set({ loadingQuizQuestions: true });
        try {
          const q = query(collection(db, 'quiz_questions'), orderBy('id', 'asc'));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            // Seed Firestore with initial 60 questions
            console.log("Seeding Firestore with initial 60 questions...");
            // Firestore batches have a limit of 500 operations, so 60 is fine.
            const batch = writeBatch(db);
            
            defaultQuizQuestions.forEach((q) => {
              const docRef = doc(db, 'quiz_questions', `q_${q.id}`);
              batch.set(docRef, q);
            });
            
            await batch.commit();
            set({ quizQuestions: defaultQuizQuestions, loadingQuizQuestions: false });
          } else {
            const loadedQuestions = snapshot.docs.map(doc => ({
              docId: doc.id,
              ...doc.data()
            }));
            set({ quizQuestions: loadedQuestions, loadingQuizQuestions: false });
          }
        } catch (error) {
          console.error("Error fetching quiz questions from Firestore:", error);
          set({ quizQuestions: defaultQuizQuestions, loadingQuizQuestions: false });
        }
      },

      addQuizQuestion: async (newQuestion) => {
        try {
          const docId = `q_${newQuestion.id}`;
          const docRef = doc(db, 'quiz_questions', docId);
          await setDoc(docRef, newQuestion);
          
          await get().fetchQuizQuestions();
        } catch (error) {
          console.error("Error adding question:", error);
        }
      },

      updateQuizQuestion: async (questionId, updatedFields) => {
        try {
          const docId = `q_${questionId}`;
          const docRef = doc(db, 'quiz_questions', docId);
          await updateDoc(docRef, updatedFields);
          
          await get().fetchQuizQuestions();
        } catch (error) {
          console.error("Error updating question:", error);
        }
      },

      deleteQuizQuestion: async (questionId) => {
        try {
          const docId = `q_${questionId}`;
          await deleteDoc(doc(db, 'quiz_questions', docId));
          
          await get().fetchQuizQuestions();
        } catch (error) {
          console.error("Error deleting question:", error);
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
