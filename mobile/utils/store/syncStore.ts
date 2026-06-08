import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedLog {
  id: string; // Unique ID to track the queue item
  payload: any; // The payload normally sent to api.post('/api/logs')
  timestamp: string; // When it was queued
}

interface SyncState {
  queuedLogs: QueuedLog[];
  addLog: (payload: any) => void;
  removeLog: (id: string) => void;
  clearLogs: () => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      queuedLogs: [],
      addLog: (payload) => set((state) => ({
        queuedLogs: [
          ...state.queuedLogs, 
          { id: Date.now().toString(), payload, timestamp: new Date().toISOString() }
        ]
      })),
      removeLog: (id) => set((state) => ({
        queuedLogs: state.queuedLogs.filter(log => log.id !== id)
      })),
      clearLogs: () => set({ queuedLogs: [] })
    }),
    {
      name: 'lifetrack-sync-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
