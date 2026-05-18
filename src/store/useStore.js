import { create } from 'zustand';

const useStore = create((set) => ({
  // Progress tracking
  unlockedModules: [1], // IDs of unlocked modules. Start with 1 (HTML)
  completedChallenges: [], // IDs of completed challenges
  quizScore: null,
  
  // Actions
  unlockModule: (moduleId) => set((state) => ({
    unlockedModules: state.unlockedModules.includes(moduleId) 
      ? state.unlockedModules 
      : [...state.unlockedModules, moduleId]
  })),
  
  completeChallenge: (challengeId) => set((state) => ({
    completedChallenges: state.completedChallenges.includes(challengeId)
      ? state.completedChallenges
      : [...state.completedChallenges, challengeId]
  })),

  setQuizScore: (score) => set({ quizScore: score }),
  
  resetProgress: () => set({
    unlockedModules: [1],
    completedChallenges: [],
    quizScore: null
  })
}));

export default useStore;
