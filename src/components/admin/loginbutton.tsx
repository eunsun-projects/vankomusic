'use client';

import useAuth from '@/hooks/auth/auth.hook';
import styles from '@/styles/admin.module.css';

export default function LoginButton() {
  const { loginWithProvider } = useAuth();

  return (
    <div
      className={styles.loginpage}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
      }}
    >
      <span>구글로 로그인 해 주세요.</span>
      <div className={styles.loginbtn} onClick={loginWithProvider}>
        로그인
      </div>
    </div>
  );
}
