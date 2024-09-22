'use client';

import styles from '@/styles/admin.module.css';
import { Audios } from '@/types/vanko.type';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface MainAdminProps {
  audios: Audios[];
}

export default function MainAdmin({ audios }: MainAdminProps) {
  const [audioAll, setAudioAll] = useState(audios);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null); // 인덱스저장용
  const [mp3files, setMp3Files] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState(null);
  const [upLoad, setUpLoad] = useState(false);

  const mp3FilesInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickSonglist = (i: number) => () => {
    setSelectedAudio(i);
  };

  const moveUp = () => {
    if (selectedAudio === null || selectedAudio <= 0) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음
    setSelectedAudio(selectedAudio - 1);
    const newList = [...audioAll];
    [newList[selectedAudio], newList[selectedAudio - 1]] = [
      newList[selectedAudio - 1],
      newList[selectedAudio],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i;
    }); // 퍼블릭넘 순서 재정의
    setAudioAll(newList);
  };

  const moveDown = () => {
    if (selectedAudio === audioAll.length - 1 || selectedAudio === null) return;
    setSelectedAudio(selectedAudio + 1);
    const newList = [...audioAll];
    [newList[selectedAudio], newList[selectedAudio + 1]] = [
      newList[selectedAudio + 1],
      newList[selectedAudio],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i;
    }); // 퍼블릭넘 순서 재정의
    setAudioAll(newList);
  };

  const handleMp3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const fileArray = Array.from(files).map((file) => file.name);
      setMp3Files(fileArray);
    }
  };

  const audioSetFetch = async () => {
    // try {
    //   const pack = {
    //     action: 'audioset',
    //     audios: list,
    //   };
    //   const req = {
    //     method: 'POST',
    //     cache: 'no-store',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`,
    //     },
    //     body: JSON.stringify(pack),
    //   };
    //   const response = await fetch('/api/archiveset', req);
    //   if (response.ok) {
    //     const result = await response.json();
    //     return result;
    //   } else {
    //     console.log('vanaudio set 서버에서 실패', await response.json());
    //     alert('실패하였습니다');
    //   }
    // } catch (error) {
    //   console.error('곡 업로드 후 db 셋팅 중 에러 발생', error);
    // }
  };

  const mp3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // 로딩 시작
    if (!mp3FilesInputRef.current?.files) {
      alert('파일 업로드 참조가 없습니다.');
      return;
    }
    try {
      // FormData 인스턴스를 생성합니다.
      const formData = new FormData();

      // input 타입 file의 파일들을 가져옵니다.
      const files = mp3FilesInputRef.current.files;

      if (files.length === 0) {
        alert('업로드할 파일을 선택해주세요.');
      } else {
        setUpLoad(true);
        // 각 파일을 FormData에 추가합니다.
        for (let i = 0; i < files.length; i++) {
          formData.append('file', files[i]);
        }
        // FormData를 사용하여 서버에 POST 요청을 보냅니다.
        try {
          // 파일이 있는지 확인하고 FormData에 추가합니다.
          const response = await fetch('/api/storageset', {
            method: 'POST',
            cache: 'no-store',
            // 'Content-Type' 헤더를 설정하지 않음으로써 브라우저가 자동으로 필요한 헤더를 설정하도록 합니다.
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`,
            },
            body: formData,
          });

          if (response.ok) {
            const result = await response.json();
            setUrls(result.list);
            setUpLoad(false);
            console.log('파일 업로드 성공', result);
          } else {
            console.error('파일 업로드 실패');
          }
        } catch (error) {
          console.error('파일 업로드 중 에러 발생', error);
        }
      }
    } catch (error) {
      console.error('업로드 중 에러 발생', error);
    }
    setIsLoading(false); // 로딩 종료
  };

  const audioNumSubmit = async () => {
    // if (confirm('순서를 확인하셨습니까?')) {
    //   try {
    //     const pack = {
    //       action: 'audionum',
    //       audioall: audioAll,
    //     };
    //     const req = {
    //       method: 'POST',
    //       cache: 'no-store',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`,
    //       },
    //       body: JSON.stringify(pack),
    //     };
    //     const response = await fetch('/api/archiveset', req);
    //     if (response.ok) {
    //       console.log('오디오 순서 업데이트 성공');
    //       alert('곡 순서 업데이트 성공했습니다');
    //       window.location.href = '/vankoadmin?id=0';
    //     } else {
    //       console.log('오디오 순서 업데이트 서버에서 실패', await response.json());
    //       alert('곡 순서 업데이트에 실패하였습니다');
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
    //   }
    // } else {
    //   alert('다시 검토해 주세요.');
    // }
  };

  const clickTrash = async () => {
    // const newList = [...audioAll];
    // const selectedItem = newList[selectedAudio];
    // if (!selectedItem) {
    //   alert('먼저 지울 아이템을 선택해 주세요!');
    // } else if (confirm('해당 아이템을 삭제하시겠습니까?')) {
    //   const pack = {
    //     action: 'audiodel',
    //     item: selectedItem,
    //   };
    //   const req = {
    //     method: 'POST',
    //     cache: 'no-store',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`,
    //     },
    //     body: JSON.stringify(pack),
    //   };
    //   const response = await fetch('/api/archiveset', req);
    //   if (response.ok) {
    //     console.log('삭제 성공');
    //     alert('아이템 삭제에 성공했습니다.');
    //     window.location.href = '/vankoadmin?id=0';
    //   } else {
    //     console.log('삭제 서버에서 실패');
    //     alert('아이템 삭제에 실패하였습니다');
    //     window.location.href = '/vankoadmin?id=0';
    //   }
    // } else {
    //   alert('다시 진행해 주세요.');
    // }
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
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '23%',
          zIndex: '5',
          display: upLoad ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '1rem',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          width: '100vw',
          backgroundColor: '#3b6ea5',
        }}
      >
        <p style={{ color: 'white', fontSize: '2rem' }}>{`...업로드중입니다...`}</p>
      </div>

      <div className={styles.mainadminleftbox}>
        <div className={styles.audiobox}>
          <div style={{ display: 'flex' }}>
            <div className={styles.vancircle}></div>
            <p className={styles.vanampp}>VanAmp</p>
            <div className={styles.vancircle}></div>
          </div>

          <p className={styles.musicmoklok}>{'===== 현재 곡 목록 ====='}</p>
          <div className={styles.audiocontents}>
            {audioAll.map((e, i) => (
              <p
                key={i}
                style={{
                  color: selectedAudio === i ? 'white' : undefined,
                  backgroundColor: selectedAudio === i ? 'blue' : undefined,
                }}
                onClick={handleClickSonglist(i)}
              >
                {e.title}
              </p>
            ))}
            <br />
          </div>

          <div className={styles.mainfooter}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{ width: '5rem', color: 'white' }}
                className={styles.movebtn}
                onClick={moveUp}
              >
                {'↑'}
              </div>
              <div
                style={{ width: '5rem', color: 'white' }}
                className={styles.movebtn}
                onClick={moveDown}
              >
                {'↓'}
              </div>
            </div>

            <div className={styles.logoutbtn} onClick={audioNumSubmit} style={{ color: 'white' }}>
              순서변경적용
            </div>
            <div>
              <Image
                src="/assets/img/trashicon.webp"
                onClick={clickTrash}
                alt="휴지통"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form
            onSubmit={mp3Submit}
            encType="multipart/form-data"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div className={styles.mpthreebox}>
              <label className={styles.mpthreetitle} htmlFor="mp3">
                MP3를 선택하세요
              </label>
              <input
                ref={mp3FilesInputRef}
                type="file"
                id="mp3"
                name="mp3"
                accept="mp3"
                multiple
                onChange={handleMp3Change}
                style={{ width: '96%', fontSize: '1rem' }}
              />
              <div className={styles.mpthreeselect}>
                <p style={{ textAlign: 'center', borderBottom: '2px solid grey' }}>선택된 파일들</p>
                {mp3files &&
                  mp3files.map((e, i) => (
                    <p
                      key={i}
                      style={{ fontFamily: 'auto', paddingLeft: '0.2rem', boxSizing: 'border-box' }}
                    >
                      {e}
                    </p>
                  ))}
              </div>
              <button
                className={styles.logoutbtn}
                style={{
                  marginBottom: '0.8rem',
                  color: 'black',
                  backgroundColor: 'lightgrey',
                  border: '2px outset',
                }}
              >
                mp3업로드
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
