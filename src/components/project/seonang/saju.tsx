import { TaroBig } from '@/components/project/seonang';
import { useWishsMutation } from '@/hooks/mutations/wishs.mutation';
import styles from '@/styles/seonang.module.css';
import { Wishs } from '@/types/vanko.type';
import { nanoid } from 'nanoid';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const taropicture = [
  {
    src: '/assets/img/taro/taro_money',
    con: '금전',
    count: 5,
    text0: '올해 재물과 큰 복이 함께 들어올 예정이군요.\n그 기회를 놓치지 마시길…!',
    text1: '갑자기 나타난 큰 힘이 당신을 도울 것입니다.\n겸손하고 차분하게 올라가세요.',
    text2: '꿈 꾸던 그때가 바로 올해 4월입니다.\n여권을 준비 하세욧!',
    text3: '어머 9월에 대목이 있군요.\n아마 말 안 해도 짐작하실듯?',
    text4: '이 정도 운이면 혼자라도 외롭지는 않을거예요.\n…꼭 그럴거예요.',
  },
  {
    src: '/assets/img/taro/taro_honor',
    con: '명예',
    count: 3,
    text0: '강한 리더는 외로운 법이지만\n타인의 고통도 더 헤아려 주세요.',
    text1: '모두가 두려워 하는 추운 계절에\n더 화려하게 만개할 운명이군요!',
    text2: '대천사의 가호 아래\n귀인으로 거듭날 것입니다.',
  },
  {
    src: '/assets/img/taro/taro_luck',
    con: '행운',
    count: 3,
    text0: '신의 버프를 받아 행운 지수가 260% 증가합니다..!\n긍정적인 기운 잔뜩 드릴게요!',
    text1:
      '올해 바다로 여행을 간다면 좋은 일이 생길 운이 있네요.\n기운이 좋은 달은 4월, 9월입니다.',
    text2: '우주의 기운을 받아 모든 액운을 물리칩니다.\n뒤로 넘어져도 돈을 줍는 행운이 따릅니다.  ',
  },
  {
    src: '/assets/img/taro/taro_affection',
    con: '애정',
    count: 4,
    text0: '죽은 당신의 심장을 뛰게 만들 새로운 상대가 생깁니다.  ',
    text1: '운명의 배필을 만나 가약까지 할 수 있는 가을입니다.',
    text2: '스스로를 더 사랑하기 좋은 해입니다..!\n조..좋은 사랑하세요!',
    text3: '귀여운 친구들과 산책을 나가면\n특별한 인연이 생길지도?',
  },
  {
    src: '/assets/img/taro/taro_health',
    con: '건강',
    count: 3,
    text0: '주의!\n기운이 넘쳐서 주변 사람들이 힘들어 할지도 몰라요.',
    text1: '그대의 전생은 소문난 장사였네요.\n조금만 노력하면 금방 건강해질걸요..?',
    text2: '자, 그대가 원하던 "매력"을 드렸습니다.\n올해는 뭔가 달라 보일거예요.',
  },
  {
    src: '/assets/img/taro/taro_childbirth',
    con: '출산',
    count: 3,
    text0: '새로운 가족이 생길 가능성이 높으니\n좋은 마음으로 받아주세요.',
    text1: '조금만 더 기다려보세요.\n더 좋은 때가 있을거예요.',
    text2: '노력의 결실이 있을 것 같네요.\n한 명이 아니네요..?',
  },
  {
    src: '/assets/img/taro/taro_business',
    con: '사업',
    count: 4,
    text0: '아이디어가 문어발처럼 확장 할테니\n정신 꽉 잡고 실행하세요!',
    text1: '당신의 힘은 올해부터 시작입니다..만\n감정에 휩쓸리지 말고 냉정하게!',
    text2: '마음이 흔들리고 있군요.\n다시 균형 잡도록 도와 드릴게요.',
    text3: '선택의 기로에 있군요.\n이익보다는 인정을 택해야 할때입니다.',
  },
  {
    src: '/assets/img/taro/taro_test',
    con: '시험',
    count: 3,
    text0: '출제 의도를 한 눈에 파악할수 있는 개안부적입니다.\n출력하여 책상 밑에 붙여두세요.  ',
    text1: '모두가 선망하는 지식을 손에 넣는 해입니다.\n집중해서 내 것으로 만드세요.',
    text2: '집중력이 최고조에 달하여 암기의 왕이 될 것입니다.\n몽땅 외워 버려욧!',
  },
  {
    src: '/assets/img/taro/taro_family',
    con: '가족',
    count: 3,
    text0: '올해 이동이 있네요.\n순풍으로 무사히 가시도록 기도 드릴게요!',
    text1: '작년엔 잠시 힘들었지만\n올해는 내내 행복할거예요.',
    text2: '반려동물과 궁합이 잘 맞네요!\n가족처럼 친구처럼 행복하시길..!',
  },
  {
    src: '/assets/img/taro/taro_mind',
    con: '마음',
    count: 4,
    text0: '당신을 생각하는 이들이 있어요.\n바로 지금 생각난 사람에게 연락해보세요.',
    text1: '괜찮아요.\n제가 뒤에서 지켜보고 있어요.',
    text2: '마음이 조금씩 무너져 내리는 것 같다면\n조금씩 다시 지을 수 있게 도와줄게요.',
    text3: '온통 다른 곳에 쓰는 마음을\n올해는 자신에게만 써보세요.',
  },
];
// const fullText = `당신은 고독을 즐길줄 아는 분이군요. 올해까지는 더 즐길 수 있을거에요.`;

