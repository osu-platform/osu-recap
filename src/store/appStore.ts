import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StudentData } from '../types/student';

export type AppStage = 'intro' | 'security' | 'login' | 'scraping' | 'stories';

interface AuthState {
  credentials: { login: string; pass: string } | null;
  setCredentials: (login: string, pass: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      credentials: null,
      setCredentials: (login, pass) => set({ credentials: { login, pass } }),
      logout: () => set({ credentials: null }),
    }),
    {
      name: 'osu-recap-auth',
    }
  )
);

interface AppState {
  stage: AppStage;
  loadingMessage: string;
  studentData: StudentData | null;
  
  setStage: (stage: AppStage) => void;
  setLoadingMessage: (message: string) => void;
  setStudentData: (data: StudentData) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      stage: 'intro',
      loadingMessage: '',
      studentData: null,

      setStage: (stage) => set({ stage }),
      setLoadingMessage: (message) => set({ loadingMessage: message }),
      setStudentData: (data) => set({ studentData: data }),
      reset: () => set({ stage: 'intro', loadingMessage: '', studentData: null }),
    }),
    {
      name: 'osu-recap-storage',
      partialize: (state) => ({ 
        // Only persist stage if it's 'stories' (though without data it might be useless)
        // Actually, user said "don't save anything except login/pass".
        // So we shouldn't persist studentData.
        // We can persist stage if we want, but if data is gone, we must go back to loading.
        // So let's NOT persist studentData.
        // And if we don't persist data, we shouldn't persist 'stories' stage either, 
        // because we can't show stories without data.
        // So effectively, we persist NOTHING here? Or maybe just UI preferences if we had them.
        // For now, let's return an empty object or just remove persistence for these fields.
      }),
    }
  )
);
