'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useStarQuery } from '@/hooks/queries/star.query';
import { useStarStore } from '@/stores/zustand';
import { Dialog, DialogContent, DialogOverlay, Portal } from '@radix-ui/react-dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import StarFunnel from './StarFunnel';

function StarDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: star } = useStarQuery(user?.email ?? null);
  const { funnel, setFunnel, isDialogOpen, setIsDialogOpen } = useStarStore(
    useShallow((state) => ({
      funnel: state.funnel,
      setFunnel: state.setFunnel,
      isDialogOpen: state.isDialogOpen,
      setIsDialogOpen: state.setIsDialogOpen,
    })),
  );

  useEffect(() => {
    const queryFunnel = searchParams.get('funnel');
    if (queryFunnel) {
      setFunnel(Number(queryFunnel));
    }
  }, [searchParams, setFunnel]);

  useEffect(() => {
    router.push(pathname + '?funnel=' + funnel);
  }, [funnel, pathname, router]);

  useEffect(() => {
    const lastTouchDate = localStorage.getItem('lastStarTouchDate');
    const today = new Date().toISOString().split('T')[0];

    // 로그인하지 않은 경우
    if (!user) {
      setIsDialogOpen(true);
      return;
    }

    // 별이 없는 경우
    if (!star || !('id' in star)) {
      setIsDialogOpen(true);
      return;
    }

    // 마지막 터치 날짜가 없는 경우 (처음 방문)
    if (!lastTouchDate) {
      setIsDialogOpen(true);
      localStorage.setItem('lastStarTouchDate', today);
      return;
    }

    // 마지막 터치 날짜가 오늘이 아닌 경우
    if (lastTouchDate !== today) {
      setIsDialogOpen(true);
      localStorage.setItem('lastStarTouchDate', today);
      return;
    }

    // 오늘 이미 터치한 경우
    setIsDialogOpen(false);
  }, [user, star, setIsDialogOpen]);

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleClose}>
      <Portal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        <div className="flex items-center justify-center h-full w-full">
          <DialogContent className="fixed z-[100] sm:min-w-[425px] border-2 rounded-lg border-white flex flex-col items-center justify-center text-white p-4 bg-black">
            <StarFunnel />
          </DialogContent>
        </div>
      </Portal>
    </Dialog>
  );
}

export default StarDialog;
