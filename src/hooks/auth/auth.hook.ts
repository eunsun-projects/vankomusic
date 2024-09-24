'use client';

import { QUERY_KEY_USER } from '@/constants/query.constant';
import { useLogOutMutation } from '@/hooks/mutations';
import { useLogInQuery, useUserQuery } from '@/hooks/queries';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useAuth() {
  const [isLogInStart, setIsLogInStart] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { data: user, isPending: isUserPending, error: userError } = useUserQuery();
  const {
    data: loginData,
    isPending: isLogInPending,
    error: logInError,
  } = useLogInQuery({ provider: 'google', isStart: isLogInStart });
  const { mutate: logOutMutate } = useLogOutMutation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginWithProvider = useCallback(() => {
    setIsLogInStart(true);
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY_USER] });
  }, [queryClient]);

  const logOut = useCallback(() => {
    if (!user) alert('로그인 상태가 아닙니다.');
    logOutMutate();
  }, [logOutMutate, user]);

  useEffect(() => {
    if (loginData?.url) router.push(loginData.url);
  }, [loginData, router]);

  useEffect(() => {
    if (isLogInPending || isUserPending) {
      setIsPending(true);
    } else {
      setIsPending(false);
    }
  }, [isLogInPending, isUserPending]);

  useEffect(() => {
    if (userError || logInError) {
      setError(userError || logInError);
    } else {
      setError(null);
    }
  }, [userError, logInError]);

  // useEffect(() => {
  //   console.log('user ======>', user);
  // }, [user]);

  return {
    user,
    isPending,
    error,
    loginWithProvider,
    logOut,
  };
}
