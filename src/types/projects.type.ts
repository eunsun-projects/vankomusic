import * as THREE from 'three';
import { Tables } from './supabase';

export type TimeCapsuleFromSupabase = Tables<'timecapsules'>;

export interface TimeCapsule extends TimeCapsuleFromSupabase {
  object: THREE.Mesh | null;
}

export interface FocusedObject {
  isIdle: boolean | null;
  timeCapsule: TimeCapsule | null;
}
