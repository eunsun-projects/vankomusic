import { Tables } from './supabase';

export type Audios = Tables<'audios'>;
export type Users = Tables<'users'>;
export type Videos = Tables<'videos'>;
export type Wishs = Tables<'wishs'>;
export type Visits = Tables<'visits'>;
export type ErrorResponse = {
  error: string;
};
