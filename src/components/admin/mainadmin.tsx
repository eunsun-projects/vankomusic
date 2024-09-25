'use client';

import { useAudiosMutation } from '@/hooks/mutations';
import styles from '@/styles/admin.module.css';
import { Audios } from '@/types/vanko.type';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface MainAdminProps {
  audios: Audios[];
}

export default function MainAdmin({ audios }: MainAdminProps) {
  const [audioAll, setAudioAll] = useState(audios);
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null); // 인덱스저장용
  const [mp3files, setMp3Files] = useState<string[] | null>(null);

  const mp3FilesInputRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync: postAudios, isPending } = useAudiosMutation();
  const router = useRouter();

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

  const handleMp3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mp3FilesInputRef.current?.files) {
      alert('파일 업로드 참조가 없습니다.');
      return;
    }
    // FormData 인스턴스를 생성합니다.
    const formData = new FormData();
    // input 타입 file의 파일들을 가져옵니다.
    const files = mp3FilesInputRef.current.files;
    if (files.length === 0) alert('업로드할 파일을 선택해주세요.');

    if (confirm('업로드하시겠습니까?')) {
      // 각 파일을 FormData에 추가합니다.
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      // FormData를 사용하여 서버에 POST 요청을 보냅니다.
      await postAudios({ files: formData, audios: null, mode: 'add' });
      router.refresh();
    } else {
      alert('업로드를 취소하였습니다.');
    }
  };

  const handleOrderClick = async () => {
    if (confirm('순서를 확인하셨습니까?')) {
      await postAudios({ files: null, audios: audioAll, mode: 'order' });
      router.refresh();
    } else {
      alert('순서변경을 취소하였습니다.');
    }
  };

  const hanldeDeleteClick = async () => {
    const filteredAudios = audioAll.find((_, i) => i === selectedAudio);
    if (!filteredAudios) return;
    if (confirm('삭제하시겠습니까?')) {
      await postAudios({ files: null, audios: filteredAudios, mode: 'delete' });
      router.refresh();
    } else {
      alert('삭제를 취소하였습니다.');
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
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: '23%',
          zIndex: '5',
          display: isPending ? 'flex' : 'none',
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

            <div className={styles.logoutbtn} onClick={handleOrderClick} style={{ color: 'white' }}>
              순서변경적용
            </div>
            <div>
              <img src="/assets/img/trashicon.webp" onClick={hanldeDeleteClick} alt="휴지통" />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form
            onSubmit={handleMp3Submit}
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
