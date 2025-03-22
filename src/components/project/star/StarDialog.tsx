'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useStarQuery } from '@/hooks/queries/star.query';
import { useStarStore } from '@/stores/zustand';
import { Dialog, DialogContent, DialogOverlay, Portal } from '@radix-ui/react-dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import StarFunnel from './StarFunnel';

function StarDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { data: star } = useStarQuery(user?.email ?? null);
  const { funnel, setFunnel } = useStarStore(
    useShallow((state) => ({
      funnel: state.funnel,
      setFunnel: state.setFunnel,
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
      setIsOpen(true);
      return;
    }

    // 별이 없는 경우
    if (!star || !('id' in star)) {
      setIsOpen(true);
      return;
    }

    // 마지막 터치 날짜가 없는 경우 (처음 방문)
    if (!lastTouchDate) {
      setIsOpen(true);
      localStorage.setItem('lastStarTouchDate', today);
      return;
    }

    // 마지막 터치 날짜가 오늘이 아닌 경우
    if (lastTouchDate !== today) {
      setIsOpen(true);
      localStorage.setItem('lastStarTouchDate', today);
      return;
    }

    // 오늘 이미 터치한 경우
    setIsOpen(false);
  }, [user, star]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <Portal>
        <DialogOverlay className="fixed inset-0 bg-black/50 z-[100]" />
        <DialogContent className="fixed z-[100] sm:min-w-[425px] border-2 rounded-lg border-white flex flex-col items-center justify-center text-white p-4">
          <StarFunnel />
        </DialogContent>
      </Portal>
    </Dialog>
  );
}

export default StarDialog;
