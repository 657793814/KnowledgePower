import { create } from 'zustand';

export type SubjectKey = 'math' | 'physics' | 'chemistry';

interface SubjectStore {
  currentSubject: SubjectKey;
  setSubject: (s: SubjectKey) => void;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  currentSubject: (localStorage.getItem('mathverse_subject') as SubjectKey) || 'math',
  setSubject: (s) => {
    localStorage.setItem('mathverse_subject', s);
    set({ currentSubject: s });
  },
}));
