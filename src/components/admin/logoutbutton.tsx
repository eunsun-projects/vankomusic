'use client';

import useAuth from '@/hooks/auth/auth.hook';
import styles from '@/styles/admin.module.css';

function LogOutButton() {
  const { logOut } = useAuth();

  return (
    <div className={styles.logoutbtn} onClick={logOut}>
      Logout
    </div>
  );
}

export default LogOutButton;
