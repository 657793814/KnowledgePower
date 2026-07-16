import { create } from 'zustand';

export type SubjectKey = 'math' | 'physics' | 'chemistry' | 'bio';

interface SubjectStore {
  currentSubject: SubjectKey;
  setSubject: (s: SubjectKey) => void;
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  currentSubject: (localStorage.getItem('knowledgepower_subject') as SubjectKey) || 'math',
  setSubject: (s) => {
    localStorage.setItem('knowledgepower_subject', s);
    set({ currentSubject: s });
  },
}));
