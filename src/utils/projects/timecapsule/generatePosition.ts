export const generateRandomPosition = (): number => {
  const value = Math.random() * 20 - 10; // -10 ~ 10 범위 생성
  if (value > -2 && value < 2) {
    // 중앙부(-2 ~ 2)에 속하면 재생성
    return generateRandomPosition();
  }
  return value;
};
