'use client';

import useAuth from '@/hooks/auth/auth.hook';
import AdminTemplate from './adminTemplate';
import LoginButton from './loginbutton';

function AdminLoginSequence() {
  const { user } = useAuth();

  const isAdmin =
    user?.email === process.env.NEXT_PUBLIC_SCREEN_MAIL ||
    user?.email === process.env.NEXT_PUBLIC_VANKO_MAIL ||
    user?.email === process.env.NEXT_PUBLIC_EUNOH_MAIL;

  return <>{isAdmin ? <AdminTemplate /> : <LoginButton />}</>;
}

export default AdminLoginSequence;
