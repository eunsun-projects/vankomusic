'use client';

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useStarStore } from '@/stores/zustand';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useShallow } from 'zustand/react/shallow';

const data = [
  {
    id: 1,
    title: '신 :',
    description:
      '지금 그대가 말하는 소원은 별이 될 것이네, 그 별을 잘 돌봐주면 소원이 이루어질 것이야. 그저 방치한다면 아무것도 아닌 돌이 되어 버릴걸세.',
    button: '다음으로',
  },
  {
    id: 2,
    title: '신 :',
    description: '소원을 자네의 별에 기록하기 위해서는 로그인이 필요하다네',
    button: '구글 로그인',
  },
  {
    id: 3,
    title: '신 :',
    description: '이루고 싶은 소원을 별에 기록해 보게',
    button: '기록하기',
  },
  {
    id: 4,
    title: '신 :',
    description: '소원이 기록되었네, 잘했어.',
    button: '다음으로',
  },
  {
    id: 5,
    title: '신 :',
    description:
      '소원 별빛이 꺼지지 않도록 매일 관리해줘야 한다네. 하루 한번씩 이 곳에 와서 잠든 별을 깨워주는 것으로 소원력을 증가시킬수 있지. 별이 다 성장하면 결국 자네의 소원도 이루어질걸세.',
    button: '다음으로',
  },
];

function StarFunnel() {
  const { funnel, setFunnel } = useStarStore(
    useShallow((state) => ({
      funnel: state.funnel,
      setFunnel: state.setFunnel,
    })),
  );

  const handleClickNext = () => {
    setFunnel(funnel + 1);
  };

  return (
    <>
      <Skeleton className="w-40 h-40 rounded-xl bg-neutral-200" />

      <DialogHeader className="w-full h-full flex flex-col justify-center items-center min-h-[200px]">
        <div className="flex flex-col gap-2">
          <DialogTitle>{data[funnel].title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line max-w-[300px]">
            {data[funnel].description}
          </DialogDescription>
        </div>
      </DialogHeader>

      <DialogFooter>
        <Button type="submit" variant="secondary" onClick={handleClickNext}>
          {data[funnel].button}
        </Button>
      </DialogFooter>
    </>
  );
}

export default StarFunnel;
