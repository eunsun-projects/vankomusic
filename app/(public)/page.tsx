import { getAudios, getVideos } from '@/apis/audios/get.api';
import { BorderLine, Floatings, Hadan, MainGallery, VankoMainLogo } from '@/components/home';
import VanPlayer from '@/components/vanplayer/vanplayer';
import { QUERY_KEY_AUDIOS, QUERY_KEY_VIDEOS } from '@/constants/query.constant';
import { lobster, silkscreen, vastshadow } from '@/fonts';
import { basicMeta, basicViewport } from '@/meta/basicmeta';
import styles from '@/styles/home.module.css';
import { Audios, Videos } from '@/types/vanko.type';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Loading from '../loading';

export const metadata = basicMeta;
export const viewport = basicViewport;

const tableImgUrl = [
  {
    url: 'url(/assets/img/seonangthumb.webp)',
    tablelink: '/seonang',
    tabletext: `Past>>>\n`,
    tabletext2: `서낭축원`,
    color: '#ffff0091',
    per: '50%',
  },
  {
    url: 'url(/assets/img/eclipsethumb.webp)',
    tablelink: '',
    tabletext: `Upcoming>>>\n`,
    tabletext2: `Eclipse`,
    color: '#ffff0091',
    per: '50%',
  },
];

const linkBtnUrl = [
  {
    url: 'https://www.instagram.com/vanko.live',
    target: '_blank',
  },
  {
    url: 'https://www.youtube.com/@vankolive',
    target: '_blank',
  },
  {
    url: '/contact',
    target: '_self',
  },
];

const linkBtnText = ['instagram', 'youtube', 'contact'];

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_AUDIOS],
    queryFn: () => getAudios(),
  });
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: () => getVideos(),
  });
  const audios = await queryClient.ensureQueryData<Audios[]>({
    queryKey: [QUERY_KEY_AUDIOS],
    queryFn: () => getAudios(),
  });
  const videos = await queryClient.ensureQueryData<Videos[]>({
    queryKey: [QUERY_KEY_VIDEOS],
    queryFn: () => getVideos(),
  });

  const selectedVideos = videos.filter((video) => video.isSelected);
  const dehydratedState = dehydrate(queryClient);

  return (
    <Suspense fallback={<Loading />}>
      <HydrationBoundary state={dehydratedState}>
        <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
          <div className={styles.back}>
            <Floatings />

            <div className={styles.title0}>
              <div className={styles.marqueecontent}>
                <Image
                  alt="dragon"
                  src="/assets/gifs/dragon.gif"
                  style={{ width: '2.5rem', height: '2.5rem' }}
                  unoptimized
                ></Image>
                <p>{"Welcome to Vanko's Home! Relax with computer music, art and etc..."}</p>
                <Image
                  alt="dragon"
                  src="/assets/gifs/dragon.gif"
                  style={{ width: '2.5rem', height: '2.5rem' }}
                  unoptimized
                ></Image>
              </div>
            </div>

            <VankoMainLogo />

            <BorderLine />

            <div className={styles.title3} style={{ fontFamily: 'auto' }}>
              <p>★Now Showing★</p>
            </div>

            <VanPlayer bgmsList={audios} />

            <table className={`${styles.vantable} ${vastshadow.variable}`}>
              <thead></thead>
              <tbody>
                <tr>
                  <td className={styles.project} colSpan={2}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        touchAction: 'none',
                      }}
                    >
                      <Link href={'/ffd'} prefetch={false} scroll={false}>
                        <div
                          className={styles.glitchmain}
                          style={{
                            backgroundImage: 'url(/assets/img/ffdthumb.webp)',
                          }}
                        >
                          <div className={`${styles.channel} ${styles.r}`}></div>
                          <div className={`${styles.channel} ${styles.g}`}></div>
                          <div className={`${styles.channel} ${styles.b}`}></div>
                        </div>
                      </Link>
                    </div>
                  </td>
                </tr>
                {tableImgUrl.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td className={styles.bordertd} style={{ width: '40%' }}>
                        {e.tablelink ? (
                          <Link href={e.tablelink} target="_blank" prefetch={false}>
                            <div
                              className={styles.glitch}
                              style={{
                                backgroundImage: e.url,
                                width: e.per,
                                margin: '0 auto',
                                filter: 'brightness(0.6)',
                              }}
                            >
                              <div className={`${styles.channel} ${styles.r}`}></div>
                              <div className={`${styles.channel} ${styles.g}`}></div>
                              <div className={`${styles.channel} ${styles.b}`}></div>
                            </div>
                          </Link>
                        ) : (
                          <div
                            className={styles.glitch}
                            style={{
                              backgroundImage: e.url,
                              width: e.per,
                              margin: '0 auto',
                              filter: 'brightness(0.8)',
                            }}
                          >
                            <div className={`${styles.channel} ${styles.r}`}></div>
                            <div className={`${styles.channel} ${styles.g}`}></div>
                            <div className={`${styles.channel} ${styles.b}`}></div>
                          </div>
                        )}
                      </td>
                      <td
                        className={`${styles.bordertd} ${styles.bordertdright}`}
                        style={{ color: e.color }}
                      >
                        {e.tabletext}
                        <span
                          className={`${styles.tabletitle} ${styles.vantableko} ${vastshadow.variable}`}
                        >
                          {e.tabletext2}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <BorderLine />

            <MainGallery selectedVideos={selectedVideos} />

            <div className={styles.arcbtnbox}>
              <Link href="/archive" prefetch={false}>
                <p className={`${styles.arcbtn} ${silkscreen.className}`}>archive</p>
              </Link>
            </div>

            <div className={`${styles.link} ${lobster.className}`}>
              {linkBtnUrl.map((e, i) => {
                return (
                  <div className={styles.link2} key={i}>
                    <Link prefetch={false} href={e.url} target={e.target}>
                      {linkBtnText[i]}
                    </Link>
                  </div>
                );
              })}
            </div>

            <Hadan />
          </div>
        </div>
      </HydrationBoundary>
    </Suspense>
  );
}
