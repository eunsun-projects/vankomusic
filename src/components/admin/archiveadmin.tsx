'use client';

import styles from '@/components/admin/page.module.css';
import { Videos } from '@/types/vanko.type';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

interface ArchiveAdminProps {
  videos: Videos[];
}

export default function ArchiveAdmin({ videos }: ArchiveAdminProps) {
  const [videoState, setVideoState] = useState(videos);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<Videos | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [oldTitle, setOldTitle] = useState<string | null>(null);

  const updateFormRef = useRef<HTMLFormElement | null>(null);
  const createFormRef = useRef<HTMLFormElement | null>(null);

  const router = useRouter();

  const clickTitle = (i: number) => () => {
    setSelectedNum(i);
    setSelectedItem(videoState[i]);
    setOldTitle(videos[i].id); //if 타이틀을 변경할 수도 있으므로, 변경 전 타이틀을 저장.
  };

  const parseYoutubeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget.value;
    if (input.includes('youtube.com')) {
      const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
      const match = input.match(regex);
      const id = match ? match[1] : null;
      setVideoId(id);
    } else if (input.length < 1) {
      setVideoId(null);
    }
  };

  const setRequestInit = (ref: HTMLFormElement) => {
    const title = ref.title01.value;
    const embed = ref.embed.value;

    const keyword_1 =
      ref.keyword1.value.length > 0 ? ref.keyword1.value : selectedItem?.keywords?.[0];
    const keyword_2 =
      ref.keyword2.value.length > 0 ? ref.keyword2.value : selectedItem?.keywords?.[1];
    const keyword_3 =
      ref.keyword3.value.length > 0 ? ref.keyword3.value : selectedItem?.keywords?.[2];

    const keywords = [keyword_1, keyword_2, keyword_3];
    const desc = ref.desc.value;

    // 기존 배열 (videoall) 에서 새로 입력된 타이틀과 일치하는 아이템 있는지 검색
    const existNumber = videos.find((e) => {
      if (e.title?.toLowerCase().replaceAll(' ', '') === title.toLowerCase().replaceAll(' ', ''))
        return e.number;
    });

    const data = {
      title: title.length > 0 ? title : oldTitle,
      description: desc.length > 0 ? desc : selectedItem?.description,
      keywords: keywords,
      embed: embed.length > 0 ? embed : selectedItem?.embed,
      number: existNumber ? existNumber.number : selectedItem?.number,
      thumb: videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : selectedItem?.thumb,
    };

    return data;
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createFormRef.current) return;
    if (confirm('이 정보로 새로운 아이템을 추가하시겠습니까?')) {
      const data = setRequestInit(createFormRef.current);
      // 여기 뮤테이트 작성 요망
      router.refresh();
    } else {
      alert('다시 진행해 주세요.');
      createFormRef.current.reset();
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!updateFormRef.current) return;
    if (confirm('이 정보로 아이템을 수정하시겠습니까?')) {
      const data = setRequestInit(updateFormRef.current);
      // 여기 뮤테이트 작성 요망
      router.refresh();
    } else {
      alert('다시 진행해 주세요.');
    }
  };

  const moveUp = () => {
    if (selectedNum === null) return;
    if (selectedNum <= 0) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음
    setSelectedNum(selectedNum - 1);
    const newList = [...videoState];
    [newList[selectedNum], newList[selectedNum - 1]] = [
      newList[selectedNum - 1],
      newList[selectedNum],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i;
    }); // 넘버 순서 재정의
    setVideoState(newList);
  };

  const moveDown = () => {
    if (selectedNum === null) return;
    if (selectedNum === videoState.length - 1) return;
    setSelectedNum(selectedNum + 1);
    const newList = [...videoState];
    [newList[selectedNum], newList[selectedNum + 1]] = [
      newList[selectedNum + 1],
      newList[selectedNum],
    ]; // 현재 항목과 위 항목을 서로 바꿈
    newList.forEach((e, i) => {
      e.number = i; // 리스트 길이에서 현재 인덱스를 뺀 값을 할당
    }); // 넘버 순서 재정의
    setVideoState(newList);
  };

  const itemFix = async () => {
    if (videos === videoState) {
      alert('변경점이 없습니다!');
    } else if (confirm('이대로 순서를 수정하시겠습니까?')) {
      // 여기 순서수정 뮤테이트 작성 요망
      router.refresh();
    } else {
      alert('다시 진행해 주세요.');
    }
  };

  const clickTrash = async () => {
    if (!selectedItem) {
      alert('먼저 지울 아이템을 선택해 주세요!');
    } else if (confirm('해당 아이템을 삭제하시겠습니까?')) {
      // 여기 삭제 뮤테이트 작성 요망
      router.refresh();
    } else {
      alert('다시 진행해 주세요.');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        paddingTop: '2rem',
        paddingBottom: '2rem',
        boxSizing: 'border-box',
        gap: '3rem',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 왼쪽박스 두개 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* 업데이트 박스 */}
        <div className={styles.leftboxs}>
          <div className={styles.leftboxstitle}>
            <span style={{ backgroundColor: 'orange' }}>선택된</span> 아이템 수정하기
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', gap: '1rem' }}>
              <div
                className={styles.thumbimgbox}
                style={{
                  backgroundImage: selectedItem ? `url(${selectedItem.thumb})` : undefined,
                }}
              ></div>

              {/* 업데이트 폼 */}
              <form className={styles.formbox} ref={updateFormRef} onSubmit={handleUpdateSubmit}>
                <label>타이틀</label>
                <input
                  type="text"
                  name="title01"
                  placeholder={selectedItem ? (selectedItem.title as string) : '선택요망'}
                  defaultValue={selectedItem ? (selectedItem.title as string) : '선택요망'}
                ></input>

                <label>주소</label>
                <input
                  type="text"
                  name="embed"
                  placeholder={selectedItem ? (selectedItem.embed as string) : '선택요망'}
                  defaultValue={selectedItem ? (selectedItem.embed as string) : '선택요망'}
                ></input>

                <label>간단설명</label>
                <input
                  type="text"
                  name="desc"
                  placeholder={selectedItem ? (selectedItem.description as string) : '선택요망'}
                  defaultValue={selectedItem ? (selectedItem.description as string) : '선택요망'}
                ></input>

                <label>키워드</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                  <input
                    type="text"
                    name="keyword1"
                    style={{ width: '33%' }}
                    placeholder={selectedItem ? (selectedItem.keywords?.[0] as string) : '선택요망'}
                    defaultValue={
                      selectedItem ? (selectedItem.keywords?.[0] as string) : '선택요망'
                    }
                  ></input>
                  <input
                    type="text"
                    name="keyword2"
                    style={{ width: '33%' }}
                    placeholder={selectedItem ? (selectedItem.keywords?.[1] as string) : '선택요망'}
                    defaultValue={
                      selectedItem ? (selectedItem.keywords?.[1] as string) : '선택요망'
                    }
                  ></input>
                  <input
                    type="text"
                    name="keyword3"
                    style={{ width: '33%' }}
                    placeholder={selectedItem ? (selectedItem.keywords?.[2] as string) : '선택요망'}
                    defaultValue={
                      selectedItem ? (selectedItem.keywords?.[2] as string) : '선택요망'
                    }
                  ></input>
                </div>

                <input type="submit" value="update" className={styles.okbtn}></input>
              </form>
            </div>
          </div>
        </div>

        {/* 신규추가 박스 */}
        <div className={styles.leftboxs} style={{ backgroundColor: 'powderblue' }}>
          <div className={styles.leftboxstitle}>
            <span style={{ color: 'white', backgroundColor: 'blue' }}>신규</span> 아이템 추가하기
          </div>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', gap: '2rem' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', gap: '1rem' }}>
              <div
                className={styles.thumbimgbox}
                style={{
                  backgroundImage: videoId
                    ? `url(https://img.youtube.com/vi/${videoId}/0.jpg)`
                    : undefined,
                  backgroundColor: 'aliceblue',
                }}
              ></div>

              {/* 신규 추가 폼 */}
              <form className={styles.formbox} ref={createFormRef} onSubmit={handleCreateSubmit}>
                <label>타이틀</label>
                <input
                  type="text"
                  name="title01"
                  required
                  placeholder={'타이틀을 입력하세요'}
                ></input>

                <label>주소</label>
                <input
                  type="text"
                  name="embed"
                  required
                  placeholder={'유튜브 주소를 붙여넣으세요'}
                  onInput={parseYoutubeUrl}
                ></input>

                <label>간단설명</label>
                <input
                  type="text"
                  name="desc"
                  required
                  placeholder={'간단한 설명을 작성해주세요'}
                ></input>

                <label>키워드</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.4rem' }}>
                  <input
                    type="text"
                    name="keyword1"
                    style={{ width: '33%' }}
                    required
                    placeholder={'키워드1'}
                  ></input>
                  <input
                    type="text"
                    name="keyword2"
                    style={{ width: '33%' }}
                    required
                    placeholder={'키워드2'}
                  ></input>
                  <input
                    type="text"
                    name="keyword3"
                    style={{ width: '33%' }}
                    required
                    placeholder={'키워드3'}
                  ></input>
                </div>

                <input type="submit" value="create" className={styles.okbtn}></input>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 리스트 박스 */}
      <div className={styles.listbox}>
        <div className={styles.listtile}>
          <Image
            style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}
            src="/assets/img/cd.webp"
            alt="cd"
            unoptimized
          />
          <p>Archive All List</p>
          <Image
            style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }}
            src="/assets/img/cd.webp"
            alt="cd"
            unoptimized
          />
        </div>

        <div style={{ height: '28rem', width: '90%', margin: '0 auto' }}>
          <div className={styles.titleconbox}>
            <div className={styles.allbox} style={{ height: '26rem', overflowY: 'scroll' }}>
              {videoState &&
                videoState.map((e, i) => {
                  return (
                    <div
                      onClick={clickTitle(i)}
                      className={styles.titlebox}
                      style={{
                        color: selectedNum === i ? 'white' : undefined,
                        backgroundColor: selectedNum === i ? 'blue' : undefined,
                      }}
                      key={i}
                    >
                      <p>{e.title}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/** 위 아래 전송 휴지통 박스 */}
        <div className={styles.footer}>
          <div
            style={{
              width: '80%',
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                width: '30%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div className={styles.movebtn} onClick={moveUp}>
                {'↑'}
              </div>
              <div className={styles.movebtn} onClick={moveDown}>
                {'↓'}
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
              <div className={styles.fixbtn} onClick={itemFix}>
                순서변경적용
              </div>
            </div>

            <div>
              <Image
                src="/assets/img/trashicon.webp"
                onClick={clickTrash}
                alt="trashicon"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
