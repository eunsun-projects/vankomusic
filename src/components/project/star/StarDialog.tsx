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
  const { isDialogOpen, setIsDialogOpen, funnel, setFunnel } = useStarStore(
    useShallow((state) => ({
      isDialogOpen: state.isDialogOpen,
      funnel: state.funnel,
      setFunnel: state.setFunnel,
      setIsDialogOpen: state.setIsDialogOpen,
    })),
  );

  // 쿼리스트링으로 접속시
  useEffect(() => {
    const queryFunnel = searchParams.get('funnel');
    if (!queryFunnel) return;
    const funnelNumber = Number(queryFunnel);
    if (funnelNumber > 1) {
      if (user && star && 'id' in star) return;
    } else {
      setFunnel(funnelNumber);
    }
  }, [searchParams, setFunnel, user, star]);

  // 쿼리스트링 없이 접속했을시
  // 로그인 상태면서 이미 별이 있으면 모달 닫기
  useEffect(() => {
    const isFirst = localStorage.getItem('isFirst');
    if (isFirst === 'false') return;
    if (funnel >= 1) {
      console.log(star);
      if (user && star && 'id' in star) {
        setIsDialogOpen(false);
        return;
      }
    } else {
      setIsDialogOpen(true);
    }
    router.push(pathname + '?funnel=' + funnel);
  }, [funnel, pathname, router, user, star, setIsDialogOpen]);

  return (
    <Dialog open={isDialogOpen}>
      <Portal>
        <div>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
        </div>
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
