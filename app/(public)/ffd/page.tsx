import Loading from '@/app/loading';
import { SetScreenSize } from '@/components/common';
import { FfdTemplate } from '@/components/project/ffd';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import { Suspense } from 'react';

export const metadata = basicMeta;
export const viewport = basicViewport;

function makeImgArr() {
  let imgarr = [];
  for (let i = 0; i < 54; i++) {
    let imgstring = `/assets/img/ffd/${i}.webp`;
    imgarr[i] = imgstring;
  }
  return imgarr;
}

export default function Ffd() {
  const imgs = makeImgArr();

  return (
    <>
      <SetScreenSize />
      <Suspense fallback={<Loading />}>
        <FfdTemplate imgs={imgs} />
      </Suspense>
    </>
  );
}
