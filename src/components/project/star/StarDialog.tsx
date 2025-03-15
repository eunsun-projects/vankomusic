'use client';

import { useStarStore } from '@/stores/zustand';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import StarFunnel from './StarFunnel';

function StarDialog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  return (
    <Dialog open={true}>
      <DialogContent className="sm:min-w-[425px] border-2 rounded-lg border-white flex flex-col items-center justify-center text-white p-4">
        <StarFunnel />
      </DialogContent>
    </Dialog>
  );
}

export default StarDialog;
