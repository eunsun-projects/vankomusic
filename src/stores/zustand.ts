import { FocusedObject, Star, TimeCapsule, TimeCapsuleFromSupabase } from '@/types/projects.type';
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

export interface StarState {
  star: Star | null;
  setStar: (star: Star) => void;
}

export const useStarStore = create<StarState>((set) => ({
  star: null,
  setStar: (star: Star) => set({ star }),
}));
