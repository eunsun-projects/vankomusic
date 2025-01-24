import { FocusedObject, TimeCapsule, TimeCapsuleFromSupabase } from '@/types/projects.type';
import * as THREE from 'three';
import { create } from 'zustand';

export interface TimeCapsuleState {
  focusedObject: FocusedObject;
  timeCapsules: TimeCapsule[];
  timeCapsulesWithoutObject: TimeCapsuleFromSupabase[];
  queryStringTimeCapsuleId: string;
  setQueryStringTimeCapsuleId: (queryStringTimeCapsuleId: string) => void;
  setFocusedObject: (focusedObject: FocusedObject) => void;
  setTimeCapsules: (timeCapsules: TimeCapsule[]) => void;
  setTimeCapsulesWithoutObject: (timeCapsulesWithoutObject: TimeCapsuleFromSupabase[]) => void;
  updateTimeCapsuleObject: (object: THREE.Mesh) => void;
  addTimeCapsule: (timeCapsule: TimeCapsule) => void;
  editTimeCapsule: (timeCapsule: TimeCapsule) => void;
  deleteTimeCapsule: (timeCapsule: TimeCapsule) => void;
}

console.log('zustand restarted??');
export const useTimeCapsuleStore = create<TimeCapsuleState>((set) => ({
  focusedObject: {
    isIdle: null,
    timeCapsule: null,
  },
  timeCapsules: [],
  timeCapsulesWithoutObject: [],
  queryStringTimeCapsuleId: '',
  setQueryStringTimeCapsuleId: (queryStringTimeCapsuleId: string) =>
    set({ queryStringTimeCapsuleId }),
  setFocusedObject: (focusedObject: FocusedObject) => set({ focusedObject }),
  setTimeCapsules: (timeCapsules: TimeCapsule[]) => set({ timeCapsules }),
  setTimeCapsulesWithoutObject: (timeCapsulesWithoutObject: TimeCapsuleFromSupabase[]) =>
    set({ timeCapsulesWithoutObject }),
  addTimeCapsule: (timeCapsule: TimeCapsule) =>
    set((state) => ({
      timeCapsules: [...(state.timeCapsules || []), timeCapsule],
    })),
  updateTimeCapsuleObject: (object: THREE.Mesh) =>
    set((state) => ({
      timeCapsules: state.timeCapsules.map((timeCapsule) =>
        timeCapsule.id === object.name ? { ...timeCapsule, object } : timeCapsule,
      ),
    })),
  editTimeCapsule: (newTimeCapsule: TimeCapsule) =>
    set((state) => ({
      timeCapsules: state.timeCapsules.map((timeCapsule) =>
        timeCapsule.id === newTimeCapsule.id ? { ...timeCapsule, ...newTimeCapsule } : timeCapsule,
      ),
    })),
  deleteTimeCapsule: (timeCapsule: TimeCapsule) =>
    set((state) => ({
      timeCapsules: state.timeCapsules.filter((t) => t.id !== timeCapsule.id),
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
