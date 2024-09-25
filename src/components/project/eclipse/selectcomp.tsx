'use client';

import styles from '@/styles/eclipse.module.css';
import { useState } from 'react';
import { eclipseNodes } from './eclipsenodes';

type to = {
  name: string;
  number: number;
  isSelect: boolean;
  select: {
    one: (string | never)[];
    two: (string | never)[];
    three: (string | never)[];
    four: (string | never)[];
    five: (string | never)[];
  };
  isEvents: boolean;
  events: {
    condition: number;
    type: string;
    action: string;
  }[];
  background: string;
  order: string;
  android: string[];
  player: string[];
  narration: string[];
  to: number | null;
};

// 대화를 순서대로 합쳐서 배열로 리턴해주는 함수 : 파라미터로는 안드로이드, 플레이어 등 대화 배열을 두개 받음
function mergeArraysAlternately(arr1: string[], arr2: string[]) {
  // 파라미터로 받은 배열 2개 중에 긴쪽의 length 를 찾기
  const maxLength = Math.max(arr1.length, arr2.length);
  // 리턴할 배열 초기화 선언
  const result = [];

  // for문 : 위에서 찾은 긴 length 를 기준으로 반복
  for (let i = 0; i < maxLength; i++) {
    // 핵심은 if 문이 병렬로 있다는 것!
    // for문의 인덱스가 파라미터로 받은 배열1의 길이보다 작을때 실행
    if (i < arr1.length) {
      // 파라미터로 받은 배열1의 '인덱스' 번을 최종 리턴할 배열에 push
      result.push(arr1[i]);
    }
    // for문의 인덱스가 파라미터로 받은 배열2의 길이보다 작을때 실행
    if (i < arr2.length) {
      result.push(arr2[i]);
    }
  }

  return result;
}

function getConversation(to: to) {
  // 대화의 순서 판단
  if (to.order === 'android') {
    // 시작순서에 맞게 대화를 교차로 배열화
    return mergeArraysAlternately(to.android, to.player);
  } else if (to.order === 'player') {
    return mergeArraysAlternately(to.player, to.android);
  } else if (to.order === 'player-solo') {
    return mergeArraysAlternately(to.player, []);
  } else if (to.order === 'narration') {
    return mergeArraysAlternately(to.narration, []);
  } else if (to.order === 'none') {
    return [];
  } else {
    return [];
  }
}

export default function SelectComp() {
  const [currentObject, setCurrentObject] = useState(eclipseNodes[0]); // 선택된 대화(오브젝트), 기본값 [0] 이고 이걸 기준으로 컴포넌트 리턴 생성
  const [conversation, setConversation] = useState<[boolean, string[]]>([
    // state 의 0 번은 대화가 있냐 없냐 를 boolean 으로
    true,
    // state 의 1 번은 최종적으로 순서대로 합쳐진 대화 배열
    [eclipseNodes[0].android[0], eclipseNodes[0].player[0]],
  ]);

  // 클릭시 실행되는 세팅하는 함수
  const setDataWhenClick = (e: React.MouseEvent<HTMLParagraphElement>) => {
    const target = e.target as HTMLParagraphElement;
    const type = target.dataset.type;

    // 만약 next 클릭이면
    if (type === 'next') {
      // currentObject 의 to (다음 시퀀스의 번호) 와 일치하는 객체를 기준 배열(eclipseNodes)에서 찾아라
      const to = eclipseNodes.find((e) => e.number === (currentObject.to as number));
      setCurrentObject(to ?? currentObject);

      // 대화를 설정하는 함수(getConversation)를 실행 (mergeArraysAlternately도 실행됨)
      if (to && typeof to === 'object' && 'number' in to) {
        const currentConversation = getConversation(to as any);

        // 최종적으로 찾은 대화 배열이 0 보다 크면, 대화가 있는 것이니까 true 반환 / 아니면 false
        const isConversation = currentConversation.length > 0;

        // setState의 첫번째 배열 값으로는 boolean(대화 있냐 없냐 - 렌더링용), 두번재 배열 값으로는 찾아온 최종 대화 배열
        setConversation([isConversation, currentConversation]);
      }
    } else if (type === 'one') {
      // currentObject 의 select.one[1] (다음 시퀀스의 번호) 와 일치하는 객체를 기준 배열(eclipseNodes)에서 찾아라
      const to = eclipseNodes.find((e, i) => e.number === currentObject.select.one[1]);
      // 찾은 객체로 setState

      setCurrentObject(to as any);
      // 대화를 설정하는 함수(getConversation)를 실행 (mergeArraysAlternately도 실행됨)
      const currentConversation = getConversation(to as any);

      // 최종적으로 찾은 대화 배열이 0 보다 크면, 대화가 있는 것이니까 true 반환 / 아니면 false
      const isConversation = currentConversation.length > 0;

      // setState의 첫번째 배열 값으로는 boolean(대화 있냐 없냐 - 렌더링용), 두번재 배열 값으로는 찾아온 최종 대화 배열
      setConversation([isConversation, currentConversation]);
    } else if (type === 'two') {
      const to = eclipseNodes.find((e, i) => e.number === currentObject.select.two[1]);
      setCurrentObject(to as any);

      const currentConversation = getConversation(to as any);

      const isConversation = currentConversation.length > 0;

      setConversation([isConversation, currentConversation]);
    } else if (type === 'three' || type === 'four' || type === 'five') {
      // const to = eclipseNodes.find((e, i) => e.number === currentObject.select[type][1]);
      // 아직 이 아래는 없음!!
      // setCurrentObject( to );
      // const currentConversation = getConversation(to);
      // const isConversation = currentConversation.length > 0;
      // setConversation([ isConversation, currentConversation]);
    }
  };

  return (
    <div className={styles.conversationbox}>
      <p style={{ whiteSpace: 'pre-line' }}>{currentObject.background}</p>

      {conversation[1]?.map((e: any, i: any) => (
        <p key={i} style={{ whiteSpace: 'pre-line' }}>
          {e}
        </p>
      )) ?? null}

      {currentObject.isSelect && (
        <div>
          <p data-type="one" onClick={setDataWhenClick}>
            {currentObject.select.one[0]}
          </p>
          <p data-type="two" onClick={setDataWhenClick}>
            {currentObject.select.two[0]}
          </p>
          {currentObject.select.three.length > 0 && (
            <p data-type="three" onClick={setDataWhenClick}>
              {currentObject.select.three[0]}
            </p>
          )}
          {currentObject.select.four.length > 0 && (
            <p data-type="four" onClick={setDataWhenClick}>
              {currentObject.select.four[0]}
            </p>
          )}
          {currentObject.select.five.length > 0 && (
            <p data-type="five" onClick={setDataWhenClick}>
              {currentObject.select.five[0]}
            </p>
          )}
        </div>
      )}

      {currentObject.isSelect === false && (
        <div data-type="next" onClick={setDataWhenClick}>
          next
        </div>
      )}
    </div>
  );
}
