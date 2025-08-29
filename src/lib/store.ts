import React from 'react';
import { create } from 'zustand';
import { storage, StorageKeys } from './storage';

export interface Note {
  content: string;
  lastSaved: string;
  wordCount: number;
}

export interface Progress {
  completed: Record<string, boolean>;
  sectionProgress: Record<string, { completed: number; total: number }>;
}

interface BinderStore {
  notes: Record<string, Note>;
  progress: Progress;
  getNote: (sectionId: string, lessonId: string) => Note | null;
  updateNote: (sectionId: string, lessonId: string, content: string) => void;
  clearNote: (sectionId: string, lessonId: string) => void;
  getLessonProgress: (sectionId: string, lessonId: string) => boolean;
  markLessonComplete: (sectionId: string, lessonId: string, completed: boolean) => void;
  getSectionProgress: (sectionId: string) => { completed: number; total: number };
}

const createNoteKey = (sectionId: string, lessonId: string): string => {
  return `${sectionId}.${lessonId}`;
};

const calculateWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const useBinderStore = create<BinderStore>((set, get) => ({
  notes: {},
  progress: { completed: {}, sectionProgress: {} },

  getNote: (sectionId: string, lessonId: string) => {
    const key = createNoteKey(sectionId, lessonId);
    return get().notes[key] || null;
  },

  updateNote: (sectionId: string, lessonId: string, content: string) => {
    const key = createNoteKey(sectionId, lessonId);
    const now = new Date().toISOString();
    const wordCount = calculateWordCount(content);
    
    const note: Note = {
      content,
      lastSaved: now,
      wordCount,
    };

    set(state => ({
      notes: {
        ...state.notes,
        [key]: note,
      },
    }));

    // Save to storage
    storage.set(StorageKeys.notes(sectionId, lessonId), note);
  },

  clearNote: (sectionId: string, lessonId: string) => {
    const key = createNoteKey(sectionId, lessonId);
    set(state => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...remainingNotes } = state.notes;
      return { notes: remainingNotes };
    });
    
    storage.remove(StorageKeys.notes(sectionId, lessonId));
  },

  getLessonProgress: (sectionId: string, lessonId: string) => {
    return get().progress.completed[lessonId] || false;
  },

  markLessonComplete: (sectionId: string, lessonId: string, completed: boolean) => {
    set(state => ({
      progress: {
        ...state.progress,
        completed: {
          ...state.progress.completed,
          [lessonId]: completed,
        },
      },
    }));
    
    storage.set(StorageKeys.progress, get().progress);
  },

  getSectionProgress: (sectionId: string) => {
    return get().progress.sectionProgress[sectionId] || { completed: 0, total: 0 };
  },
}));

export const useNote = (sectionId: string, lessonId: string) => {
  const { notes, getNote, updateNote, clearNote } = useBinderStore();
  
  React.useEffect(() => {
    const key = createNoteKey(sectionId, lessonId);
    if (!notes[key]) {
      storage.get<Note>(StorageKeys.notes(sectionId, lessonId)).then(note => {
        if (note) {
          useBinderStore.setState(state => ({
            notes: {
              ...state.notes,
              [key]: note,
            },
          }));
        }
      });
    }
  }, [sectionId, lessonId, notes]);

  return {
    note: getNote(sectionId, lessonId),
    updateNote: (content: string) => updateNote(sectionId, lessonId, content),
    clearNote: () => clearNote(sectionId, lessonId),
  };
};