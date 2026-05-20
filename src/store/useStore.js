import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, auth } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Helper function to sync with Firestore in the background
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

const useStore = create(
  persist(
    (set, get) => ({
      // Progress tracking
      unlockedModules: [1], // IDs of unlocked modules. Start with 1 (HTML)
      completedChallenges: [], // IDs of completed challenges
      quizScore: null,
      
      // Actions
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
      }
    }),
    {
      name: 'web-dev-course-progress', // local storage key
    }
  )
);

export default useStore;
