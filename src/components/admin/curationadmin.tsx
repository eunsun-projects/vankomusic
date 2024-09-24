'use client';

import { righteous } from '@/fonts';
import { useCurationMutation } from '@/hooks/mutations/curations.mutation';
import styles from '@/styles/admin.module.css';
import { Videos } from '@/types/vanko.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CurationAdminProps {
  videos: Videos[];
  curations: Videos[];
}

export default function CurationAdmin({ videos, curations }: CurationAdminProps) {
  const [curatedVideo, setCuratedVideo] = useState(curations);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null); // 선택된 큐레이션 아이템 인덱스
  const [selectedAllItemIndex, setSelectedAllItemIndex] = useState<number | null>(null); // 선택된 전체 아이템 인덱스
  const [selectedItem, setSelectedItem] = useState<Videos | null>(null); // 전체목록에서 선택된 아이템 객체
  const router = useRouter();

  const { mutateAsync: postCuration } = useCurationMutation();

  // 큐레이션 목록에서 클릭시
  const clickCuratedTitle = (index: number) => () => {
    setSelectedItemIndex(index);
  };

  // 휴지통 클릭시
  const clickTrash = () => {
    if (selectedItemIndex !== null) {
      setCuratedVideo((prev) => prev.splice(selectedItemIndex, 1));
    } else {
      alert('먼저 삭제할 아이템을 선택해주세요');
    }
  };

  // 전체 목록에서 클릭시
  const clickAllTitle = (item: Videos, index: number) => () => {
    setSelectedAllItemIndex(index);
    setSelectedItem(item);
  };

  const moveUp = () => {
    if (selectedItemIndex === null) return;
    if (selectedItemIndex <= 0) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음
    setSelectedItemIndex(selectedItemIndex - 1);
    const newList = [...curatedVideo];
    [newList[selectedItemIndex], newList[selectedItemIndex - 1]] = [
      newList[selectedItemIndex - 1],
      newList[selectedItemIndex],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.curated_number = i;
    }); // 넘버 순서 재정의
    setCuratedVideo(newList);
  };

  const moveDown = () => {
    if (selectedItemIndex === null) return;
    if (selectedItemIndex >= curatedVideo.length - 1) return;
    setSelectedItemIndex(selectedItemIndex + 1);
    const newList = [...curatedVideo];
    [newList[selectedItemIndex], newList[selectedItemIndex + 1]] = [
      newList[selectedItemIndex + 1],
      newList[selectedItemIndex],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.curated_number = i;
    }); // 넘버 순서 재정의
    setCuratedVideo(newList);
  };

  const addToCurated = () => {
    if (curatedVideo.length === 8) {
      alert('먼저 기존 아이템을 1개 이상 삭제해 주세요');
    } else if (selectedItem === null) {
      alert('먼저 옮길 아이템을 선택해주세요');
    } else {
      const newList = [...curatedVideo]; // 배열 복사
      newList.push(selectedItem); // 배열의 마지막에 선택된 아이템 추가
      newList.forEach((e, i) => {
        e.curated_number = i;
      }); // 배열 넘버 프로퍼티 재정렬
      setCuratedVideo(newList);
    }
  };

  const finalSubmit = async () => {
    if (curations === curatedVideo) {
      alert('변경점이 없습니다!');
      return;
    } else if (curatedVideo.length !== 8) {
      alert('8개 항목을 채워주세요!');
      return;
    } else {
      if (confirm('큐레이션 리스트를 이대로 수정하시겠습니까?')) {
        await postCuration(curatedVideo);
        router.refresh();
      } else {
        return;
      }
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        boxSizing: 'border-box',
        gap: '3rem',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {/** 왼쪽 큐레이션 박스 */}
      <div className={styles.seleclistbox}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '1rem',
          }}
        >
          <Image
            style={{ width: '3rem', height: 'auto', marginRight: '0.5rem' }}
            src="/assets/img/pizza.webp"
            alt="pizza"
            width={48}
            height={48}
            unoptimized
          />
          <div className={`${styles.line} ${styles.linetrans}`}></div>
          <Image
            style={{ width: '3rem', height: 'auto', marginLeft: '0.5rem' }}
            src="/assets/img/pizza.webp"
            alt="pizza"
            width={48}
            height={48}
            unoptimized
          />
        </div>

        <div className={styles.selectitleconbox}>
          <div
            style={{
              width: '100%',
              height: '12rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '3rem',
            }}
          >
            {curatedVideo.map((e, i) => {
              return (
                <div
                  className={`${styles.titleboxall} ${righteous.className}`}
                  style={{
                    color: selectedItemIndex === i ? 'black' : undefined,
                    backgroundColor: selectedItemIndex === i ? 'aqua' : undefined,
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  key={i}
                >
                  <p onClick={clickCuratedTitle(i)}>{e.title}</p>
                </div>
              );
            })}
          </div>
        </div>
        {/** 위 아래 전송 휴지통 박스 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1.5rem',
              boxSizing: 'border-box',
              paddingLeft: '1rem',
            }}
          >
            <div style={{ width: '30%', display: 'flex' }}>
              <div
                className={styles.movebtn}
                style={{
                  fontSize: '2rem',
                  paddingTop: '0.1rem',
                  color: 'blue',
                  fontFamily: 'DungGeunMo',
                  lineHeight: '1rem',
                }}
                onClick={moveUp}
              >
                {'←'}
              </div>
              <div
                className={styles.movebtn}
                style={{
                  fontSize: '2rem',
                  paddingTop: '0.1rem',
                  color: 'blue',
                  fontFamily: 'DungGeunMo',
                  lineHeight: '1rem',
                }}
                onClick={moveDown}
              >
                {'→'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '50%',
                boxSizing: 'border-box',
              }}
            >
              <div
                className={styles.fixbtn}
                style={{
                  backgroundColor: 'red',
                  height: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '3px outset #f33',
                  color: '#00ff2b',
                  fontFamily: 'DungGeunMo',
                }}
                onClick={finalSubmit}
              >
                최종 적용
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/assets/img/trashicon.webp"
              onClick={clickTrash}
              alt="trashicon"
              unoptimized
            ></Image>
          </div>
        </div>
      </div>

      {/** 중앙 버튼 */}
      <div
        style={{
          width: '4rem',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className={styles.logoutbtn} onClick={addToCurated}>
          <p>{'<<<'}</p>
        </div>
      </div>

      {/** 오른쪽 전체 박스 */}
      <div className={styles.listbox}>
        <div className={styles.listtile}>
          <Image
            style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}
            src="/assets/img/cd.webp"
            alt="cd"
            unoptimized
          ></Image>
          <p>Archive All List</p>
          <Image
            style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }}
            src="/assets/img/cd.webp"
            alt="cd"
            unoptimized
          ></Image>
        </div>

        <div style={{ height: '30rem', width: '90%', margin: '0 auto' }}>
          <div className={styles.titleconbox}>
            <div className={styles.allbox} style={{ height: '30rem', overflowY: 'scroll' }}>
              {videos.map((e, i) => (
                <div
                  onClick={clickAllTitle(e, i)}
                  className={styles.titlebox}
                  style={{
                    color: selectedAllItemIndex === i ? 'white' : undefined,
                    backgroundColor: selectedAllItemIndex === i ? 'blue' : undefined,
                    width: '100%',
                  }}
                  key={i}
                >
                  <p>{e.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
