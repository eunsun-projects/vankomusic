import * as THREE from 'three';

export interface TimeCapsule {
  userId: string;
  title: string;
  description: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  position: number[];
  color: THREE.Color;
  object: THREE.Mesh | null;
}

export interface FocusedObject {
  object: THREE.Mesh;
  instanceId?: number;
  timeCapsule?: TimeCapsule;
}