const sanitizeInput = (input: string) => {
  return input.replace(/[{}()<>`~!@#$%^&*|\[\]\\\'\";:\/?|]/gim, '');
};

function randomThree() {
  return Math.floor(Math.random() * 3); //3분의 1확률로
}
function randomFour() {
  return Math.floor(Math.random() * 4); //4분의 1확률로
}
function randomFive() {
  return Math.floor(Math.random() * 5); //5분의 1확률로
}

function distributing(count: number) {
  switch (count) {
    case 3:
      return randomThree();
      break;

    case 4:
      return randomFour();
      break;

    case 5:
      return randomFive();
      break;

    default:
      console.log('오류');
  }
}

interface SajuProps {
  closeUnse: () => void;
  mobile: boolean;
  android: boolean;
}

export default function Saju({ closeUnse, mobile, android }: SajuProps) {
  const [select, setSelect] = useState(false);
  const [load, setLoad] = useState(false);
  const [newYear, setNewyear] = useState(false);
  const [sowonForm, setSowonForm] = useState(false);
  const [text, setText] = useState('');
  const [fullText, setFullText] = useState('');
  const [index, setIndex] = useState(0);
  const [pngWebp, setPngWebp] = useState<string | null>(null);
  const [taroBig, setTaroBig] = useState(false);

  const isSubmittingRef = useRef(false);
  const sowonRef = useRef<HTMLFormElement | null>(null);

  const { mutate: postWish } = useWishsMutation();

  const sowonClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sowonRef.current) return;
    const final = () => {
      const loadtimer = setTimeout(() => {
        setLoad(true);
        clearTimeout(loadtimer);
      }, 500);
      const picturetimer = setTimeout(() => {
        setLoad(false);
        setNewyear(true);
        clearTimeout(picturetimer);
      }, 5100);
    };
    if (isSubmittingRef.current === false) {
      try {
        isSubmittingRef.current = true;
        if (sowonRef.current.sowoncontents.value.length === 0) {
          final(); // 최종 시퀀스
          return;
        }
        final(); // 240106 최종 시퀀스 진행 위치를 response.ok 에서 여기로 옮김 - response에 관계없이 다음 시퀀스로 넘어가도록

        const sowon: Wishs = {
          contents: sanitizeInput(sowonRef.current.sowoncontents.value),
          created_at: new Date().toISOString(),
          id: nanoid(20),
        };
        postWish(sowon);
      } catch (error) {
        console.error('소원 제출 중 오류 발생:', error);
      } finally {
        isSubmittingRef.current = false;
      }
    }
  };

  const openTaroBig = () => setTaroBig(true);
  const closeTaroBig = () => setTaroBig(false);

  const handleTaro =
    (item: (typeof taropicture)[number]) => (e: React.MouseEvent<HTMLDivElement>) => {
      const resultNum = String(distributing(item.count));
      const toSrc = `${item.src}${resultNum}`;
      const fullText = item[`text${resultNum}` as keyof typeof item] as string;
      setSelect(true);
      setSowonForm(true);
      setPngWebp(toSrc);
      setFullText(fullText);
    };

  useEffect(() => {
    if (newYear && fullText.length > 0) {
      if (index < fullText.length) {
        setTimeout(() => {
          setText((prev) => prev + fullText.charAt(index));
          setIndex((prev) => prev + 1);
        }, 50); // 타이핑 속도 조절
      }
    }
  }, [index, newYear, fullText]);

  return (
    <>
      {taroBig && pngWebp && (
        <TaroBig closeTaroBig={closeTaroBig} pngWebp={pngWebp} mobile={mobile} android={android} />
      )}
      <div className={styles.unseone}>
        <div className={styles.ggongdiv}></div>
        <div className={styles.unsebackground}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
            <p onClick={closeUnse} className={styles.x}>
              X
            </p>
          </div>

          {!sowonForm && (
            <div className={styles.unseimgdiv}>
              <p className={styles.tarochoice}>서낭신께 올릴 소원을 골라주세요...</p>
              <div className={styles.taro}>
                {taropicture.map((item, i) => {
                  return (
                    <div onClick={handleTaro(item)} className={styles.tarobox} key={i}>
                      <Image
                        src="/assets/img/taro/taro_back.webp"
                        className={styles.tarocard}
                        style={{ pointerEvents: select ? 'none' : 'all' }}
                        alt="taroback"
                        unoptimized
                      ></Image>
                      <p>{item.con}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {sowonForm && (
            <div className={styles.marqueeinput}>
              <p>소원을 단정히 적어서 서낭신께 제출하세요...</p>
              <form className={styles.sowonform} ref={sowonRef} onSubmit={sowonClick}>
                <input
                  className={styles.sowonp}
                  type="text"
                  name="sowoncontents"
                  placeholder="진실된 마음으로... "
                  disabled={isSubmittingRef.current}
                ></input>
                <input
                  className={styles.click}
                  type="submit"
                  value="제출하기"
                  disabled={isSubmittingRef.current}
                  style={{ pointerEvents: isSubmittingRef.current ? 'none' : 'all' }}
                ></input>
              </form>
            </div>
          )}

          {load && (
            <div className={styles.loadbackground}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  className={styles.loadimg}
                  src="/assets/gifs/stone.gif"
                  alt="stone"
                  unoptimized
                ></Image>
                <div className={styles.loadbox}>
                  <div className={styles.load}></div>
                </div>
                <p className={styles.loadtext}>서낭신께서 기도를 분석중입니다...</p>
              </div>
              <div className={styles.banzzak}></div>
            </div>
          )}

          <div
            className={styles.newYearground}
            style={{ opacity: newYear ? '1' : '0', zIndex: newYear ? '20001' : '-1' }}
          >
            <p onClick={closeUnse} className={styles.newx}>
              X
            </p>
            <div className={styles.newyearbox}>
              {pngWebp && (
                <Image
                  className={styles.newyearimg}
                  onClick={openTaroBig}
                  src={`${pngWebp}.webp`}
                  alt="taro"
                  unoptimized
                ></Image>
              )}
              <div className={styles.newyear}>
                <p className={styles.movingtext}>{text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
