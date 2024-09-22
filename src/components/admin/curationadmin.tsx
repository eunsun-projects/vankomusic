'use client';

import styles from '@/components/admin/page.module.css';
import { righteous } from '@/fonts';
import { Videos } from '@/types/vanko.type';
import Image from 'next/image';
import { useState } from 'react';

interface CurationAdminProps {
  videos: Videos[];
  curation: Videos[];
}

export default function CurationAdmin({ videos, curation }: CurationAdminProps) {
  const [curatedVideo, setCuratedVideo] = useState(curation);
  const [selectedCuratedItem, setSelectedCuratedItem] = useState<number | null>(null); // 선택된 큐레이션 아이템 인덱스
  const [selectedAllItemIndex, setSelectedAllItemIndex] = useState<number | null>(null); // 선택된 전체 아이템 인덱스
  const [selectedItem, setSelectedItem] = useState<Videos | null>(null); // 전체목록에서 선택된 아이템 객체

  // 큐레이션 목록에서 클릭시
  const clickCuratedTitle = (index: number) => () => {
    setSelectedCuratedItem(index);
  };

  // 휴지통 클릭시
  const clickTrash = () => {
    if (selectedCuratedItem !== null) {
      setCuratedVideo((prev) => prev.splice(selectedCuratedItem, 1));
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
    if (selectedCuratedItem === null) return;
    if (selectedCuratedItem <= 0) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음
    setSelectedCuratedItem(selectedCuratedItem - 1);
    const newList = [...curatedVideo];
    [newList[selectedCuratedItem], newList[selectedCuratedItem - 1]] = [
      newList[selectedCuratedItem - 1],
      newList[selectedCuratedItem],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i;
    }); // 넘버 순서 재정의
    setCuratedVideo(newList);
  };

  const moveDown = () => {
    if (selectedCuratedItem === null) return;
    if (selectedCuratedItem >= curatedVideo.length - 1) return;
    setSelectedCuratedItem(selectedCuratedItem + 1);
    const newList = [...curatedVideo];
    [newList[selectedCuratedItem], newList[selectedCuratedItem + 1]] = [
      newList[selectedCuratedItem + 1],
      newList[selectedCuratedItem],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i;
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
        e.number = i;
      }); // 배열 넘버 프로퍼티 재정렬
      setCuratedVideo(newList);
    }
  };

  const finalSubmit = async () => {
    if (curation === curatedVideo) {
      alert('변경점이 없습니다!');
    } else if (curatedVideo.length !== 8) {
      alert('8개 항목을 채워주세요!');
      window.location.href = '/vankoadmin?id=2';
    } else {
      console.log(curatedVideo);
      if (confirm('큐레이션 리스트를 이대로 수정하시겠습니까?')) {
        try {
          const pack = {
            action: 'updatecuration',
            curationList: curatedVideo,
          };

          const req = {
            method: 'POST',
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`,
            },
            body: JSON.stringify(pack),
          };
          const response = await fetch('/api/archiveset', req);

          if (response.ok) {
            console.log('큐레이션 업데이트 성공');
            alert('curated 리스트 업데이트 성공했습니다');
            window.location.href = '/vankoadmin?id=2';
          } else {
            console.log('큐레이션 업데이트 서버에서 실패', await response.json());
            alert('curated 리스트 업데이트에 실패하였습니다');
            window.location.href = '/vankoadmin?id=2';
          }
        } catch (error) {
          console.log(error);
          alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
        }
      } else {
        alert('다시 진행해 주세요.');
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
            style={{ width: '3rem', height: '3rem', marginRight: '0.5rem' }}
            src="/assets/img/pizza.webp"
            alt="pizza"
            unoptimized
          ></Image>
          <div className={`${styles.line} ${styles.linetrans}`}></div>
          <Image
            style={{ width: '3rem', height: '3rem', marginLeft: '0.5rem' }}
            src="/assets/img/pizza.webp"
            alt="pizza"
            unoptimized
          ></Image>
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
                    color: selectedCuratedItem === i ? 'black' : undefined,
                    backgroundColor: selectedCuratedItem === i ? 'aqua' : undefined,
                    width: '100%',
                    height: '100%',
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
