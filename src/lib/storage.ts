export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  private prefix = 'binder.v1.';

  async get<T>(key: string): Promise<T | null> {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Failed to get item ${key} from localStorage:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to set item ${key} in localStorage:`, error);
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.prefix + key);
    } catch (error) {
      console.warn(`Failed to remove item ${key} from localStorage:`, error);
    }
  }

  async clear(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      );
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
    }
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();

export const StorageKeys = {
  notes: (sectionId: string, lessonId: string) => `notes.${sectionId}.${lessonId}`,
  progress: 'progress',
  assessments: 'assessments',
  preferences: 'preferences',
} as const;