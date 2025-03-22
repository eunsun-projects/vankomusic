'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useStarQuery } from '@/hooks/queries/star.query';
import { useStarStore } from '@/stores/zustand';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

function StarUI() {
  const { user } = useAuth();
  const { data: starFromSupabase, isPending, error } = useStarQuery(user?.email ?? null);
  const { focusedStar, isDialogOpen } = useStarStore(
    useShallow((state) => ({
      focusedStar: state.focusedStar,
      isDialogOpen: state.isDialogOpen,
    })),
  );

  useEffect(() => {
    if (!error) return;
    console.error(error);
  }, [error]);

  useEffect(() => {
    if (!isPending) return;
    console.log('isPending in starUI....');
  }, [isPending]);

  if (isDialogOpen || !focusedStar) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full z-50 pointer-events-none">
      <p className="text-white text-2xl absolute top-10 left-10">
        {starFromSupabase && 'id' in starFromSupabase ? `소원력 : ${starFromSupabase.power}` : null}
      </p>
      <h1 className="text-white text-2xl absolute bottom-16 left-1/2 -translate-x-1/2">
        {focusedStar?.sowon}
      </h1>
    </div>
  );
}

export default StarUI;
