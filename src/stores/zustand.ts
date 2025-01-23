import { FocusedObject, TimeCapsule } from '@/types/projects.type';
import * as THREE from 'three';
import { create } from 'zustand';

export interface TimeCapsuleState {
  focusedObject: FocusedObject | null;
  timeCapsules: TimeCapsule[];
  setFocusedObject: (focusedObject: FocusedObject | null) => void;
  setTimeCapsules: (timeCapsules: TimeCapsule[]) => void;
  updateTimeCapsule: (object: THREE.Mesh) => void;
  addTimeCapsule: (timeCapsule: TimeCapsule) => void;
}

export const useTimeCapsuleStore = create<TimeCapsuleState>((set) => ({
  focusedObject: null,
  timeCapsules: [],
  setFocusedObject: (focusedObject: FocusedObject | null) => set({ focusedObject }),
  setTimeCapsules: (timeCapsules: TimeCapsule[]) => set({ timeCapsules }),
  addTimeCapsule: (timeCapsule: TimeCapsule) =>
    set((state) => ({
      timeCapsules: [...(state.timeCapsules || []), timeCapsule],
    })),
  updateTimeCapsule: (object: THREE.Mesh) =>
    set((state) => ({
      timeCapsules: state.timeCapsules.map((timeCapsule) =>
        !timeCapsule.object ? { ...timeCapsule, object } : timeCapsule,
      ),
    })),
}));

// const makeInitialTimecapSules = () => {
//   return Array.from({ length: 10 }, () => ({
//     userId: 'user123',
//     title: 'New Capsule',
//     description: 'This is a new time capsule',
//     password: 'secure',
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     position: [generateRandomPosition(), generateRandomPosition(), generateRandomPosition()],
//     color: generateColor(),
//     object: null,
//   }));
// };

// const initialTimeCapsules = makeInitialTimecapSules();
