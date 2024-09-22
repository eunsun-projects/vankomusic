import { Tables } from './supabase';

export type Audios = Tables<'audios'>;
export type PartialAudios = Partial<Audios>;
export type Users = Tables<'users'>;
export type Videos = Tables<'videos'>;
export type PartialVideos = Partial<Videos>;
export type Wishs = Tables<'wishs'>;
export type Visits = Tables<'visits'>;
export type ErrorResponse = {
  error: string;
};
