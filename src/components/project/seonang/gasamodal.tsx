'use client';

import styles from '@/styles/seonang.module.css';
import { Dispatch, SetStateAction, useRef } from 'react';

const gasa = [
  `태극이 동정하고 임양이 조판하야
    천일생수 지이생화 천삼생목지사 생금천오 생초하니
    만물이 조화생이라 금일영가 객사혼신
    서낭고가 분명커늘 아니풀지 못하리오
    선망조상 후망조상 당대조상 상하로 살피시어 
    애석하고 가련한 서낭고가 분명하니
    서리서리 맺혀있는 서낭고를 풀어가오
    
    고조불이 서낭고도 풀어시고
    증조불이 서낭고도 풀어시고
    당조불이 서낭고도 풀어시고
    부조불이 서낭고도 풀어시고
    원가불이 서낭고도 풀어시고
    외가불이 서낭고도 풀어시고
    원족풀이 서낭고도 풀어시고
    근족불이 서낭고도 풀어시고
    서족불이 서낭고도 풀어시고
    무자불이 서낭고도 풀어시고
    청춘소년 서낭고도 풀어시고
    남서낭 여서낭 서낭고도 풀어시고
    문도지 색도지 서낭고도 풀어시고
    남경북경 사신 서낭고도 풀어시고
    재재봉봉 넘던서낭 서낭고도 풀어시고
    동악태산 서낭고는 삼팥목으로 풀어시고
    남악화산 서낭고는 이칠화로 풀어시고
    서악금산 서낭고는 사구금으로 풀어시고
    북악형산 서낭고는 일육수로 풀어시고
    
    높은산의 서낭고도 풀어시고
    낮은산의 서낭고도 풀어시고
    팔도명산 서낭고도 풀어시고
    사해용궁 서낭고도 풀어시고
    본주본산 서낭고도 풀어시고
    앞도당도 서낭고도 풀어시고
    뒷도당도 서낭고도 풀어시고
    올로줄로 서낭고도 풀어시고
    오다가다 서낭고도 풀어시고
    청춘서낭 소년서당 서낭고도 풀어시고

    쌓이고쌓인 서낭고를 풀어드리니
    맺힌 원한 풀으시고
    맺힌 한도 풀으시고
    섭섭한 마음도 풀으시사
    금일 정성 발원으로
    모진 악심 버리시고
    독한 마음 버리시고
    선심선자 마음돌려
    청전한을 풀으시고
    서낭고를 풀어갈제
    지장보살 인도받아
    명부지옥 면하시고
    미륵보살 인도하에
    압장소멸 하옵시고
    천상의 옥황상제님전 천명으로
    인도환생 하옵소서
    
    동악태산 군웅고는 삼팔목에 풀어시고
    남악화산 군웅고는 이칠화로 풀어시고
    서악금산 군웅고는 사구금에 풀어시고
    북악형산 군웅고는 일육수에 풀어시고
    중앙고산 군웅고는 오십토로 풀어시고

    동해바다 군웅고는 삼팔목에 풀어시고
    남해바다 군웅고는 이칠화로 풀어시고
    서해바다 군웅고는 사구금에 풀어시고
    북해바다 군웅고는 일육수로 풀어시고
    사해바다 군웅고는 오십토로 풀어시고
    남도당에 군웅고를 풀어시고
    여도당에 군웅고를 풀어시고
    터왕터전 군웅고를 풀어시고
    
    팔도명산 산신서낭 군웅고도 풀어시고
    사해바다 용궁서낭 군웅고도 풀어시고
    만조상에 객사군웅 군웅고도 풀어시고
    신조상에 사줄군웅 군웅고도 풀어시고
    이고랑산 도당군웅 군웅고도 풀어시고
    양산에 본향군웅 군웅고도 풀어시고
    워주월강 서낭군웅 군웅고도 풀어시고
    골루나려 수살군웅 군웅고도 풀어시고
    천너머니 성수군웅 군웅고도 풀어시고
    거리노중 홍액군웅 군웅고도 풀어시고
    생살귀군웅 외진군웅 군웅고도 풀어시고
    진상문 신상고에 군웅고도 풀어시고
    사자수비 군웅고도 풀어시고
    객사수비 영산수비 일체군웅고도 풀어시어

    죽은영혼
    평화세계 죽은영혼
    안락세계 극락으로 들어가오
    나무아미타불
    나무아미타불
    나무아미타불`,
];

interface GasaModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
}

function GasaModal({ setModal }: GasaModalProps) {
  const gasaBoxRef = useRef<HTMLParagraphElement | null>(null);
  // 모달 끄기
  const closeModal = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== gasaBoxRef.current) {
      setModal(false);
    }
  };

  return (
    <div className={styles.gasacontainer} onClick={closeModal} tabIndex={0}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <span className={styles.close} onClick={closeModal}>
          X
        </span>
      </div>
      <div className={styles.gasabox}>
        <p ref={gasaBoxRef}>{gasa}</p>
      </div>
    </div>
  );
}

export default GasaModal;
